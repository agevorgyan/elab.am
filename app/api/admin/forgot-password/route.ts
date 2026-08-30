import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email-notifications';
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`reset_req:${clientIp}`, RATE_LIMIT_PRESETS.AUTH_RESET);

  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  const GENERIC_SUCCESS_RESPONSE = NextResponse.json({
    success: true,
    message: 'If an account with that email exists, we sent a password reset link.',
  });

  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return GENERIC_SUCCESS_RESPONSE;
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Do not reveal whether user exists
      return GENERIC_SUCCESS_RESPONSE;
    }

    // 1. Generate cryptographically secure random token (32 bytes = 64 hex chars)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // 2. Store SHA-256 hash of token in database (never store raw token in DB or logs)
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Delete existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email: cleanEmail } });

    // Set 1-hour expiration
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email: cleanEmail,
        tokenHash,
        expiresAt,
      },
    });

    // 3. Send email using configured provider
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin || 'http://localhost:3000';
    const baseUrl = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

    const subject = 'Reset Your eLab Admin Password';
    const html = `
      <div style="font-family: sans-serif; background-color: #090a0f; color: #f8fafc; padding: 32px; border-radius: 16px;">
        <h2 style="color: #00dc93;">eLab Admin Security</h2>
        <p style="color: #94a3b8; font-size: 14px;">We received a request to reset the password for your eLab Admin account (${cleanEmail}).</p>
        
        <div style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #00dc93; color: #000000; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; display: inline-block;">
            Reset Admin Password
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px;">This link will expire in 60 minutes. If you did not request this, you can safely ignore this email.</p>
        <p style="color: #475569; font-size: 11px; margin-top: 16px;">Link URL: ${resetUrl}</p>
      </div>
    `;

    const text = `
eLab Admin Password Reset
----------------------------------------
We received a request to reset the password for your eLab Admin account (${cleanEmail}).

Click the link below or copy it into your browser to reset your password:
${resetUrl}

This link will expire in 60 minutes.
    `.trim();

    sendEmail({
      to: cleanEmail,
      subject,
      html,
      text,
    }).catch(() => {});

    return GENERIC_SUCCESS_RESPONSE;
  } catch {
    return GENERIC_SUCCESS_RESPONSE;
  }
}

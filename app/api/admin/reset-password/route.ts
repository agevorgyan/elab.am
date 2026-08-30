import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword, confirmPassword } = body;

    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { error: 'Invalid or missing password reset token.' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match.' },
        { status: 400 }
      );
    }

    // Compute SHA-256 hash of token to match stored database hash
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset link. Please request a new link.' },
        { status: 400 }
      );
    }

    if (new Date() > resetRecord.expiresAt) {
      // Single-use cleanup for expired token
      await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }).catch(() => {});
      return NextResponse.json(
        { error: 'Password reset link has expired. Please request a new link.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }).catch(() => {});
      return NextResponse.json(
        { error: 'User account no longer exists.' },
        { status: 400 }
      );
    }

    // 1. Hash new password using Argon2id
    const hashedNewPassword = await hashPassword(newPassword);

    // 2. Update user password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedNewPassword },
    });

    // 3. Single-use token consumption: delete token record
    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } }).catch(() => {});

    // 4. Invalidate all existing active sessions for security
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    // 5. Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_COMPLETED',
        resource: `User:${user.id}`,
        details: `Password reset successfully completed and all active sessions invalidated for ${user.email}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully! You can now log in with your new password.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to reset password.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

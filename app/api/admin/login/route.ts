import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createAdminSession } from '@/lib/auth';
import { logAuditAction } from '@/lib/audit-logger';
import { getClientIp, checkRateLimit, createRateLimitResponse, resetRateLimitKey, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

// Valid Argon2id dummy hash for constant-time timing attack mitigation
const DUMMY_ARGON2_HASH = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQxMjM0NTY3OA$12345678901234567890123456789012';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const clientIp = getClientIp(req);
    const rateLimitKey = `login:${clientIp}|${normalizedEmail}`;

    // Rate Limit Check per IP + Email
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMIT_PRESETS.AUTH_LOGIN);
    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Query user by normalized email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If user not found, perform dummy verification to prevent timing attack enumeration
    if (!user) {
      await verifyPassword(password, DUMMY_ARGON2_HASH).catch(() => {});
      logAuditAction({
        req,
        action: 'LOGIN_FAILED',
        entityType: 'User',
        resource: 'Auth:Login',
        details: `Failed login attempt for nonexistent user email: ${normalizedEmail}`,
      }).catch(() => {});

      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify password against stored Argon2id hash
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      logAuditAction({
        req,
        userId: user.id,
        action: 'LOGIN_FAILED',
        entityType: 'User',
        entityId: user.id,
        resource: `User:${user.id}`,
        details: `Failed login attempt with invalid password for user: ${user.email}`,
      }).catch(() => {});

      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Create session in database & set HttpOnly cookie
    await createAdminSession(user.id);
    resetRateLimitKey(rateLimitKey);

    // Record audit log entry
    logAuditAction({
      req,
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user.id,
      resource: `User:${user.id}`,
      details: `User ${user.email} logged in successfully.`,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed. Please try again later.' },
      { status: 500 }
    );
  }
}

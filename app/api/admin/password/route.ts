import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission, verifyPassword, hashPassword, SESSION_COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const rateLimitResult = checkRateLimit(`pw_change:${user.id}`, RATE_LIMIT_PRESETS.AUTH_RESET);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password cannot be identical to current password.' }, { status: 400 });
    }

    // Fetch user with password hash from database
    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userRecord || !userRecord.passwordHash) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Verify current password against stored Argon2id hash
    const isValid = await verifyPassword(currentPassword, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect current password.' }, { status: 400 });
    }

    // Hash new password using Argon2id
    const hashedNewPassword = await hashPassword(newPassword);

    // Update user password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedNewPassword },
    });

    // Get current session token from cookie
    const cookieStore = await cookies();
    const currentToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    // Invalidate all other active sessions for security
    if (currentToken) {
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          NOT: { token: currentToken },
        },
      });
    }

    // Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CHANGE_PASSWORD',
        resource: `User:${user.id}`,
        details: `Password changed and other sessions invalidated for ${user.email}`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to change password.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

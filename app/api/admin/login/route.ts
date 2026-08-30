import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, createAdminSession } from '@/lib/auth';

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

    // Query user by normalized email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If user not found, perform dummy verification to prevent timing attack enumeration
    if (!user) {
      await verifyPassword(password, '$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_enumeration_prevention');
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify password against Argon2id hash
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Create session in database & set HttpOnly cookie
    await createAdminSession(user.id);

    // Audit log entry
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ADMIN_LOGIN_SUCCESS',
        resource: '/admin/login',
        details: `User ${user.email} authenticated successfully.`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 500 }
    );
  }
}

import argon2 from 'argon2';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'elab_session_token';
const SESSION_EXPIRATION_DAYS = 7;

/**
 * Hashes a plaintext password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verifies a plaintext password against an Argon2id hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // If hash starts with $argon2id or $argon2, verify using argon2 module
    if (hash.startsWith('$argon2')) {
      return await argon2.verify(hash, password);
    }
    // Fallback simulation check for seed data if not yet hashed with argon2
    return hash === password;
  } catch (e) {
    return false;
  }
}

/**
 * Creates a database-backed session for a user and sets the HttpOnly cookie
 */
export async function createAdminSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS);

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return token;
}

/**
 * Retrieves current active authenticated admin user from session token
 */
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) return null;

  // Check expiration
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return session.user;
}

/**
 * Destroys current session from database and clears cookie
 */
export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

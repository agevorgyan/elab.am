import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSec: number;
}

export interface RateLimitConfig {
  limit: number; // Max requests allowed
  windowMs: number; // Time window in milliseconds
}

// Preset rate limit configurations
export const RATE_LIMIT_PRESETS: Record<string, RateLimitConfig> = {
  // Auth Login: 5 attempts per 15 minutes per IP+email
  AUTH_LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 },
  // Auth Password Reset: 3 attempts per 15 minutes per IP+email
  AUTH_RESET: { limit: 3, windowMs: 15 * 60 * 1000 },
  // Contact Form: 5 submissions per 10 minutes per IP
  CONTACT_FORM: { limit: 5, windowMs: 10 * 60 * 1000 },
  // Admin Mutations: 30 operations per 1 minute per IP
  ADMIN_MUTATION: { limit: 30, windowMs: 60 * 1000 },
  // Public Read API: 60 requests per 1 minute per IP
  PUBLIC_API: { limit: 60, windowMs: 60 * 1000 },
};

// In-memory sliding window store
const memoryStore = new Map<string, number[]>();

// Periodic garbage collection to prevent memory leaks (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of memoryStore.entries()) {
      const valid = timestamps.filter((t) => t > now - 30 * 60 * 1000);
      if (valid.length === 0) {
        memoryStore.delete(key);
      } else {
        memoryStore.set(key, valid);
      }
    }
  }, 5 * 60 * 1000);

  if (timer.unref) {
    timer.unref();
  }
}

/**
 * Extracts client IP address safely from NextRequest headers
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}

/**
 * Checks rate limit for a specific key against a config window
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const timestamps = memoryStore.get(key) || [];
  const validTimestamps = timestamps.filter((t) => t > windowStart);

  if (validTimestamps.length >= config.limit) {
    const oldest = validTimestamps[0];
    const resetMs = oldest + config.windowMs - now;
    const retryAfterSec = Math.ceil(resetMs / 1000);

    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetMs,
      retryAfterSec: Math.max(retryAfterSec, 1),
    };
  }

  validTimestamps.push(now);
  memoryStore.set(key, validTimestamps);

  const remaining = config.limit - validTimestamps.length;
  const resetMs = config.windowMs;

  return {
    success: true,
    limit: config.limit,
    remaining,
    resetMs,
    retryAfterSec: 0,
  };
}

/**
 * Returns a standard safe 429 Too Many Requests HTTP response with Retry-After headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests. Please slow down and try again later.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetMs / 1000)),
      },
    }
  );
}

/**
 * Resets rate limit for a specific key (useful for successful logins)
 */
export function resetRateLimitKey(key: string): void {
  memoryStore.delete(key);
}

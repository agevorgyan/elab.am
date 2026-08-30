import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/logger';

export interface ApiErrorOptions {
  status?: number;
  logMessage?: string;
  context?: Record<string, unknown>;
}

/**
 * Production-grade API error handler: Logs errors safely and returns safe user-facing responses
 */
export function handleApiError(error: unknown, options?: ApiErrorOptions): NextResponse {
  const isProd = process.env.NODE_ENV === 'production';
  let statusCode = options?.status || 500;
  let userMessage = 'An unexpected error occurred. Please try again later.';

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      statusCode = 409;
      userMessage = 'A record with this unique attribute already exists.';
    } else if (error.code === 'P2025') {
      statusCode = 404;
      userMessage = 'The requested resource was not found.';
    }
  } else if (error instanceof Error) {
    if (error.message.includes('Unauthorized') || error.message.includes('Unauthenticated')) {
      statusCode = 401;
      userMessage = error.message;
    } else if (error.message.includes('Forbidden')) {
      statusCode = 403;
      userMessage = error.message;
    } else if (!isProd) {
      userMessage = error.message;
    }
  }

  const logMessage = options?.logMessage || userMessage;
  logger.error(logMessage, error, {
    statusCode,
    ...options?.context,
  });

  return NextResponse.json(
    {
      error: userMessage,
      ...(isProd ? {} : { details: error instanceof Error ? error.message : String(error) }),
    },
    { status: statusCode }
  );
}

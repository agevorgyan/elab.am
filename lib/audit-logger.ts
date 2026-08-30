import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export interface AuditLogPayload {
  req?: NextRequest | Request;
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  resource?: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

const SENSITIVE_PATTERNS = [
  'password',
  'passwd',
  'token',
  'apikey',
  'api_key',
  'secret',
  'auth',
  'cookie',
  'session',
  'private',
  'credential',
];

/**
 * Recursively redacts sensitive keys (passwords, tokens, API keys) from log metadata
 */
export function sanitizeMetadata(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeMetadata);

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isSensitive = SENSITIVE_PATTERNS.some((pattern) => {
      const normPattern = pattern.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normKey.includes(normPattern);
    });

    if (isSensitive) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeMetadata(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Creates an AuditLog entry in PostgreSQL with IP, User-Agent, and sanitized metadata
 */
export async function logAuditAction(payload: AuditLogPayload): Promise<void> {
  try {
    const { req, userId, action, entityType, entityId, resource, details, metadata } = payload;

    let ipAddress = '127.0.0.1';
    let userAgent = 'Unknown';

    if (req) {
      const headers = req.headers;
      ipAddress = headers.get('x-forwarded-for') || headers.get('x-real-ip') || '127.0.0.1';
      userAgent = headers.get('user-agent') || 'Unknown';
    }

    const cleanMeta = metadata ? sanitizeMetadata(metadata) : null;
    const finalDetails = details || (cleanMeta ? JSON.stringify(cleanMeta) : null);
    const finalResource = resource || (entityType ? `${entityType}:${entityId || 'N/A'}` : 'System');

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType: entityType || null,
        entityId: entityId || null,
        resource: finalResource,
        details: finalDetails,
        ipAddress,
        userAgent,
      },
    });
  } catch (err) {
    console.warn('[Audit Logger Warning]: Failed to write audit log entry:', err);
  }
}

/**
 * Production-Grade Structured Logger with Automatic Secret Redaction & Sentry/Webhook Integration
 */

export type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'currentpassword',
  'newpassword',
  'confirmpassword',
  'token',
  'secret',
  'authorization',
  'cookie',
  'set-cookie',
  'database_url',
  'apikey',
  'api_key',
  'privatekey',
  'session',
];

/**
 * Recursively redacts sensitive keys from log context payloads
 */
export function redactSecrets(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Redact connection strings containing credentials
    return obj.replace(/(postgres|postgresql|mysql):\/\/[^:]+:[^@]+@/gi, '$1://[REDACTED]:[REDACTED]@');
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSecrets);
  }

  if (typeof obj === 'object') {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSecrets(value);
      }
    }
    return redacted;
  }

  return obj;
}

/**
 * Captures error and optionally dispatches to external monitoring provider (e.g. Sentry / Webhook)
 */
async function captureExternalMonitoring(level: LogLevel, message: string, context?: LogContext, error?: Error) {
  const monitoringUrl = process.env.ERROR_MONITORING_URL || process.env.SENTRY_DSN;
  if (!monitoringUrl) return;

  try {
    const payload = {
      level,
      message,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      errorName: error?.name,
      errorMessage: error?.message,
      stack: error?.stack,
      context: redactSecrets(context),
    };

    if (monitoringUrl.startsWith('http')) {
      await fetch(monitoringUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  } catch {}
}

export const logger = {
  info(message: string, context?: LogContext) {
    const safeContext = redactSecrets(context);
    const entry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...(safeContext ? { context: safeContext } : {}),
    };

    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[INFO] [${entry.timestamp}] ${message}`, safeContext || '');
    }
  },

  warn(message: string, context?: LogContext) {
    const safeContext = redactSecrets(context);
    const entry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...(safeContext ? { context: safeContext } : {}),
    };

    if (process.env.NODE_ENV === 'production') {
      console.warn(JSON.stringify(entry));
    } else {
      console.warn(`[WARN] [${entry.timestamp}] ${message}`, safeContext || '');
    }

    captureExternalMonitoring('warn', message, context);
  },

  error(message: string, error?: unknown, context?: LogContext) {
    const errObj = error instanceof Error ? error : undefined;
    const safeContext = redactSecrets({
      ...context,
      errorName: errObj?.name,
      errorMessage: errObj?.message,
      ...(process.env.NODE_ENV !== 'production' ? { stack: errObj?.stack } : {}),
    });

    const entry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context: safeContext,
    };

    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify(entry));
    } else {
      console.error(`[ERROR] [${entry.timestamp}] ${message}`, errObj || '', safeContext || '');
    }

    captureExternalMonitoring('error', message, context, errObj);
  },
};

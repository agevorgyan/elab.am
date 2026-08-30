/**
 * Production-Grade Environment Variable Validation & Configuration Manager
 * Handles startup validation, clear error messages, and separates public vs private secrets.
 */

interface ServerEnv {
  DATABASE_URL: string;
  AUTH_SECRET: string;
  CONTACT_EMAIL: string;
  EMAIL_PROVIDER_KEY?: string;
  CONTACT_WEBHOOK_URL?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

interface PublicEnv {
  NEXT_PUBLIC_SITE_URL: string;
  GOOGLE_ANALYTICS_ID?: string;
  META_PIXEL_ID?: string;
}

function getEnvVar(key: string, defaultValue?: string, required = false): string {
  const value = process.env[key] || defaultValue;

  if (required && (!value || value.trim() === '')) {
    throw new Error(
      `❌ [eLab Environment Error]: Missing required environment variable '${key}'. ` +
      `Please define '${key}' in your environment or .env file. See .env.example for details.`
    );
  }

  return value || '';
}

/**
 * Validates and exposes server-side private secrets.
 * NEVER import serverEnv into client-rendered React components!
 */
export function validateServerEnv(): ServerEnv {
  const isProd = process.env.NODE_ENV === 'production';

  const DATABASE_URL = getEnvVar(
    'DATABASE_URL',
    'postgresql://postgres:postgres@localhost:5432/elab_db?schema=public',
    isProd
  );

  const AUTH_SECRET = getEnvVar(
    'AUTH_SECRET',
    'eLab_Super_Secret_Auth_Token_32_Bytes_Long_Random_Key',
    isProd
  );

  if (AUTH_SECRET.length < 16) {
    console.warn(
      `⚠️ [eLab Environment Warning]: 'AUTH_SECRET' should be at least 16 characters long for cryptographic security.`
    );
  }

  const CONTACT_EMAIL = getEnvVar('CONTACT_EMAIL', 'hello@elab.am');
  const EMAIL_PROVIDER_KEY = getEnvVar('EMAIL_PROVIDER_KEY');
  const CONTACT_WEBHOOK_URL = getEnvVar('CONTACT_WEBHOOK_URL');
  const NODE_ENV = (process.env.NODE_ENV || 'development') as ServerEnv['NODE_ENV'];

  return {
    DATABASE_URL,
    AUTH_SECRET,
    CONTACT_EMAIL,
    EMAIL_PROVIDER_KEY,
    CONTACT_WEBHOOK_URL,
    NODE_ENV,
  };
}

/**
 * Validates and exposes public client environment variables.
 * Safe to consume in client or server components.
 */
export function validatePublicEnv(): PublicEnv {
  const NEXT_PUBLIC_SITE_URL = getEnvVar('NEXT_PUBLIC_SITE_URL', 'https://elab.am');
  const GOOGLE_ANALYTICS_ID = getEnvVar('GOOGLE_ANALYTICS_ID') || getEnvVar('NEXT_PUBLIC_GA_ID');
  const META_PIXEL_ID = getEnvVar('META_PIXEL_ID') || getEnvVar('NEXT_PUBLIC_PIXEL_ID');

  return {
    NEXT_PUBLIC_SITE_URL,
    GOOGLE_ANALYTICS_ID,
    META_PIXEL_ID,
  };
}

// Auto-validate on module import in server environment
export const env = {
  server: validateServerEnv(),
  public: validatePublicEnv(),
};

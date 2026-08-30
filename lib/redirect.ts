/**
 * Validates and sanitizes a redirect URL to prevent Open Redirect Vulnerabilities.
 * Safe for consumption in both Client Components and Server Components/Middleware.
 */
export function getSafeRedirectUrl(redirectParam: string | null | undefined): string {
  if (!redirectParam || typeof redirectParam !== 'string') {
    return '/admin/dashboard';
  }

  const trimmed = redirectParam.trim();

  // Prevent protocol-relative URLs (//example.com), external domains (http://), javascript:, data:, backslashes
  if (
    trimmed.startsWith('//') ||
    trimmed.includes('://') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.includes('\\')
  ) {
    return '/admin/dashboard';
  }

  // Must strictly start with /admin and be a relative path
  if (trimmed.startsWith('/admin') && !trimmed.startsWith('/admin/login')) {
    return trimmed;
  }

  return '/admin/dashboard';
}

import { NextRequest, NextResponse } from 'next/server';
import { getPublishedServices } from '@/lib/services';
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`pub_api:${clientIp}`, RATE_LIMIT_PRESETS.PUBLIC_API);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }
  try {
    const services = await getPublishedServices();
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

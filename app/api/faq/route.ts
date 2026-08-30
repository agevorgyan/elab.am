import { NextRequest, NextResponse } from 'next/server';
import { getPublishedFaqsPublic } from '@/lib/faq-db';
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`pub_api:${clientIp}`, RATE_LIMIT_PRESETS.PUBLIC_API);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }
  try {
    const faqs = await getPublishedFaqsPublic();
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ faqs: [] });
  }
}

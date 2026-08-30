import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPortfolioProjects } from '@/lib/portfolio-db';
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`pub_api:${clientIp}`, RATE_LIMIT_PRESETS.PUBLIC_API);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }
  try {
    const projects = await getPublishedPortfolioProjects();
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

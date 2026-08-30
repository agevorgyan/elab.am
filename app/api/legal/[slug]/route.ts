import { NextRequest, NextResponse } from 'next/server';
import { getPublishedLegalPageBySlug } from '@/lib/legal-db';
import { getClientIp, checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS } from '@/lib/rate-limiter';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`pub_api:${clientIp}`, RATE_LIMIT_PRESETS.PUBLIC_API);
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }
  const { slug } = await params;

  try {
    const page = await getPublishedLegalPageBySlug(slug);
    if (!page) {
      return NextResponse.json({ error: 'Legal page not found or unpublished.' }, { status: 404 });
    }
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch legal page.' }, { status: 500 });
  }
}

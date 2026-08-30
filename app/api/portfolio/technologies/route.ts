import { NextResponse } from 'next/server';
import { getPublishedTechnologies } from '@/lib/portfolio-technologies';

export async function GET() {
  try {
    const technologies = await getPublishedTechnologies();
    return NextResponse.json({ technologies });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch technologies' }, { status: 500 });
  }
}

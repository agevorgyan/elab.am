import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioProjectBySlug } from '@/lib/portfolio-db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const project = await getPortfolioProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project detail' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getPublishedPortfolioProjects } from '@/lib/portfolio-db';

export async function GET() {
  try {
    const projects = await getPublishedPortfolioProjects();
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

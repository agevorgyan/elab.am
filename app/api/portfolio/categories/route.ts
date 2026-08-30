import { NextResponse } from 'next/server';
import { getPublishedPortfolioCategories } from '@/lib/portfolio-categories';

export async function GET() {
  try {
    const categories = await getPublishedPortfolioCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

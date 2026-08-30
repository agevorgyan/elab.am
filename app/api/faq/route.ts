import { NextResponse } from 'next/server';
import { getPublishedFaqsPublic } from '@/lib/faq-db';

export async function GET() {
  try {
    const faqs = await getPublishedFaqsPublic();
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ faqs: [] });
  }
}

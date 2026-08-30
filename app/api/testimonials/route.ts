import { NextResponse } from 'next/server';
import { getPublishedTestimonialsPublic } from '@/lib/testimonials-db';

export async function GET() {
  try {
    const testimonials = await getPublishedTestimonialsPublic();
    return NextResponse.json({ testimonials });
  } catch {
    return NextResponse.json({ testimonials: [] });
  }
}

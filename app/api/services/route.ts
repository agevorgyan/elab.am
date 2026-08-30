import { NextResponse } from 'next/server';
import { getPublishedServices } from '@/lib/services';

export async function GET() {
  try {
    const services = await getPublishedServices();
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Server-side RBAC Permission check (Rules #7, #8)
  const { user, errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { email, phone, siteName } = body;

    // Server-side validation
    if (email && (!email.includes('@') || !email.includes('.'))) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    if (phone && phone.trim().length < 5) {
      return NextResponse.json({ error: 'Invalid phone number format.' }, { status: 400 });
    }

    if (siteName && siteName.trim().length === 0) {
      return NextResponse.json({ error: 'Company/brand name cannot be empty.' }, { status: 400 });
    }

    const updated = await updateSiteSettings(body);

    // Record AuditLog entry
    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_SITE_SETTINGS',
          resource: 'SiteSettings',
          details: `Updated site settings: ${Object.keys(body).join(', ')}`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update database settings.' },
      { status: 500 }
    );
  }
}

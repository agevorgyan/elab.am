import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getPaginatedLeadsAdmin, createLeadPublic } from '@/lib/leads-db';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminPermission('manage_leads');
  if (errorResponse) return errorResponse;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || 'ALL';
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = (url.searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

  try {
    const result = await getPaginatedLeadsAdmin(page, limit, search, status, sortBy, sortOrder);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch CRM leads.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_leads');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const created = await createLeadPublic(body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_LEAD_MANUAL',
          resource: `Lead:${created.id}`,
          details: `Manual lead created for ${created.name} (${created.company || 'No Company'})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, lead: created });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create lead.' },
      { status: 400 }
    );
  }
}

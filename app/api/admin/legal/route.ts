import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getAllLegalPagesAdmin, upsertLegalPageAdmin } from '@/lib/legal-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  try {
    const pages = await getAllLegalPagesAdmin();
    return NextResponse.json({ pages });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch legal pages.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (!body.slug || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Slug, title, and content are required.' },
        { status: 400 }
      );
    }

    const updated = await upsertLegalPageAdmin(body);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'UPDATE_SETTINGS',
      entityType: 'LegalPage',
      entityId: updated.id,
      resource: `Legal:${updated.slug}`,
      details: `Updated legal page ${updated.title} (v${updated.version})`,
    }).catch(() => {});

    return NextResponse.json({ success: true, page: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save legal page.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

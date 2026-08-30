import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { deleteLegalPageAdmin } from '@/lib/legal-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const deleted = await deleteLegalPageAdmin(id);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'UPDATE_SETTINGS',
      entityType: 'LegalPage',
      entityId: id,
      resource: `Legal:${id}`,
      details: `Deleted legal page ${deleted.slug}`,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete legal page.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

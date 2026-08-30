import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { updateFaqAdmin, deleteFaqAdmin } from '@/lib/faq-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const updated = await updateFaqAdmin(id, body);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'UPDATE_FAQ',
      entityType: 'FAQ',
      entityId: id,
      resource: `FAQ:${id}`,
      details: `Updated FAQ: ${updated.question}`,
    }).catch(() => {});

    return NextResponse.json({ success: true, faq: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update FAQ.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const deleted = await deleteFaqAdmin(id);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'DELETE_FAQ',
      entityType: 'FAQ',
      entityId: id,
      resource: `FAQ:${id}`,
      details: `Deleted FAQ: ${deleted.question}`,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete FAQ.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

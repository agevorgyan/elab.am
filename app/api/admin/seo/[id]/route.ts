import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { deleteSeoMetadataAdmin } from '@/lib/seo-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const deleted = await deleteSeoMetadataAdmin(id);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'UPDATE_SETTINGS',
      entityType: 'SeoMetadata',
      entityId: id,
      resource: `SEO:${id}`,
      details: `Deleted custom SEO override for ${deleted.path}`,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete SEO metadata.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

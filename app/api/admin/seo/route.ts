import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getAllSeoMetadataAdmin, upsertSeoMetadataAdmin } from '@/lib/seo-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  try {
    const seoRecords = await getAllSeoMetadataAdmin();
    return NextResponse.json({ seoRecords });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch SEO metadata.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_settings');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (!body.path || !body.title || !body.description) {
      return NextResponse.json(
        { error: 'Path, SEO Title, and Meta Description are required.' },
        { status: 400 }
      );
    }

    const updated = await upsertSeoMetadataAdmin(body);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'UPDATE_SETTINGS',
      entityType: 'SeoMetadata',
      entityId: updated.id,
      resource: `SEO:${updated.path}`,
      details: `Updated SEO metadata for path ${updated.path}`,
    }).catch(() => {});

    return NextResponse.json({ success: true, seoMetadata: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save SEO metadata.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

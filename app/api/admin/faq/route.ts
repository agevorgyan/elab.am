import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllFaqsAdmin,
  createFaqAdmin,
  reorderFaqsAdmin,
} from '@/lib/faq-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  try {
    const faqs = await getAllFaqsAdmin();
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin FAQs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderFaqsAdmin(body.orderedIds);
      logAuditAction({
        req,
        userId: user?.id,
        action: 'REORDER_FAQS',
        entityType: 'FAQ',
        resource: 'FAQ:Reorder',
        details: `Reordered ${body.orderedIds.length} FAQ items`,
      }).catch(() => {});

      return NextResponse.json({ success: true });
    }

    if (!body.question || !body.answer) {
      return NextResponse.json(
        { error: 'Question and answer are required.' },
        { status: 400 }
      );
    }

    const created = await createFaqAdmin(body);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'CREATE_FAQ',
      entityType: 'FAQ',
      entityId: created.id,
      resource: `FAQ:${created.id}`,
      details: `Created FAQ: ${created.question}`,
    }).catch(() => {});

    return NextResponse.json({ success: true, faq: created });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create FAQ item.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllTestimonialsAdmin,
  createTestimonialAdmin,
  reorderTestimonialsAdmin,
} from '@/lib/testimonials-db';
import { logAuditAction } from '@/lib/audit-logger';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  try {
    const testimonials = await getAllTestimonialsAdmin();
    return NextResponse.json({ testimonials });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin testimonials.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderTestimonialsAdmin(body.orderedIds);
      logAuditAction({
        req,
        userId: user?.id,
        action: 'REORDER_TESTIMONIALS',
        entityType: 'Testimonial',
        resource: 'Testimonial:Reorder',
        details: `Reordered ${body.orderedIds.length} testimonials`,
      }).catch(() => {});

      return NextResponse.json({ success: true });
    }

    if (!body.name || !body.content) {
      return NextResponse.json(
        { error: 'Name and testimonial text are required.' },
        { status: 400 }
      );
    }

    const created = await createTestimonialAdmin(body);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'CREATE_TESTIMONIAL',
      entityType: 'Testimonial',
      entityId: created.id,
      resource: `Testimonial:${created.id}`,
      details: `Created testimonial by ${created.name} (${created.company || 'N/A'})`,
    }).catch(() => {});

    return NextResponse.json({ success: true, testimonial: created });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create testimonial.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

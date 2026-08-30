import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { updateTestimonialAdmin, deleteTestimonialAdmin } from '@/lib/testimonials-db';
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
    const updated = await updateTestimonialAdmin(id, body);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'UPDATE_TESTIMONIAL',
      entityType: 'Testimonial',
      entityId: id,
      resource: `Testimonial:${id}`,
      details: `Updated testimonial for ${updated.name}`,
    }).catch(() => {});

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update testimonial.';
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
    const deleted = await deleteTestimonialAdmin(id);

    logAuditAction({
      req,
      userId: user?.id,
      action: 'DELETE_TESTIMONIAL',
      entityType: 'Testimonial',
      entityId: id,
      resource: `Testimonial:${id}`,
      details: `Deleted testimonial for ${deleted.name}`,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete testimonial.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

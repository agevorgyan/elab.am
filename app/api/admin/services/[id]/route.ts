import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { updateServiceAdmin, deleteServiceAdmin } from '@/lib/services';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const updated = await updateServiceAdmin(id, body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_SERVICE',
          resource: `Service:${id}`,
          details: `Updated service: ${updated.title} (${updated.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/');
    revalidatePath('/admin/content');

    return NextResponse.json({ success: true, service: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update service.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
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
    const deleted = await deleteServiceAdmin(id);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'DELETE_SERVICE',
          resource: `Service:${id}`,
          details: `Deleted service: ${deleted.title} (${deleted.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/');
    revalidatePath('/admin/content');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete service.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

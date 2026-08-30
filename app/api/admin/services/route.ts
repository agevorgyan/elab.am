import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllServicesAdmin,
  createServiceAdmin,
  reorderServicesAdmin,
} from '@/lib/services';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  try {
    const services = await getAllServicesAdmin();
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_services');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderServicesAdmin(body.orderedIds);
      revalidatePath('/');
      revalidatePath('/admin/content');
      return NextResponse.json({ success: true });
    }

    const created = await createServiceAdmin(body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_SERVICE',
          resource: `Service:${created.id}`,
          details: `Created service: ${created.title} (${created.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/');
    revalidatePath('/admin/content');

    return NextResponse.json({ success: true, service: created });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create service.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

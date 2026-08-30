import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { getAllServicesAdmin, createService, reorderServices } from '@/lib/services';
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

    // Check if reordering request
    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderServices(body.orderedIds);
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    const created = await createService(body);

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
    revalidatePath('/work');

    return NextResponse.json({ success: true, service: created });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create service.' },
      { status: 400 }
    );
  }
}

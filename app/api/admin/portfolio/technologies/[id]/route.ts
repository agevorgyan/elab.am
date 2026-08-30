import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { updateTechnology, deleteTechnology } from '@/lib/portfolio-technologies';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const updated = await updateTechnology(id, body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_PORTFOLIO_TECHNOLOGY',
          resource: `PortfolioTechnology:${id}`,
          details: `Updated technology: ${updated.name} (${updated.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true, technology: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update technology.';
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
  const { user, errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  const { id } = await params;

  try {
    const deleted = await deleteTechnology(id);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'DELETE_PORTFOLIO_TECHNOLOGY',
          resource: `PortfolioTechnology:${id}`,
          details: `Deleted technology: ${deleted.name} (${deleted.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete technology.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

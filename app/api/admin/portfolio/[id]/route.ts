import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import { updatePortfolioProject, deletePortfolioProject } from '@/lib/portfolio-db';
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
    const updated = await updatePortfolioProject(id, body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'UPDATE_PORTFOLIO_PROJECT',
          resource: `PortfolioProject:${id}`,
          details: `Updated project: ${updated.title} (${updated.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/work/[slug]', 'page');
    revalidatePath('/');

    return NextResponse.json({ success: true, project: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update portfolio project.';
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
    const deleted = await deletePortfolioProject(id);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'DELETE_PORTFOLIO_PROJECT',
          resource: `PortfolioProject:${id}`,
          details: `Deleted project: ${deleted.title} (${deleted.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete portfolio project.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

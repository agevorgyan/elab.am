import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllPortfolioProjectsAdmin,
  createPortfolioProject,
  duplicatePortfolioProject,
  reorderPortfolioProjects,
} from '@/lib/portfolio-db';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const projects = await getAllPortfolioProjectsAdmin();
    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin portfolio' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    // Check action: reorder
    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderPortfolioProjects(body.orderedIds);
      revalidatePath('/work');
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    // Check action: duplicate
    if (body.action === 'duplicate' && body.id) {
      const duplicated = await duplicatePortfolioProject(body.id);
      if (user) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'DUPLICATE_PORTFOLIO_PROJECT',
            resource: `PortfolioProject:${duplicated.id}`,
            details: `Duplicated portfolio project: ${duplicated.title} (${duplicated.slug})`,
            ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
          },
        }).catch(() => {});
      }
      revalidatePath('/work');
      revalidatePath('/');
      return NextResponse.json({ success: true, project: duplicated });
    }

    // Standard Create
    const created = await createPortfolioProject(body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_PORTFOLIO_PROJECT',
          resource: `PortfolioProject:${created.id}`,
          details: `Created portfolio project: ${created.title} (${created.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true, project: created });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create portfolio project.' },
      { status: 400 }
    );
  }
}

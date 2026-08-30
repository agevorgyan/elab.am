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
    return NextResponse.json({ error: 'Failed to fetch admin portfolio projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (body.action === 'duplicate' && body.id) {
      const duplicated = await duplicatePortfolioProject(body.id);
      revalidatePath('/work');
      revalidatePath('/');
      return NextResponse.json({ success: true, project: duplicated });
    }

    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderPortfolioProjects(body.orderedIds);
      revalidatePath('/work');
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    const created = await createPortfolioProject(body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_PORTFOLIO_PROJECT',
          resource: `PortfolioProject:${created.id}`,
          details: `Created project: ${created.title} (${created.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true, project: created });
  } catch (error: unknown) {
    let status = 400;
    let message = 'Failed to create portfolio project.';

    if (error instanceof Error) {
      message = error.message;
      if (
        message.includes('already exists') ||
        message.includes('already uses') ||
        message.includes('URL slug')
      ) {
        status = 409;
        message = 'Another project already uses this URL slug.';
      }
    }

    if (typeof error === 'object' && error !== null && 'code' in error && (error as Record<string, unknown>).code === 'P2002') {
      status = 409;
      message = 'Another project already uses this URL slug.';
    }

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

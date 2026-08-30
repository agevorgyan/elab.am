import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllPortfolioProjectsAdmin,
  getPaginatedPortfolioProjectsAdmin,
  createPortfolioProject,
  duplicatePortfolioProject,
  reorderPortfolioProjects,
} from '@/lib/portfolio-db';
import { revalidatePublicCmsContent } from '@/lib/revalidation';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || 'ALL';

  try {
    const result = await getPaginatedPortfolioProjectsAdmin(page, limit, search, category);
    return NextResponse.json(result);
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
      revalidatePublicCmsContent('portfolio', duplicated.slug);
      return NextResponse.json({ success: true, project: duplicated });
    }

    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderPortfolioProjects(body.orderedIds);
      revalidatePublicCmsContent('portfolio');
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

    revalidatePublicCmsContent('portfolio', created.slug);

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

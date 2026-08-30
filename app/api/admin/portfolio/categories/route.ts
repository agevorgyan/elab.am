import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllPortfolioCategoriesAdmin,
  createPortfolioCategory,
  reorderPortfolioCategories,
} from '@/lib/portfolio-categories';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const categories = await getAllPortfolioCategoriesAdmin();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();

    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      await reorderPortfolioCategories(body.orderedIds);
      revalidatePath('/work');
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    const created = await createPortfolioCategory(body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_PORTFOLIO_CATEGORY',
          resource: `PortfolioCategory:${created.id}`,
          details: `Created category: ${created.name} (${created.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true, category: created });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create category.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminPermission } from '@/lib/auth';
import {
  getAllTechnologiesAdmin,
  createTechnology,
} from '@/lib/portfolio-technologies';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const technologies = await getAllTechnologiesAdmin();
    return NextResponse.json({ technologies });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admin technologies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAdminPermission('manage_portfolio');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const created = await createTechnology(body);

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_PORTFOLIO_TECHNOLOGY',
          resource: `PortfolioTechnology:${created.id}`,
          details: `Created technology: ${created.name} (${created.slug})`,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        },
      }).catch(() => {});
    }

    revalidatePath('/work');
    revalidatePath('/');

    return NextResponse.json({ success: true, technology: created });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create technology.' },
      { status: 400 }
    );
  }
}

import prisma from '@/lib/prisma';

export interface DbPortfolioCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  active: boolean;
}

/**
 * Fetches active portfolio categories ordered by sortOrder for public website filter tabs
 */
export async function getPublishedPortfolioCategories(): Promise<DbPortfolioCategory[]> {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      sortOrder: c.sortOrder,
      active: c.active,
    }));
  } catch {
    return [
      { id: 'all', slug: 'all', name: 'All Projects', sortOrder: 1, active: true },
      { id: 'corporate', slug: 'corporate', name: 'Corporate', sortOrder: 2, active: true },
      { id: 'ecommerce', slug: 'ecommerce', name: 'E-Commerce', sortOrder: 3, active: true },
      { id: 'landing-page', slug: 'landing-page', name: 'Landing Pages', sortOrder: 4, active: true },
      { id: 'business-card', slug: 'business-card', name: 'Business Card', sortOrder: 5, active: true },
    ];
  }
}

/**
 * Fetches all portfolio categories for Admin management
 */
export async function getAllPortfolioCategoriesAdmin(): Promise<DbPortfolioCategory[]> {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      sortOrder: c.sortOrder,
      active: c.active,
    }));
  } catch {
    return [];
  }
}

/**
 * Creates a new portfolio category in PostgreSQL
 */
export async function createPortfolioCategory(data: Partial<DbPortfolioCategory>) {
  if (!data.name || !data.slug) {
    throw new Error('Name and slug are required.');
  }

  const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

  const existing = await prisma.portfolioCategory.findUnique({ where: { slug: normalizedSlug } });
  if (existing) {
    throw new Error(`Portfolio category with slug '${normalizedSlug}' already exists.`);
  }

  return await prisma.portfolioCategory.create({
    data: {
      name: data.name.trim(),
      slug: normalizedSlug,
      description: data.description || null,
      sortOrder: data.sortOrder ?? 0,
      active: data.active ?? true,
    },
  });
}

/**
 * Updates an existing portfolio category
 */
export async function updatePortfolioCategory(id: string, data: Partial<DbPortfolioCategory>) {
  const existing = await prisma.portfolioCategory.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Portfolio category not found.');
  }

  if (data.slug && data.slug !== existing.slug) {
    const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const slugCheck = await prisma.portfolioCategory.findUnique({ where: { slug: normalizedSlug } });
    if (slugCheck) {
      throw new Error(`Portfolio category with slug '${normalizedSlug}' already exists.`);
    }
    data.slug = normalizedSlug;
  }

  return await prisma.portfolioCategory.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.active !== undefined && { active: data.active }),
    },
  });
}

/**
 * Deletes a portfolio category safely
 */
export async function deletePortfolioCategory(id: string) {
  return await prisma.portfolioCategory.delete({ where: { id } });
}

/**
 * Reorders portfolio categories by list sequence
 */
export async function reorderPortfolioCategories(orderedIds: string[]) {
  for (let idx = 0; idx < orderedIds.length; idx++) {
    await prisma.portfolioCategory.update({
      where: { id: orderedIds[idx] },
      data: { sortOrder: idx + 1 },
    });
  }
}

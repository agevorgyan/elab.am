import prisma from '@/lib/prisma';

export interface DbPortfolioTechnology {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  url?: string | null;
  active: boolean;
}

/**
 * Fetches active technologies for public portfolio display
 */
export async function getPublishedTechnologies(): Promise<DbPortfolioTechnology[]> {
  try {
    const techs = await prisma.portfolioTechnology.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });

    return techs.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      icon: t.icon,
      url: t.url,
      active: t.active,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches all technologies for Admin management
 */
export async function getAllTechnologiesAdmin(): Promise<DbPortfolioTechnology[]> {
  try {
    const techs = await prisma.portfolioTechnology.findMany({
      orderBy: { name: 'asc' },
    });

    return techs.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      icon: t.icon,
      url: t.url,
      active: t.active,
    }));
  } catch {
    return [];
  }
}

/**
 * Creates a new technology record in PostgreSQL without duplicate records
 */
export async function createTechnology(data: Partial<DbPortfolioTechnology>) {
  if (!data.name || !data.slug) {
    throw new Error('Name and slug are required.');
  }

  const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

  const existing = await prisma.portfolioTechnology.findUnique({ where: { slug: normalizedSlug } });
  if (existing) {
    throw new Error(`Technology with slug '${normalizedSlug}' already exists.`);
  }

  return await prisma.portfolioTechnology.create({
    data: {
      name: data.name.trim(),
      slug: normalizedSlug,
      icon: data.icon || 'Code',
      url: data.url || null,
      active: data.active ?? true,
    },
  });
}

/**
 * Updates an existing technology record
 */
export async function updateTechnology(id: string, data: Partial<DbPortfolioTechnology>) {
  const existing = await prisma.portfolioTechnology.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Technology not found.');
  }

  if (data.slug && data.slug !== existing.slug) {
    const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const slugCheck = await prisma.portfolioTechnology.findUnique({ where: { slug: normalizedSlug } });
    if (slugCheck) {
      throw new Error(`Technology with slug '${normalizedSlug}' already exists.`);
    }
    data.slug = normalizedSlug;
  }

  return await prisma.portfolioTechnology.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.slug && { slug: data.slug }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.active !== undefined && { active: data.active }),
    },
  });
}

/**
 * Deletes a technology safely
 */
export async function deleteTechnology(id: string) {
  return await prisma.portfolioTechnology.delete({ where: { id } });
}

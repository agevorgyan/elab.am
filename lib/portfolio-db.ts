import prisma from '@/lib/prisma';

export interface DbPortfolioProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  categoryLabel?: string | null;
  summary: string;
  overview?: string | null;
  challenge: string;
  solution: string;
  services: string[];
  results: string[];
  year: string;
  liveUrl?: string | null;
  heroImage?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  gallery: { id?: string; url: string; alt?: string | null }[];
  categories?: { id: string; slug: string; name: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Deterministically normalizes a URL slug for English, Armenian, Russian text
 */
export function normalizeSlug(input?: string | null): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/['"’`]/g, '')
    .replace(/[^a-z0-9\u0531-\u058f\u0400-\u04ff-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetches published portfolio projects ordered by sortOrder for public website
 */
export async function getPublishedPortfolioProjects(): Promise<DbPortfolioProject[]> {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        categories: true,
      },
    });

    return projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.client,
      category: p.category,
      categoryLabel: p.categoryLabel || p.category,
      summary: p.summary,
      overview: p.overview,
      challenge: p.challenge,
      solution: p.solution,
      services: p.services,
      results: p.results,
      year: p.year,
      liveUrl: p.liveUrl,
      heroImage: p.heroImage,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
      gallery: p.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
      categories: p.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches all portfolio projects (published & drafts) for Admin
 */
export async function getAllPortfolioProjectsAdmin(): Promise<DbPortfolioProject[]> {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        categories: true,
      },
    });

    return projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.client,
      category: p.category,
      categoryLabel: p.categoryLabel || p.category,
      summary: p.summary,
      overview: p.overview,
      challenge: p.challenge,
      solution: p.solution,
      services: p.services,
      results: p.results,
      year: p.year,
      liveUrl: p.liveUrl,
      heroImage: p.heroImage,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
      gallery: p.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
      categories: p.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches a single portfolio project by slug
 */
export async function getPortfolioProjectBySlug(slug: string): Promise<DbPortfolioProject | null> {
  try {
    const p = await prisma.portfolioProject.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        categories: true,
      },
    });

    if (!p) return null;

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      client: p.client,
      category: p.category,
      categoryLabel: p.categoryLabel || p.category,
      summary: p.summary,
      overview: p.overview,
      challenge: p.challenge,
      solution: p.solution,
      services: p.services,
      results: p.results,
      year: p.year,
      liveUrl: p.liveUrl,
      heroImage: p.heroImage,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      featured: p.featured,
      published: p.published,
      sortOrder: p.sortOrder,
      gallery: p.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
      categories: p.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Creates a new portfolio project in PostgreSQL with unique slug validation
 */
export async function createPortfolioProject(data: Partial<DbPortfolioProject>) {
  if (!data.title || !data.title.trim()) {
    throw new Error('Project title is required.');
  }
  if (!data.client || !data.client.trim()) {
    throw new Error('Client name is required.');
  }
  if (!data.summary || !data.summary.trim()) {
    throw new Error('Project summary is required.');
  }

  const rawSlug = data.slug || data.title;
  const normalizedSlug = normalizeSlug(rawSlug);

  if (!normalizedSlug) {
    throw new Error('A valid title or URL slug is required.');
  }

  const existing = await prisma.portfolioProject.findFirst({
    where: {
      OR: [
        { slug: normalizedSlug },
        { slug: rawSlug.toLowerCase().trim() },
      ],
    },
  });

  if (existing) {
    const err = new Error(`Another project already uses the URL slug '${normalizedSlug}'.`);
    (err as Error & { statusCode?: number }).statusCode = 409;
    throw err;
  }

  const categoryStr = typeof data.category === 'string' ? data.category.trim() : 'corporate';
  const categoryRecord = await prisma.portfolioCategory.findFirst({
    where: {
      OR: [
        { slug: categoryStr },
        { id: categoryStr },
        { name: categoryStr },
      ],
    },
  });

  const categoryVal = categoryStr || 'corporate';
  const categoryLabelVal = data.categoryLabel || categoryRecord?.name || categoryVal;
  const galleryList = data.gallery || [];

  return await prisma.portfolioProject.create({
    data: {
      title: data.title.trim(),
      slug: normalizedSlug,
      client: data.client.trim(),
      category: categoryVal,
      categoryLabel: categoryLabelVal,
      summary: data.summary.trim(),
      overview: data.overview || data.summary.trim(),
      challenge: data.challenge || data.summary.trim(),
      solution: data.solution || data.summary.trim(),
      services: data.services || [],
      results: data.results || [],
      year: String(data.year || new Date().getFullYear()),
      liveUrl: data.liveUrl || null,
      heroImage: data.heroImage || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      featured: data.featured ?? false,
      published: data.published ?? true,
      sortOrder: data.sortOrder ?? 0,
      ...(categoryRecord && {
        categories: {
          connect: [{ id: categoryRecord.id }],
        },
      }),
      images: {
        create: galleryList.map((g, idx) => ({
          url: typeof g === 'string' ? g : g.url,
          alt: typeof g === 'string' ? data.title : g.alt || data.title,
          sortOrder: idx + 1,
        })),
      },
    },
    include: { images: true, categories: true },
  });
}

/**
 * Updates an existing portfolio project
 */
export async function updatePortfolioProject(id: string, data: Partial<DbPortfolioProject>) {
  const existing = await prisma.portfolioProject.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Portfolio project not found.');
  }

  if (data.slug) {
    const normalizedSlug = normalizeSlug(data.slug);
    if (!normalizedSlug) {
      throw new Error('A valid URL slug is required.');
    }

    const slugCheck = await prisma.portfolioProject.findFirst({
      where: {
        slug: normalizedSlug,
        NOT: { id },
      },
    });

    if (slugCheck) {
      const err = new Error(`Another project already uses the URL slug '${normalizedSlug}'.`);
      (err as Error & { statusCode?: number }).statusCode = 409;
      throw err;
    }
    data.slug = normalizedSlug;
  }

  let categoryRecord = null;
  if (typeof data.category === 'string' && data.category.trim()) {
    categoryRecord = await prisma.portfolioCategory.findFirst({
      where: {
        OR: [
          { slug: data.category.trim() },
          { id: data.category.trim() },
          { name: data.category.trim() },
        ],
      },
    });
  }

  if (data.gallery) {
    await prisma.portfolioImage.deleteMany({ where: { projectId: id } });
  }

  return await prisma.portfolioProject.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.slug && { slug: data.slug }),
      ...(data.client && { client: data.client.trim() }),
      ...(typeof data.category === 'string' && { category: data.category.trim() }),
      ...(data.categoryLabel && { categoryLabel: data.categoryLabel.trim() }),
      ...(data.summary && { summary: data.summary.trim() }),
      ...(data.overview !== undefined && { overview: data.overview }),
      ...(data.challenge !== undefined && { challenge: data.challenge }),
      ...(data.solution !== undefined && { solution: data.solution }),
      ...(data.services && { services: data.services }),
      ...(data.results && { results: data.results }),
      ...(data.year && { year: String(data.year) }),
      ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl }),
      ...(data.heroImage !== undefined && { heroImage: data.heroImage }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.published !== undefined && { published: data.published }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(categoryRecord && {
        categories: {
          set: [{ id: categoryRecord.id }],
        },
      }),
      ...(data.gallery && {
        images: {
          create: data.gallery.map((g, idx) => ({
            url: typeof g === 'string' ? g : g.url,
            alt: typeof g === 'string' ? (data.title || existing.title) : g.alt || existing.title,
            sortOrder: idx + 1,
          })),
        },
      }),
    },
    include: { images: true, categories: true },
  });
}

/**
 * Duplicates a portfolio project with a new unique slug
 */
export async function duplicatePortfolioProject(id: string) {
  const source = await prisma.portfolioProject.findUnique({
    where: { id },
    include: { images: true, categories: true },
  });

  if (!source) throw new Error('Source project not found.');

  const newSlug = `${source.slug}-copy-${Date.now()}`;
  const newTitle = `${source.title} (Copy)`;

  return await prisma.portfolioProject.create({
    data: {
      slug: newSlug,
      title: newTitle,
      client: source.client,
      category: source.category,
      categoryLabel: source.categoryLabel,
      summary: source.summary,
      overview: source.overview,
      challenge: source.challenge,
      solution: source.solution,
      services: source.services,
      results: source.results,
      year: source.year,
      liveUrl: source.liveUrl,
      heroImage: source.heroImage,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      featured: false,
      published: false,
      sortOrder: source.sortOrder + 1,
      categories: {
        connect: source.categories.map((c) => ({ id: c.id })),
      },
      images: {
        create: source.images.map((img, idx) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: idx + 1,
        })),
      },
    },
    include: { images: true, categories: true },
  });
}

/**
 * Deletes a portfolio project safely from PostgreSQL
 */
export async function deletePortfolioProject(id: string) {
  return await prisma.portfolioProject.delete({ where: { id } });
}

/**
 * Reorders portfolio projects sequence
 */
export async function reorderPortfolioProjects(orderedIds: string[]) {
  for (let idx = 0; idx < orderedIds.length; idx++) {
    await prisma.portfolioProject.update({
      where: { id: orderedIds[idx] },
      data: { sortOrder: idx + 1 },
    });
  }
}

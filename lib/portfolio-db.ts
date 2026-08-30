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
  createdAt?: Date;
  updatedAt?: Date;
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
  if (!data.title || !data.slug || !data.client || !data.summary) {
    throw new Error('Title, slug, client, and summary are required.');
  }

  const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

  const existing = await prisma.portfolioProject.findUnique({ where: { slug: normalizedSlug } });
  if (existing) {
    throw new Error(`Portfolio project with slug '${normalizedSlug}' already exists.`);
  }

  const galleryList = data.gallery || [];

  return await prisma.portfolioProject.create({
    data: {
      title: data.title.trim(),
      slug: normalizedSlug,
      client: data.client.trim(),
      category: data.category || 'corporate',
      categoryLabel: data.categoryLabel || data.category || 'Corporate',
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
      images: {
        create: galleryList.map((g, idx) => ({
          url: typeof g === 'string' ? g : g.url,
          alt: typeof g === 'string' ? data.title : g.alt || data.title,
          sortOrder: idx + 1,
        })),
      },
    },
    include: { images: true },
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

  if (data.slug && data.slug !== existing.slug) {
    const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const slugCheck = await prisma.portfolioProject.findUnique({ where: { slug: normalizedSlug } });
    if (slugCheck) {
      throw new Error(`Portfolio project with slug '${normalizedSlug}' already exists.`);
    }
    data.slug = normalizedSlug;
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
      ...(data.category && { category: data.category }),
      ...(data.categoryLabel && { categoryLabel: data.categoryLabel }),
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
    include: { images: true },
  });
}

/**
 * Duplicates a portfolio project with a new unique slug
 */
export async function duplicatePortfolioProject(id: string) {
  const source = await prisma.portfolioProject.findUnique({
    where: { id },
    include: { images: true },
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
      images: {
        create: source.images.map((img, idx) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: idx + 1,
        })),
      },
    },
    include: { images: true },
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

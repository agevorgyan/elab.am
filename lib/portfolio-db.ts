import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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
  technologies?: { id: string; slug: string; name: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Normalizes an image URL to a clean relative path (/uploads/...) or stable remote URL,
 * stripping any environment-specific hardcoded origin like http://localhost:3000.
 */
export function normalizeMediaUrl(url?: string | null): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const parsed = new URL(trimmed);
      if (parsed.pathname.startsWith('/uploads/')) {
        return parsed.pathname;
      }
    }
  } catch {
    // Ignore invalid URL parse errors
  }

  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }

  return trimmed;
}

/**
 * Resolves a stored relative media path (/uploads/...) into a full public URL
 */
export function getPublicMediaUrl(pathOrUrl?: string | null): string {
  const normalized = normalizeMediaUrl(pathOrUrl);
  if (!normalized) return '';

  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  if (siteUrl && siteUrl.startsWith('http')) {
    const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    return `${baseUrl}${normalized}`;
  }

  return normalized;
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

type ProjectRecordWithRelations = Prisma.PortfolioProjectGetPayload<{
  include: { images: true; categories: true; technologies: true };
}>;

/**
 * Helper to map Prisma PortfolioProject database record to DbPortfolioProject interface
 */
function mapProjectRecord(p: ProjectRecordWithRelations): DbPortfolioProject {
  const primaryCat = p.categories && p.categories.length > 0 ? p.categories[0] : null;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    client: p.client,
    category: primaryCat ? primaryCat.slug : 'corporate',
    categoryLabel: primaryCat ? primaryCat.name : 'Corporate Website',
    summary: p.summary,
    overview: p.overview || p.summary,
    challenge: p.challenge || p.summary,
    solution: p.solution || p.summary,
    services: p.services || [],
    results: p.results || [],
    year: p.year,
    liveUrl: p.liveUrl || null,
    heroImage: normalizeMediaUrl(p.heroImage),
    seoTitle: p.seoTitle || null,
    seoDescription: p.seoDescription || null,
    featured: p.featured ?? false,
    published: p.published ?? true,
    sortOrder: p.sortOrder ?? 0,
    gallery: p.images
      ? p.images.map((img) => ({
          id: img.id,
          url: normalizeMediaUrl(img.url) || img.url,
          alt: img.alt,
        }))
      : [],
    categories: p.categories
      ? p.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))
      : [],
    technologies: p.technologies
      ? p.technologies.map((t) => ({ id: t.id, slug: t.slug, name: t.name }))
      : [],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

const defaultIncludes = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  categories: true,
  technologies: true,
};

/**
 * Fetches published portfolio projects ordered by sortOrder for public website
 */
export async function getPublishedPortfolioProjects(): Promise<DbPortfolioProject[]> {
  try {
    const projects = await prisma.portfolioProject.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: defaultIncludes,
    });

    return projects.map(mapProjectRecord);
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
      include: defaultIncludes,
    });

    return projects.map(mapProjectRecord);
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
      include: defaultIncludes,
    });

    if (!p) return null;
    return mapProjectRecord(p);
  } catch {
    return null;
  }
}

/**
 * Creates a new portfolio project in PostgreSQL connecting to PortfolioCategory and PortfolioTechnology relations
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

  // Resolve category relation
  const categoryInput = typeof data.category === 'string' ? data.category.trim() : 'corporate';
  const categoryRecord = await prisma.portfolioCategory.findFirst({
    where: {
      OR: [
        { id: categoryInput },
        { slug: categoryInput },
        { name: categoryInput },
      ],
    },
  });

  if (!categoryRecord) {
    throw new Error(`Invalid category: The selected category '${categoryInput}' does not exist.`);
  }

  // Resolve technologies relation if provided in services or technologies list
  const techInputs = data.services || [];
  const matchingTechs = await prisma.portfolioTechnology.findMany({
    where: {
      OR: techInputs.map((t) => ({
        OR: [{ slug: normalizeSlug(t) }, { name: { equals: t, mode: 'insensitive' as const } }],
      })),
    },
  });

  const titleVal = data.title.trim();
  const clientVal = data.client.trim();
  const summaryVal = data.summary.trim();

  const galleryList = data.gallery || [];
  const heroImageNormalized = normalizeMediaUrl(data.heroImage);

  return await prisma.$transaction(async (tx) => {
    const created = await tx.portfolioProject.create({
      data: {
        title: titleVal,
        slug: normalizedSlug,
        client: clientVal,
        summary: summaryVal,
        overview: data.overview || summaryVal,
        challenge: data.challenge || summaryVal,
        solution: data.solution || summaryVal,
        services: data.services || [],
        results: data.results || [],
        year: String(data.year || new Date().getFullYear()),
        liveUrl: data.liveUrl || null,
        heroImage: heroImageNormalized,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        featured: data.featured ?? false,
        published: data.published ?? true,
        sortOrder: data.sortOrder ?? 0,
        categories: {
          connect: [{ id: categoryRecord.id }],
        },
        ...(matchingTechs.length > 0 && {
          technologies: {
            connect: matchingTechs.map((t) => ({ id: t.id })),
          },
        }),
        images: {
          create: galleryList.map((g, idx) => {
            const rawUrl = typeof g === 'string' ? g : g.url;
            return {
              url: normalizeMediaUrl(rawUrl) || rawUrl,
              alt: typeof g === 'string' ? data.title : g.alt || data.title,
              sortOrder: idx + 1,
            };
          }),
        },
      },
      include: defaultIncludes,
    });

    return mapProjectRecord(created);
  });
}

/**
 * Updates an existing portfolio project
 */
export async function updatePortfolioProject(id: string, data: Partial<DbPortfolioProject>) {
  const existing = await prisma.portfolioProject.findUnique({
    where: { id },
    include: defaultIncludes,
  });
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
    const catInput = data.category.trim();
    categoryRecord = await prisma.portfolioCategory.findFirst({
      where: {
        OR: [
          { id: catInput },
          { slug: catInput },
          { name: catInput },
        ],
      },
    });

    if (!categoryRecord) {
      throw new Error(`Invalid category: The selected category '${catInput}' does not exist.`);
    }
  }

  let matchingTechs: { id: string }[] | null = null;
  if (data.services) {
    matchingTechs = await prisma.portfolioTechnology.findMany({
      where: {
        OR: data.services.map((t) => ({
          OR: [{ slug: normalizeSlug(t) }, { name: { equals: t, mode: 'insensitive' as const } }],
        })),
      },
      select: { id: true },
    });
  }

  return await prisma.$transaction(async (tx) => {
    if (data.gallery) {
      await tx.portfolioImage.deleteMany({ where: { projectId: id } });
    }

    const heroImageVal = data.heroImage !== undefined ? normalizeMediaUrl(data.heroImage) : undefined;

    const updated = await tx.portfolioProject.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.slug && { slug: data.slug }),
        ...(data.client && { client: data.client.trim() }),
        ...(data.summary && { summary: data.summary.trim() }),
        ...(data.overview !== undefined && { overview: data.overview }),
        ...(data.challenge !== undefined && { challenge: data.challenge }),
        ...(data.solution !== undefined && { solution: data.solution }),
        ...(data.services && { services: data.services }),
        ...(data.results && { results: data.results }),
        ...(data.year && { year: String(data.year) }),
        ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl }),
        ...(heroImageVal !== undefined && { heroImage: heroImageVal }),
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
        ...(matchingTechs && {
          technologies: {
            set: matchingTechs.map((t) => ({ id: t.id })),
          },
        }),
        ...(data.gallery && {
          images: {
            create: data.gallery.map((g, idx) => {
              const rawUrl = typeof g === 'string' ? g : g.url;
              return {
                url: normalizeMediaUrl(rawUrl) || rawUrl,
                alt: typeof g === 'string' ? (data.title || existing.title) : g.alt || existing.title,
                sortOrder: idx + 1,
              };
            }),
          },
        }),
      },
      include: defaultIncludes,
    });

    return mapProjectRecord(updated);
  });
}

/**
 * Duplicates a portfolio project with a new unique slug inside a transaction
 */
export async function duplicatePortfolioProject(id: string) {
  const source = await prisma.portfolioProject.findUnique({
    where: { id },
    include: defaultIncludes,
  });

  if (!source) throw new Error('Source project not found.');

  const newSlug = `${source.slug}-copy-${Date.now()}`;
  const newTitle = `${source.title} (Copy)`;

  return await prisma.$transaction(async (tx) => {
    const created = await tx.portfolioProject.create({
      data: {
        slug: newSlug,
        title: newTitle,
        client: source.client,
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
        technologies: {
          connect: source.technologies.map((t) => ({ id: t.id })),
        },
        images: {
          create: source.images.map((img, idx) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: idx + 1,
          })),
        },
      },
      include: defaultIncludes,
    });

    return mapProjectRecord(created);
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

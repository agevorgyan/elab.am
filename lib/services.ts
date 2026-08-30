import prisma from '@/lib/prisma';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  priceAmd: string;
  priceCurrency: string;
  showPrice: boolean;
  priceLabel?: string | null;
  popular?: boolean;
  tagline?: string | null;
  description: string;
  icon?: string | null;
  ctaText?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sortOrder: number;
  published: boolean;
  features: { id?: string; text: string; sortOrder?: number }[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Fetches published services ordered by sortOrder for public website rendering
 */
export async function getPublishedServices(): Promise<ServiceItem[]> {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return services.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      priceAmd: s.priceAmd,
      priceCurrency: s.priceCurrency || 'AMD',
      showPrice: s.showPrice ?? true,
      priceLabel: s.priceLabel || 'Starting from',
      popular: s.popular ?? false,
      tagline: s.tagline || s.description,
      description: s.description,
      icon: s.icon,
      ctaText: s.ctaText,
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      sortOrder: s.sortOrder,
      published: s.published,
      features: s.features.map((f) => ({ id: f.id, text: f.text, sortOrder: f.sortOrder })),
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches all services (including drafts) for Admin CMS management
 */
export async function getAllServicesAdmin(): Promise<ServiceItem[]> {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        features: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return services.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      priceAmd: s.priceAmd,
      priceCurrency: s.priceCurrency || 'AMD',
      showPrice: s.showPrice ?? true,
      priceLabel: s.priceLabel || 'Starting from',
      popular: s.popular ?? false,
      tagline: s.tagline || s.description,
      description: s.description,
      icon: s.icon,
      ctaText: s.ctaText,
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      sortOrder: s.sortOrder,
      published: s.published,
      features: s.features.map((f) => ({ id: f.id, text: f.text, sortOrder: f.sortOrder })),
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches paginated services with server-side database search for Admin CMS
 */
export async function getPaginatedServicesAdmin(
  page = 1,
  limit = 10,
  search = ''
): Promise<{ services: ServiceItem[]; total: number; totalPages: number; page: number }> {
  try {
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const safePage = Math.max(1, page);

    const where: { title?: { contains: string; mode: 'insensitive' } } = {};
    if (search.trim()) {
      where.title = { contains: search.trim(), mode: 'insensitive' };
    }

    const skip = (safePage - 1) * safeLimit;

    const [total, rawServices] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip,
        take: safeLimit,
        include: {
          features: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / safeLimit) || 1;

    return {
      services: rawServices.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        priceAmd: s.priceAmd,
        priceCurrency: s.priceCurrency || 'AMD',
        showPrice: s.showPrice ?? true,
        priceLabel: s.priceLabel || 'Starting from',
        popular: s.popular ?? false,
        tagline: s.tagline || s.description,
        description: s.description,
        icon: s.icon,
        ctaText: s.ctaText,
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        sortOrder: s.sortOrder,
        published: s.published,
        features: s.features.map((f) => ({ id: f.id, text: f.text, sortOrder: f.sortOrder })),
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      total,
      totalPages,
      page: safePage,
    };
  } catch {
    return { services: [], total: 0, totalPages: 1, page: 1 };
  }
}

/**
 * Creates a new service in PostgreSQL with slug uniqueness validation
 */
export async function createService(data: Partial<ServiceItem>) {
  if (!data.title || !data.slug || !data.priceAmd || !data.description) {
    throw new Error('Title, slug, price, and description are required.');
  }

  const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

  const existing = await prisma.service.findUnique({ where: { slug: normalizedSlug } });
  if (existing) {
    throw new Error(`Service with slug '${normalizedSlug}' already exists.`);
  }

  const featuresList = data.features || [];

  return await prisma.service.create({
    data: {
      title: data.title.trim(),
      slug: normalizedSlug,
      priceAmd: data.priceAmd.trim(),
      priceCurrency: data.priceCurrency || 'AMD',
      showPrice: data.showPrice ?? true,
      priceLabel: data.priceLabel || 'Starting from',
      popular: data.popular ?? false,
      tagline: data.tagline || data.description.trim(),
      description: data.description.trim(),
      icon: data.icon || 'Zap',
      ctaText: data.ctaText || 'Order Service →',
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      sortOrder: data.sortOrder ?? 0,
      published: data.published ?? true,
      features: {
        create: featuresList.map((f, idx) => ({
          text: typeof f === 'string' ? f : f.text,
          sortOrder: idx + 1,
        })),
      },
    },
    include: { features: true },
  });
}

/**
 * Updates an existing service in PostgreSQL
 */
export async function updateService(id: string, data: Partial<ServiceItem>) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Service not found.');
  }

  if (data.slug && data.slug !== existing.slug) {
    const normalizedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const slugCheck = await prisma.service.findUnique({ where: { slug: normalizedSlug } });
    if (slugCheck) {
      throw new Error(`Service with slug '${normalizedSlug}' already exists.`);
    }
    data.slug = normalizedSlug;
  }

  if (data.features) {
    await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
  }

  return await prisma.service.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title.trim() }),
      ...(data.slug && { slug: data.slug }),
      ...(data.priceAmd && { priceAmd: data.priceAmd.trim() }),
      ...(data.priceCurrency !== undefined && { priceCurrency: data.priceCurrency }),
      ...(data.showPrice !== undefined && { showPrice: data.showPrice }),
      ...(data.priceLabel !== undefined && { priceLabel: data.priceLabel }),
      ...(data.popular !== undefined && { popular: data.popular }),
      ...(data.tagline !== undefined && { tagline: data.tagline }),
      ...(data.description && { description: data.description.trim() }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.ctaText !== undefined && { ctaText: data.ctaText }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      ...(data.published !== undefined && { published: data.published }),
      ...(data.features && {
        features: {
          create: data.features.map((f, idx) => ({
            text: typeof f === 'string' ? f : f.text,
            sortOrder: idx + 1,
          })),
        },
      }),
    },
    include: { features: true },
  });
}

/**
 * Deletes a service safely from PostgreSQL
 */
export async function deleteService(id: string) {
  return await prisma.service.delete({ where: { id } });
}

/**
 * Updates sortOrder for an ordered list of service IDs
 */
export async function reorderServices(orderedIds: string[]) {
  for (let idx = 0; idx < orderedIds.length; idx++) {
    await prisma.service.update({
      where: { id: orderedIds[idx] },
      data: { sortOrder: idx + 1 },
    });
  }
}

export const createServiceAdmin = createService;
export const updateServiceAdmin = updateService;
export const deleteServiceAdmin = deleteService;
export const reorderServicesAdmin = reorderServices;

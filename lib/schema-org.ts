import { ServiceItem } from '@/lib/services';
import { DbPortfolioProject } from '@/lib/portfolio-db';

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://elab.am';
}

/**
 * Schema.org Organization for eLab Digital Studio
 */
export function buildOrganizationSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'eLab Digital Studio',
    alternateName: 'eLab.am',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/icon.svg`,
      width: 512,
      height: 512,
    },
    email: 'hello@elab.am',
    telephone: '+37455776066',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yerevan',
      addressCountry: 'AM',
    },
    sameAs: [
      'https://www.facebook.com/elab.am',
      'https://www.instagram.com/elab.armenia/',
      'https://www.linkedin.com/company/elab-armenia/',
      'https://www.youtube.com/@eLab-armenia',
    ],
  };
}

/**
 * Schema.org WebSite for eLab.am
 */
export function buildWebSiteSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'eLab — Web Development & Digital Studio Armenia',
    description:
      'eLab builds modern, fast, high-converting websites, landing pages, e-commerce stores, and custom software for Armenian and international businesses.',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: ['hy', 'en', 'ru'],
  };
}

/**
 * Schema.org WebPage for specific pages
 */
export function buildWebPageSchema(url: string, name: string, description: string) {
  const baseUrl = getBaseUrl();
  return {
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url,
    name,
    description,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
  };
}

/**
 * Schema.org Service catalog built from database service items
 */
export function buildServicesSchema(services: ServiceItem[]) {
  const baseUrl = getBaseUrl();

  const itemList = services.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: s.title,
      description: s.description || s.tagline,
    },
    price: s.priceAmd ? s.priceAmd.replace(/,/g, '') : undefined,
    priceCurrency: s.priceCurrency || 'AMD',
  }));

  return {
    '@type': 'Service',
    '@id': `${baseUrl}/#services`,
    name: 'Web Development & Digital Services',
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Armenia',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'eLab Digital Services Catalog',
      itemListElement: itemList,
    },
  };
}

/**
 * Schema.org BreadcrumbList for page navigation
 */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Schema.org CreativeWork for published portfolio case studies
 */
export function buildCreativeWorkSchema(project: DbPortfolioProject) {
  const baseUrl = getBaseUrl();
  const projectUrl = `${baseUrl}/work/${project.slug}`;

  return {
    '@type': 'CreativeWork',
    '@id': `${projectUrl}/#creativework`,
    url: projectUrl,
    name: project.title,
    headline: project.seoTitle || project.title,
    description: project.seoDescription || project.summary || project.overview,
    image: project.heroImage ? (project.heroImage.startsWith('http') ? project.heroImage : `${baseUrl}${project.heroImage}`) : undefined,
    creator: {
      '@id': `${baseUrl}/#organization`,
    },
    datePublished: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
    dateModified: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
    keywords: (project.categories || []).map((c) => c.name).join(', '),
  };
}

/**
 * Combines graph nodes into valid JSON-LD structure
 */
export function buildGraphJsonLd(nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  };
}

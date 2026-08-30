import prisma from '@/lib/prisma';
import { SeoMetadata } from '@prisma/client';
import type { Metadata } from 'next';

export type DbSeoMetadata = SeoMetadata;

export interface UpsertSeoInput {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  robots?: string;
}

export const DEFAULT_SEO = {
  title: 'eLab — Web Development & Digital Solutions in Armenia | elab.am',
  description:
    'eLab is a premier digital agency in Yerevan, Armenia specializing in custom web development, e-commerce platforms, corporate websites, and digital transformation.',
  keywords: ['web development Armenia', 'website creation Yerevan', 'eLab digital agency', 'e-commerce Armenia', 'custom software Yerevan'],
  baseUrl: 'https://elab.am',
  ogImage: 'https://elab.am/og-image.png',
  robots: 'index, follow',
};

/**
 * Normalizes a URL path string (e.g. "work" -> "/work", "/" -> "/", "/work/" -> "/work")
 */
export function normalizePath(path: string): string {
  if (!path) return '/';
  let cleaned = path.trim();
  if (!cleaned.startsWith('/')) cleaned = '/' + cleaned;
  if (cleaned.length > 1 && cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  return cleaned;
}

/**
 * Returns all SEO metadata records for Admin CMS management
 */
export async function getAllSeoMetadataAdmin(): Promise<DbSeoMetadata[]> {
  return await prisma.seoMetadata.findMany({
    orderBy: { path: 'asc' },
  });
}

/**
 * Returns SEO metadata for a specific route path from PostgreSQL
 */
export async function getSeoMetadataByPath(path: string): Promise<DbSeoMetadata | null> {
  const normalized = normalizePath(path);
  return await prisma.seoMetadata.findUnique({
    where: { path: normalized },
  });
}

/**
 * Upserts (creates or updates) SEO metadata in PostgreSQL
 */
export async function upsertSeoMetadataAdmin(input: UpsertSeoInput): Promise<DbSeoMetadata> {
  const normalized = normalizePath(input.path);
  const keywordsList = Array.isArray(input.keywords)
    ? input.keywords.map((k) => k.trim()).filter(Boolean)
    : typeof input.keywords === 'string'
    ? (input.keywords as string).split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const data = {
    path: normalized,
    title: input.title.trim(),
    description: input.description.trim(),
    keywords: keywordsList,
    canonical: input.canonical ? input.canonical.trim() : null,
    ogTitle: input.ogTitle ? input.ogTitle.trim() : null,
    ogDescription: input.ogDescription ? input.ogDescription.trim() : null,
    ogImage: input.ogImage ? input.ogImage.trim() : null,
    robots: (input.robots || 'index, follow').trim(),
  };

  return await prisma.seoMetadata.upsert({
    where: { path: normalized },
    update: data,
    create: data,
  });
}

/**
 * Deletes an SEO metadata record from PostgreSQL
 */
export async function deleteSeoMetadataAdmin(id: string): Promise<DbSeoMetadata> {
  return await prisma.seoMetadata.delete({
    where: { id },
  });
}

/**
 * Generates dynamic Next.js Metadata object with fallback defaults and PostgreSQL overrides
 */
export async function buildDynamicMetadata(
  path: string,
  fallback?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  }
): Promise<Metadata> {
  const dbMeta = await getSeoMetadataByPath(path);

  const title = dbMeta?.title || fallback?.title || DEFAULT_SEO.title;
  const description = dbMeta?.description || fallback?.description || DEFAULT_SEO.description;
  const keywords = dbMeta?.keywords.length ? dbMeta.keywords : fallback?.keywords || DEFAULT_SEO.keywords;
  const canonical = dbMeta?.canonical || `${DEFAULT_SEO.baseUrl}${normalizePath(path)}`;
  const ogTitle = dbMeta?.ogTitle || title;
  const ogDescription = dbMeta?.ogDescription || description;
  const ogImage = dbMeta?.ogImage || fallback?.ogImage || DEFAULT_SEO.ogImage;
  const robotsSetting = dbMeta?.robots || DEFAULT_SEO.robots;

  const isNoIndex = robotsSetting.includes('noindex');
  const isNoFollow = robotsSetting.includes('nofollow');

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: 'eLab.am',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

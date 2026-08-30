import { MetadataRoute } from 'next';
import { getPublishedPortfolioProjects } from '@/lib/portfolio-db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elab.am';

  // 1. Fetch only published portfolio projects from PostgreSQL database
  let publishedProjects: Awaited<ReturnType<typeof getPublishedPortfolioProjects>> = [];
  try {
    publishedProjects = await getPublishedPortfolioProjects();
  } catch {
    publishedProjects = [];
  }

  const projectRoutes: MetadataRoute.Sitemap = (publishedProjects || []).map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 2. Public Legal & Static Pages
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 3. Main Public Web Pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  return [...coreRoutes, ...legalRoutes, ...projectRoutes];
}

import React from 'react';
import { DbPortfolioProject } from '@/lib/portfolio-db';
import {
  buildCreativeWorkSchema,
  buildBreadcrumbSchema,
  buildGraphJsonLd,
  getBaseUrl,
} from '@/lib/schema-org';

interface PortfolioJsonLdProps {
  project: DbPortfolioProject;
}

export const PortfolioJsonLd: React.FC<PortfolioJsonLdProps> = ({ project }) => {
  const baseUrl = getBaseUrl();
  const projectUrl = `${baseUrl}/work/${project.slug}`;

  const creativeWorkNode = buildCreativeWorkSchema(project);
  const breadcrumbNode = buildBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Portfolio', url: `${baseUrl}/work` },
    { name: project.title, url: projectUrl },
  ]);

  const graphData = buildGraphJsonLd([creativeWorkNode, breadcrumbNode]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphData) }}
    />
  );
};

import React from 'react';
import { buildBreadcrumbSchema, buildGraphJsonLd } from '@/lib/schema-org';

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({ items }) => {
  const breadcrumbNode = buildBreadcrumbSchema(items);
  const graphData = buildGraphJsonLd([breadcrumbNode]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphData) }}
    />
  );
};

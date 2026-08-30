import { getPublishedServices, ServiceItem } from '@/lib/services';
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildServicesSchema,
  buildGraphJsonLd,
} from '@/lib/schema-org';

export const JsonLd: React.FC = async () => {
  let services: ServiceItem[] = [];
  try {
    services = await getPublishedServices();
  } catch {
    services = [];
  }

  const orgNode = buildOrganizationSchema();
  const siteNode = buildWebSiteSchema();
  const serviceNode = buildServicesSchema(services);

  const graphData = buildGraphJsonLd([orgNode, siteNode, serviceNode]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphData) }}
    />
  );
};

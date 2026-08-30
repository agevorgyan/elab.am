import { revalidatePath, revalidateTag } from 'next/cache';
import { logger } from '@/lib/logger';

export type CmsContentType =
  | 'portfolio'
  | 'services'
  | 'settings'
  | 'seo'
  | 'legal'
  | 'faq'
  | 'testimonials';

/**
 * Revalidates Next.js ISR page paths and cache tags when Admin CMS content changes
 */
export function revalidatePublicCmsContent(type: CmsContentType, extraPath?: string) {
  try {
    switch (type) {
      case 'portfolio':
        revalidatePath('/', 'page');
        revalidatePath('/work', 'page');
        revalidatePath('/sitemap.xml', 'page');
        if (extraPath) {
          revalidatePath(`/work/${extraPath}`, 'page');
        }
        try { revalidateTag('portfolio', 'default'); } catch {}
        break;

      case 'services':
        revalidatePath('/', 'page');
        revalidatePath('/services', 'page');
        revalidatePath('/sitemap.xml', 'page');
        try { revalidateTag('services', 'default'); } catch {}
        break;

      case 'settings':
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml', 'page');
        try { revalidateTag('settings', 'default'); } catch {}
        break;

      case 'seo':
        revalidatePath('/', 'layout');
        revalidatePath('/sitemap.xml', 'page');
        try { revalidateTag('seo', 'default'); } catch {}
        break;

      case 'legal':
        revalidatePath('/terms', 'page');
        revalidatePath('/privacy', 'page');
        revalidatePath('/cookies', 'page');
        revalidatePath('/sitemap.xml', 'page');
        if (extraPath) {
          revalidatePath(`/${extraPath}`, 'page');
        }
        try { revalidateTag('legal', 'default'); } catch {}
        break;

      case 'faq':
        revalidatePath('/', 'page');
        try { revalidateTag('faq', 'default'); } catch {}
        break;

      case 'testimonials':
        revalidatePath('/', 'page');
        try { revalidateTag('testimonials', 'default'); } catch {}
        break;
    }

    logger.info(`Revalidated public cache for CMS content type: ${type}`, { extraPath });
  } catch (err) {
    logger.warn(`Failed to revalidate public cache for CMS content type: ${type}`, { error: String(err) });
  }
}

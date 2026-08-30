import prisma from '@/lib/prisma';
import { SiteSettings } from '@/lib/admin-store';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'eLab Digital Studio',
  siteDescription: 'Modern websites, landing pages, and e-commerce solutions in Armenia.',
  logoUrl: 'https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg',
  phone: '+374 55 77 60 66',
  email: 'hello@elab.am',
  whatsapp: '+37455776066',
  telegram: '@elab_armenia',
  address: 'Yerevan, Armenia',
  facebook: 'https://www.facebook.com/elab.am',
  instagram: 'https://www.instagram.com/elab.armenia/',
  linkedin: 'https://www.linkedin.com/company/elab-armenia/',
  youtube: 'https://www.youtube.com/@eLab-armenia',
};

/**
 * Fetches all site settings dynamically from PostgreSQL via Prisma with fallback to defaults
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSettings.findMany();
    if (!rows || rows.length === 0) {
      return DEFAULT_SITE_SETTINGS;
    }

    const settingsMap: Record<string, string> = {};
    for (const r of rows) {
      settingsMap[r.key] = r.value;
    }

    return {
      siteName: settingsMap['siteName'] || DEFAULT_SITE_SETTINGS.siteName,
      siteDescription: settingsMap['siteDescription'] || DEFAULT_SITE_SETTINGS.siteDescription,
      logoUrl: settingsMap['logoUrl'] || DEFAULT_SITE_SETTINGS.logoUrl,
      phone: settingsMap['phone'] || DEFAULT_SITE_SETTINGS.phone,
      email: settingsMap['email'] || DEFAULT_SITE_SETTINGS.email,
      whatsapp: settingsMap['whatsapp'] || DEFAULT_SITE_SETTINGS.whatsapp,
      telegram: settingsMap['telegram'] || DEFAULT_SITE_SETTINGS.telegram,
      address: settingsMap['address'] || DEFAULT_SITE_SETTINGS.address,
      facebook: settingsMap['facebook'] || DEFAULT_SITE_SETTINGS.facebook,
      instagram: settingsMap['instagram'] || DEFAULT_SITE_SETTINGS.instagram,
      linkedin: settingsMap['linkedin'] || DEFAULT_SITE_SETTINGS.linkedin,
      youtube: settingsMap['youtube'] || DEFAULT_SITE_SETTINGS.youtube,
    };
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Upserts a key-value setting pair in PostgreSQL
 */
export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const keys = Object.keys(settings) as (keyof SiteSettings)[];

  for (const k of keys) {
    const val = settings[k];
    if (val !== undefined) {
      await prisma.siteSettings.upsert({
        where: { key: k },
        update: { value: String(val) },
        create: {
          key: k,
          value: String(val),
          category: k.includes('phone') || k.includes('email') ? 'contact' : 'branding',
        },
      });
    }
  }

  return await getSiteSettings();
}

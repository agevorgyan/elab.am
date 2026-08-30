import prisma from '@/lib/prisma';
import { LegalPage } from '@prisma/client';

export type DbLegalPage = LegalPage;

export interface UpsertLegalInput {
  slug: string;
  title: string;
  content: string;
  lastUpdated?: string;
  published?: boolean;
}

/**
 * Sanitizes rich text / HTML content to prevent XSS attacks while retaining legal document markup
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return html
    // Strip script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip iframe and object tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Strip inline event handlers (onclick, onerror, onload, etc.)
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
    .replace(/ on\w+=\w+/gi, '')
    // Strip javascript: URLs
    .replace(/href=["']\s*javascript:[^"']*["']/gi, 'href="#"');
}

export const INITIAL_LEGAL_PAGES = {
  terms: {
    slug: 'terms',
    title: 'Terms of Use',
    lastUpdated: 'August 28, 2026',
    published: true,
    version: 1,
    content: `<div class="space-y-6">
  <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
    <strong>Legal Notice:</strong> This document governs your usage of the eLab website (elab.am). Legal documents should be reviewed by qualified legal counsel prior to formal execution.
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">1. General Information</h2>
    <p>
      Welcome to eLab.am ("eLab", "we", "us", or "our"). By accessing or using our website located at <code class="text-[#00dc93]">https://elab.am</code>, you agree to comply with and be bound by these Terms of Use.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">2. Website Usage</h2>
    <p>
      You agree to use this website solely for lawful purposes and in a manner that does not infringe upon the rights of, or restrict the use of this site by, any third party.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">3. Services & Information</h2>
    <p>
      eLab provides web development, UX/UI design, e-commerce engineering, and digital solution services. The starting prices listed in AMD (Armenian Dram) on this website represent preliminary estimate baselines.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">4. Intellectual Property</h2>
    <p>
      All content, trademarks, logos, graphics, case studies, and source code displayed on this website are the intellectual property of eLab or its respective client brand partners and are protected by applicable intellectual property laws in Armenia and internationally.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">5. Contact Forms and Requests</h2>
    <p>
      Submitting an inquiry through our project form does not constitute a binding contract. A formal service agreement is executed prior to the commencement of any custom development work.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">6. Contact Information</h2>
    <p>
      For questions regarding these Terms of Use, please contact eLab at <a href="mailto:info@elab.am" class="text-[#00dc93] hover:underline">info@elab.am</a> or by phone at <a href="tel:+37455776066" className="text-[#00dc93] hover:underline">+374 55 77 60 66</a>.
    </p>
  </div>
</div>`,
  },
  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: 'August 28, 2026',
    published: true,
    version: 1,
    content: `<div class="space-y-6">
  <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
    <strong>Privacy Commitment:</strong> eLab is committed to handling project inquiry details transparently, securely, and in accordance with applicable Armenian privacy laws.
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">1. Information We Collect</h2>
    <p>
      We collect information that you voluntarily provide when submitting a project inquiry on our website. This includes:
    </p>
    <ul class="list-disc pl-5 space-y-1 text-slate-400">
      <li>Full Name</li>
      <li>Company Name</li>
      <li>Phone Number</li>
      <li>Email Address</li>
      <li>Selected Project Type and Budget Range</li>
      <li>Project Description & Message Details</li>
    </ul>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">2. How We Use Information</h2>
    <p>
      We use collected information solely to respond to your project inquiry, provide preliminary price estimations, schedule project consultations, and deliver custom development services.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">3. Data Security & Confidentiality</h2>
    <p>
      Your contact details are private. We store inquiry details securely and strictly enforce role-based access control (RBAC). We do not sell, rent, or trade your personal information to third parties.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">4. Cookies & Analytics</h2>
    <p>
      We use essential cookies for site functionality and optional analytics cookies to measure load speed. You can manage or revoke your consent anytime using our Cookie Policy or Cookie Settings.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">5. Contact Data Rights</h2>
    <p>
      You have the right to request access to, correction of, or deletion of your submitted project inquiry details. Contact eLab at <a href="mailto:info@elab.am" class="text-[#00dc93] hover:underline">info@elab.am</a>.
    </p>
  </div>
</div>`,
  },
  cookies: {
    slug: 'cookies',
    title: 'Cookie Policy',
    lastUpdated: 'August 28, 2026',
    published: true,
    version: 1,
    content: `<div class="space-y-6">
  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">1. What Are Cookies?</h2>
    <p>
      Cookies are small text files stored on your computer or mobile device when you visit websites. They help remember user choices and measure site performance.
    </p>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">2. Essential vs Optional Cookies</h2>
    <div class="space-y-3">
      <div class="p-4 rounded-xl bg-[#141722] border border-white/10 space-y-1">
        <h3 class="font-bold text-white">Strictly Necessary Cookies (Always Active)</h3>
        <p class="text-[#00dc93]">Required for basic navigation, security, and contact form submission.</p>
      </div>

      <div class="p-4 rounded-xl bg-[#141722] border border-white/10 space-y-1">
        <h3 class="font-bold text-white">Analytics Cookies (Optional)</h3>
        <p class="text-slate-400">Google Analytics used to measure traffic and performance. Activated only with explicit user consent.</p>
      </div>
    </div>
  </div>

  <div class="space-y-3">
    <h2 class="text-lg font-extrabold text-white">3. Managing Your Preferences</h2>
    <p>
      You can reopen and update your Cookie Preferences at any time using the <strong>Cookie Settings</strong> link in our website footer.
    </p>
  </div>
</div>`,
  },
};

/**
 * Returns all legal pages for Admin CMS management
 */
export async function getAllLegalPagesAdmin(): Promise<DbLegalPage[]> {
  await seedDefaultLegalPages();
  return await prisma.legalPage.findMany({
    orderBy: { slug: 'asc' },
  });
}

/**
 * Returns legal page by slug for Admin
 */
export async function getLegalPageBySlug(slug: string): Promise<DbLegalPage | null> {
  const page = await prisma.legalPage.findUnique({
    where: { slug: slug.trim().toLowerCase() },
  });

  if (!page && INITIAL_LEGAL_PAGES[slug as keyof typeof INITIAL_LEGAL_PAGES]) {
    await seedDefaultLegalPages();
    return await prisma.legalPage.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });
  }

  return page;
}

/**
 * Returns published legal page by slug for public website rendering
 */
export async function getPublishedLegalPageBySlug(slug: string): Promise<DbLegalPage | null> {
  const page = await prisma.legalPage.findFirst({
    where: {
      slug: slug.trim().toLowerCase(),
      published: true,
    },
  });

  if (!page && INITIAL_LEGAL_PAGES[slug as keyof typeof INITIAL_LEGAL_PAGES]) {
    await seedDefaultLegalPages();
    return await prisma.legalPage.findFirst({
      where: {
        slug: slug.trim().toLowerCase(),
        published: true,
      },
    });
  }

  return page;
}

/**
 * Creates or updates legal page in PostgreSQL with HTML sanitization and version tracking
 */
export async function upsertLegalPageAdmin(input: UpsertLegalInput): Promise<DbLegalPage> {
  const slugClean = input.slug.trim().toLowerCase();
  const cleanTitle = input.title.trim();
  const cleanContent = sanitizeHtml(input.content.trim());
  const formattedLastUpdated =
    input.lastUpdated && input.lastUpdated.trim()
      ? input.lastUpdated.trim()
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

  const existing = await prisma.legalPage.findUnique({
    where: { slug: slugClean },
  });

  let nextVersion = existing ? existing.version : 1;

  // Increment version if title or content changed meaningfully
  if (existing && (existing.title !== cleanTitle || existing.content !== cleanContent)) {
    nextVersion = existing.version + 1;
  }

  return await prisma.legalPage.upsert({
    where: { slug: slugClean },
    update: {
      title: cleanTitle,
      content: cleanContent,
      lastUpdated: formattedLastUpdated,
      published: input.published ?? true,
      version: nextVersion,
    },
    create: {
      slug: slugClean,
      title: cleanTitle,
      content: cleanContent,
      lastUpdated: formattedLastUpdated,
      published: input.published ?? true,
      version: 1,
    },
  });
}

/**
 * Deletes a custom legal page record
 */
export async function deleteLegalPageAdmin(id: string): Promise<DbLegalPage> {
  return await prisma.legalPage.delete({
    where: { id },
  });
}

/**
 * Seeds default legal pages if missing from PostgreSQL
 */
export async function seedDefaultLegalPages(): Promise<void> {
  const count = await prisma.legalPage.count();
  if (count >= 3) return;

  for (const item of Object.values(INITIAL_LEGAL_PAGES)) {
    const existing = await prisma.legalPage.findUnique({
      where: { slug: item.slug },
    });

    if (!existing) {
      await prisma.legalPage.create({
        data: item,
      });
    }
  }
}

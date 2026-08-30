import { PrismaClient, Role, LeadStatus } from '@prisma/client';
import argon2 from 'argon2';
import { PORTFOLIO_PROJECTS } from '../lib/portfolio-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding eLab.am production database, portfolio projects & Argon2id SUPER_ADMIN...');

  const adminEmail = process.env.ADMIN_EMAIL || process.env.INITIAL_ADMIN_EMAIL || 'admin@elab.am';
  const rawPassword = process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD || 'SuperAdmin2026!';

  if (!adminEmail || !adminEmail.includes('@')) {
    throw new Error('Invalid ADMIN_EMAIL provided for database seeding.');
  }

  const passwordHash = await argon2.hash(rawPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // 1. Seed Initial Idempotent SUPER_ADMIN User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
    create: {
      name: 'Super Administrator',
      email: adminEmail,
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('✅ SUPER_ADMIN account seeded idempotently with Argon2id hash:', admin.email);

  if (adminEmail !== 'hello@elab.am') {
    await prisma.user.upsert({
      where: { email: 'hello@elab.am' },
      update: {
        passwordHash,
        role: Role.SUPER_ADMIN,
      },
      create: {
        name: 'Avetis (Super Admin)',
        email: 'hello@elab.am',
        passwordHash,
        role: Role.SUPER_ADMIN,
      },
    });
  }

  // 2. Seed Cookie Settings
  await prisma.cookieSettings.upsert({
    where: { id: 'default-cookie-settings' },
    update: {},
    create: {
      id: 'default-cookie-settings',
      version: 1,
      bannerEnabled: true,
      analyticsEnabled: true,
      marketingEnabled: false,
    },
  });

  // 3. Seed Site Settings
  const settings = [
    { key: 'siteName', value: 'eLab Digital Studio', category: 'branding' },
    { key: 'siteDescription', value: 'Modern websites, landing pages, and e-commerce solutions in Armenia.', category: 'branding' },
    { key: 'logoUrl', value: '/logo.svg', category: 'branding' },
    { key: 'phone', value: '+374 55 77 60 66', category: 'contact' },
    { key: 'email', value: 'hello@elab.am', category: 'contact' },
    { key: 'address', value: 'Yerevan, Armenia', category: 'contact' },
    { key: 'facebook', value: 'https://www.facebook.com/elab.am', category: 'social' },
    { key: 'instagram', value: 'https://www.instagram.com/elab.armenia/', category: 'social' },
    { key: 'linkedin', value: 'https://www.linkedin.com/company/elab-armenia/', category: 'social' },
    { key: 'youtube', value: 'https://www.youtube.com/@eLab-armenia', category: 'social' },
    { key: 'websiteUrl', value: 'https://elab.am', category: 'branding' },
  ];

  for (const item of settings) {
    await prisma.siteSettings.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log('✅ Site settings seeded.');

  // 4. Seed Services CMS Content
  const servicesData = [
    {
      slug: 'landing-page',
      title: 'Landing Pages (Լենդինգ Էջ)',
      priceAmd: '150,000',
      priceCurrency: 'AMD',
      showPrice: true,
      priceLabel: 'Starting from',
      description: 'High-conversion single-page site designed specifically for advertising campaigns, lead generation, and product launches.',
      icon: 'Zap',
      ctaText: 'Order Landing Page →',
      sortOrder: 1,
      published: true,
      features: [
        'High-conversion sales structure',
        'Responsive mobile optimization',
        'Sub-second page loading speed',
        'CRM & Webhook form integration',
      ],
    },
    {
      slug: 'corporate-website',
      title: 'Corporate Websites (Կորպորատիվ Կայք)',
      priceAmd: '250,000',
      priceCurrency: 'AMD',
      showPrice: true,
      priceLabel: 'Starting from',
      description: 'Multi-page professional website for business reputation, brand trust, and organic search engine growth.',
      icon: 'Building',
      ctaText: 'Order Corporate Site →',
      sortOrder: 2,
      published: true,
      features: [
        'Multi-language support (HY / EN / RU)',
        'Full CMS Admin Panel',
        'SEO-optimized architecture',
        'Security layer & automated backups',
      ],
    },
    {
      slug: 'online-store',
      title: 'Online Stores (Օնլայն Խանութ)',
      priceAmd: '400,000',
      priceCurrency: 'AMD',
      showPrice: true,
      priceLabel: 'Starting from',
      description: 'Full-featured e-commerce platform with payment gateway integration and order management.',
      icon: 'ShoppingBag',
      ctaText: 'Order Online Store →',
      sortOrder: 3,
      published: true,
      features: [
        'ArCa / Idram / Telcell payment integration',
        'Product catalog & inventory tracking',
        'Real-time order notifications',
        'Analytics & customer insights',
      ],
    },
    {
      slug: 'restaurant-qr-menu',
      title: 'Restaurant QR Menus (Ռեստորանային QR)',
      priceAmd: '120,000',
      priceCurrency: 'AMD',
      showPrice: true,
      priceLabel: 'Starting from',
      description: 'Digital interactive QR code menu for restaurants, cafes, and hospitality venues.',
      icon: 'QrCode',
      ctaText: 'Order QR Menu →',
      sortOrder: 4,
      published: true,
      features: [
        'Instant QR code camera scan',
        'Multi-category menu management',
        'Instant price & dish updates',
        'Multi-language menu support',
      ],
    },
    {
      slug: 'business-card-website',
      title: 'Business Card Websites (Այցեքարտ Կայք)',
      priceAmd: '80,000',
      priceCurrency: 'AMD',
      showPrice: true,
      priceLabel: 'Starting from',
      description: 'Compact digital business card presenting essential services, credentials, and contact details.',
      icon: 'UserCheck',
      ctaText: 'Order Business Card →',
      sortOrder: 5,
      published: true,
      features: [
        'Ultra-fast load time',
        'Direct contact form',
        'Social media integration',
        'Clean mobile interface',
      ],
    },
  ];

  for (const s of servicesData) {
    const { features, ...serviceFields } = s;
    const existing = await prisma.service.findUnique({ where: { slug: s.slug } });

    if (!existing) {
      await prisma.service.create({
        data: {
          ...serviceFields,
          features: {
            create: features.map((fText, idx) => ({ text: fText, sortOrder: idx + 1 })),
          },
        },
      });
    } else {
      await prisma.service.update({
        where: { slug: s.slug },
        data: serviceFields,
      });
    }
  }
  console.log('✅ Services CMS content seeded.');

  // 5. Seed Existing Portfolio Projects into PostgreSQL
  for (const p of PORTFOLIO_PROJECTS) {
    const existingProject = await prisma.portfolioProject.findUnique({ where: { slug: p.slug } });

    const resultsList = p.results ? p.results.map((r) => `${r.value} ${r.label}`) : [];
    const galleryList = p.gallery || [];

    if (!existingProject) {
      await prisma.portfolioProject.create({
        data: {
          slug: p.slug,
          title: p.title,
          client: p.client,
          category: p.category,
          categoryLabel: p.categoryLabel.en,
          summary: p.description.en,
          overview: p.overview.en,
          challenge: p.challenge.en,
          solution: p.solution.en,
          services: p.services,
          results: resultsList,
          year: String(p.year),
          liveUrl: p.websiteUrl || null,
          heroImage: p.coverImage,
          featured: p.featured,
          published: true,
          sortOrder: p.order,
          images: {
            create: galleryList.map((url, idx) => ({ url, sortOrder: idx + 1 })),
          },
        },
      });
    } else {
      await prisma.portfolioProject.update({
        where: { slug: p.slug },
        data: {
          title: p.title,
          client: p.client,
          category: p.category,
          categoryLabel: p.categoryLabel.en,
          summary: p.description.en,
          overview: p.overview.en,
          challenge: p.challenge.en,
          solution: p.solution.en,
          services: p.services,
          results: resultsList,
          year: String(p.year),
          liveUrl: p.websiteUrl || null,
          heroImage: p.coverImage,
          featured: p.featured,
          sortOrder: p.order,
        },
      });
    }
  }
  console.log('✅ 6 Portfolio projects seeded into PostgreSQL.');

  // 6. Seed Sample Lead & Note
  await prisma.lead.upsert({
    where: { id: 'lead-101' },
    update: {},
    create: {
      id: 'lead-101',
      name: 'Arman Petrosyan',
      company: 'Ararat Beverages LLC',
      phone: '+374 91 12 34 56',
      email: 'arman@araratbeverages.am',
      projectType: 'online-store',
      budget: '350,000–500,000 AMD',
      message: 'We want to launch an online e-commerce store with ArCa payment gateway integration.',
      status: LeadStatus.NEW,
      assignedTo: admin.name,
      notes: {
        create: [
          { text: 'Initial lead submitted via website contact form.', authorId: admin.id },
        ],
      },
    },
  });
  console.log('✅ Sample lead seeded.');

  console.log('🎉 Full Argon2id database seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

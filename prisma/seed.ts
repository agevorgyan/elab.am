import { PrismaClient, Role, LeadStatus } from '@prisma/client';
import argon2 from 'argon2';
import { PORTFOLIO_PROJECTS } from '../lib/portfolio-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding eLab.am production database, CRM leads, technologies, portfolio categories, projects & Argon2id SUPER_ADMIN...');

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

  // 4. Seed Reusable Technologies
  const techStack = [
    { slug: 'nextjs', name: 'Next.js', icon: 'Code', url: 'https://nextjs.org' },
    { slug: 'react', name: 'React', icon: 'Code', url: 'https://react.dev' },
    { slug: 'typescript', name: 'TypeScript', icon: 'Code', url: 'https://www.typescriptlang.org' },
    { slug: 'tailwind-css', name: 'Tailwind CSS', icon: 'Layers', url: 'https://tailwindcss.com' },
    { slug: 'wordpress', name: 'WordPress', icon: 'Globe', url: 'https://wordpress.org' },
    { slug: 'woocommerce', name: 'WooCommerce', icon: 'ShoppingBag', url: 'https://woocommerce.com' },
    { slug: 'php', name: 'PHP', icon: 'Code', url: 'https://www.php.net' },
    { slug: 'javascript', name: 'JavaScript', icon: 'Code', url: 'https://developer.mozilla.org' },
    { slug: 'nodejs', name: 'Node.js', icon: 'Cpu', url: 'https://nodejs.org' },
    { slug: 'postgresql', name: 'PostgreSQL', icon: 'Database', url: 'https://www.postgresql.org' },
    { slug: '1c-erp', name: '1C ERP Integration', icon: 'Cpu', url: 'https://1c.ru' },
    { slug: 'arca-gateway', name: 'ArCa Gateway', icon: 'CreditCard', url: 'https://arca.am' },
    { slug: 'idram-payment', name: 'Idram Payment', icon: 'CreditCard', url: 'https://idram.am' },
    { slug: 'redis', name: 'Redis', icon: 'Zap', url: 'https://redis.io' },
    { slug: 'framer-motion', name: 'Framer Motion', icon: 'Sparkles', url: 'https://framer.com/motion' },
  ];

  for (const t of techStack) {
    await prisma.portfolioTechnology.upsert({
      where: { slug: t.slug },
      update: { name: t.name, icon: t.icon, url: t.url, active: true },
      create: { slug: t.slug, name: t.name, icon: t.icon, url: t.url, active: true },
    });
  }
  console.log('✅ Reusable technologies seeded into PostgreSQL.');

  // 5. Seed Portfolio Categories
  const defaultCategories = [
    { slug: 'all', name: 'All Projects', description: 'Complete collection of eLab digital case studies', sortOrder: 1, active: true },
    { slug: 'corporate', name: 'Corporate Websites', description: 'Enterprise corporate portals and brand identity showcases', sortOrder: 2, active: true },
    { slug: 'ecommerce', name: 'E-Commerce & Retail', description: 'Online stores with local ArCa / Idram payment gateways', sortOrder: 3, active: true },
    { slug: 'landing-page', name: 'Landing Pages', description: 'High-conversion single page sites engineered for campaigns', sortOrder: 4, active: true },
    { slug: 'business-card', name: 'Business Card Websites', description: 'Compact digital presence for independent professionals', sortOrder: 5, active: true },
    { slug: 'custom', name: 'Custom Web Applications', description: 'Bespoke web applications, APIs, and complex web tools', sortOrder: 6, active: true },
  ];

  for (const cat of defaultCategories) {
    await prisma.portfolioCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Portfolio categories seeded into PostgreSQL.');

  // 6. Seed Services CMS Content
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

  // 7. Seed Existing Portfolio Projects into PostgreSQL
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

  // 8. Seed Real CRM Leads into PostgreSQL
  const sampleLeads = [
    {
      id: 'lead-101',
      name: 'Arman Petrosyan',
      company: 'Ararat Beverages LLC',
      phone: '+374 91 12 34 56',
      email: 'arman@araratbeverages.am',
      projectType: 'online-store',
      budget: '350,000–500,000 AMD',
      message: 'We want to launch an online e-commerce store with ArCa payment gateway integration.',
      source: 'Website Contact Form',
      status: LeadStatus.NEW,
      assignedTo: admin.name,
      notes: ['Initial lead submitted via website contact form.'],
    },
    {
      id: 'lead-102',
      name: 'Gagik Harutyunyan',
      company: 'Yerevan Logistics CJSC',
      phone: '+374 93 44 55 66',
      email: 'gagik@yerevanlogistics.am',
      projectType: 'corporate-website',
      budget: '500,000–800,000 AMD',
      message: 'Corporate web portal required for international freight forwarding services.',
      source: 'Direct Phone Inquiry',
      status: LeadStatus.CONTACTED,
      assignedTo: admin.name,
      notes: ['Contacted client via phone call on Aug 28. Requested technical requirements.'],
    },
    {
      id: 'lead-103',
      name: 'Marine Sargsyan',
      company: 'Silk Road Gems',
      phone: '+374 98 77 88 99',
      email: 'marine@silkroadgems.com',
      projectType: 'online-store',
      budget: '600,000+ AMD',
      message: 'Luxury jewelry e-commerce store targeting European and US customers with multi-currency checkout.',
      source: 'WhatsApp Referral',
      status: LeadStatus.QUALIFIED,
      assignedTo: admin.name,
      notes: ['Qualified lead. High budget, clear scope and timelines.'],
    },
    {
      id: 'lead-104',
      name: 'David Hovhannisyan',
      company: 'Ani Hotel Yerevan',
      phone: '+374 10 58 12 34',
      email: 'd.hovhannisyan@anihotel.am',
      projectType: 'corporate-website',
      budget: '1,000,000+ AMD',
      message: 'Complete website redesign with online room booking engine & virtual tour integration.',
      source: 'LinkedIn Direct',
      status: LeadStatus.PROPOSAL_SENT,
      assignedTo: admin.name,
      notes: ['Commercial proposal sent on Aug 29. Awaiting executive board review.'],
    },
    {
      id: 'lead-105',
      name: 'Lilit Grigoryan',
      company: 'Armenia Tech Hub',
      phone: '+374 77 11 22 33',
      email: 'lilit@armeniatech.am',
      projectType: 'landing-page',
      budget: '200,000 AMD',
      message: 'High-conversion landing page for upcoming Tech Summit 2026 in Yerevan.',
      source: 'Website Contact Form',
      status: LeadStatus.WON,
      assignedTo: admin.name,
      notes: ['Contract signed and deposit received. Project kick-off scheduled.'],
    },
  ];

  for (const l of sampleLeads) {
    const { notes, ...leadFields } = l;
    await prisma.lead.upsert({
      where: { id: l.id },
      update: leadFields,
      create: {
        ...leadFields,
        notes: {
          create: notes.map((text) => ({ text, authorId: admin.id })),
        },
      },
    });
  }
  console.log('✅ 5 Real CRM sample leads seeded.');

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

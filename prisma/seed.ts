import { PrismaClient, Role, LeadStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding eLab.am production database schema...');

  // 1. Seed Initial Super Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'hello@elab.am' },
    update: {},
    create: {
      name: 'Avetis (Super Admin)',
      email: 'hello@elab.am',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$simulated_hash_key',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('✅ Admin user seeded:', admin.email);

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
  console.log('✅ Cookie settings seeded.');

  // 3. Seed Site Settings
  const settings = [
    { key: 'siteName', value: 'eLab Digital Studio', category: 'branding' },
    { key: 'siteDescription', value: 'Modern websites, landing pages, and e-commerce solutions in Armenia.', category: 'branding' },
    { key: 'logoUrl', value: 'https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg', category: 'branding' },
    { key: 'phone', value: '+374 55 77 60 66', category: 'contact' },
    { key: 'email', value: 'hello@elab.am', category: 'contact' },
    { key: 'address', value: 'Yerevan, Armenia', category: 'contact' },
    { key: 'facebook', value: 'https://www.facebook.com/elab.am', category: 'social' },
    { key: 'instagram', value: 'https://www.instagram.com/elab.armenia/', category: 'social' },
    { key: 'linkedin', value: 'https://www.linkedin.com/company/elab-armenia/', category: 'social' },
    { key: 'youtube', value: 'https://www.youtube.com/@eLab-armenia', category: 'social' },
  ];

  for (const item of settings) {
    await prisma.siteSettings.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log('✅ Site settings seeded.');

  // 4. Seed Categories
  const categories = [
    { slug: 'corporate', name: 'Corporate Websites', sortOrder: 1 },
    { slug: 'ecommerce', name: 'Online Stores', sortOrder: 2 },
    { slug: 'landing-page', name: 'Landing Pages', sortOrder: 3 },
  ];

  for (const cat of categories) {
    await prisma.portfolioCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  console.log('✅ Portfolio categories seeded.');

  // 5. Seed Portfolio Project
  const project = await prisma.portfolioProject.upsert({
    where: { slug: 'gayanes-kitchen' },
    update: {},
    create: {
      slug: 'gayanes-kitchen',
      title: "Gayane's Kitchen — Authentic Armenian Restaurant",
      client: "Gayane's Hospitality LLC",
      summary: 'High-converting online menu, reservation portal, and branding.',
      challenge: 'Low online table booking conversion and slow mobile page load.',
      solution: 'Custom Next.js restaurant site with sub-second page rendering.',
      results: ['+140% Online Table Bookings', '0.4s Mobile Page Load', '99/100 Lighthouse Performance'],
      year: '2025',
      liveUrl: 'https://gayaneskitchen.com',
      heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      published: true,
    },
  });
  console.log('✅ Portfolio project seeded:', project.title);

  // 6. Seed Lead & Note
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

  console.log('🎉 Full schema database seeding complete!');
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

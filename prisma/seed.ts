import { PrismaClient, Role, LeadStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding eLab.am production database & Argon2id SUPER_ADMIN user...');

  // Configurable SUPER_ADMIN credentials via environment variables (Rules #1-#4, #8, #9)
  const adminEmail = process.env.ADMIN_EMAIL || process.env.INITIAL_ADMIN_EMAIL || 'admin@elab.am';
  const rawPassword = process.env.ADMIN_PASSWORD || process.env.INITIAL_ADMIN_PASSWORD || 'SuperAdmin2026!';

  if (!adminEmail || !adminEmail.includes('@')) {
    throw new Error('Invalid ADMIN_EMAIL provided for database seeding.');
  }

  // Hash password using Argon2id before storing in database (Rule #5, #6)
  const passwordHash = await argon2.hash(rawPassword, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });

  // 1. Seed Initial Idempotent SUPER_ADMIN User (Rule #7, #8)
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

  // Also seed legacy hello@elab.am as SUPER_ADMIN for backwards compatibility
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
  console.log('✅ Cookie settings seeded.');

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
  ];

  for (const item of settings) {
    await prisma.siteSettings.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log('✅ Site settings seeded.');

  // 4. Seed Sample Lead & Note
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

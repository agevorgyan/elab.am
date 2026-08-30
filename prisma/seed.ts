import { PrismaClient, Role, LeadStatus } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding eLab.am production database & Argon2id super admin...');

  // Generate real Argon2id hash for initial admin password
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || 'hello_elab_2026!';
  const passwordHash = await argon2.hash(initialPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  // 1. Seed Initial Super Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'hello@elab.am' },
    update: {
      passwordHash,
    },
    create: {
      name: 'Avetis (Super Admin)',
      email: 'hello@elab.am',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('✅ Admin user seeded with Argon2id hash:', admin.email);

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

  // 4. Seed Lead & Note
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

import { PrismaClient, Role, LeadStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting eLab.am database seeding...');

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

  // 2. Seed Initial Site Settings
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
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log('✅ Site settings seeded.');

  // 3. Seed Initial Seed Lead
  const lead = await prisma.lead.upsert({
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
  console.log('✅ Lead seeded:', lead.name);

  console.log('🎉 Database seeding complete!');
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

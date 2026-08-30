export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';
  createdAt: string;
  assignedTo?: string;
  notes?: { id: string; text: string; date: string; author: string }[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  phone: string;
  email: string;
  whatsapp: string;
  telegram: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  websiteUrl: string;
}

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Arman Petrosyan',
    company: 'Ararat Beverages LLC',
    phone: '+374 91 12 34 56',
    email: 'arman@araratbeverages.am',
    projectType: 'online-store',
    budget: '350,000–500,000 AMD',
    message: 'We want to launch an online e-commerce store with ArCa payment gateway integration.',
    status: 'New',
    createdAt: '2026-08-30T10:15:00Z',
    assignedTo: 'Avetis (Super Admin)',
    notes: [
      { id: 'note-1', text: 'Initial lead submitted via website contact form.', date: '2026-08-30 10:15', author: 'System' },
    ],
  },
  {
    id: 'lead-102',
    name: 'Siranush Mkrtchyan',
    company: 'Yerevan Beauty Clinic',
    phone: '+374 94 98 76 54',
    email: 'info@yerevanbeauty.am',
    projectType: 'corporate-website',
    budget: '200,000–350,000 AMD',
    message: 'Looking for a corporate bilingual website with online booking features.',
    status: 'Contacted',
    createdAt: '2026-08-29T14:30:00Z',
    assignedTo: 'Garegin (Admin)',
    notes: [
      { id: 'note-2', text: 'Called client on phone. Scheduled online demo for Tuesday.', date: '2026-08-29 16:00', author: 'Garegin' },
    ],
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'eLab Digital Studio',
  siteDescription: 'Modern websites, landing pages, and e-commerce solutions in Armenia.',
  logoUrl: '/logo.svg',
  phone: '+374 55 77 60 66',
  email: 'hello@elab.am',
  whatsapp: '+37455776066',
  telegram: '@elab_armenia',
  address: 'Yerevan, Armenia',
  facebook: 'https://www.facebook.com/elab.am',
  instagram: 'https://www.instagram.com/elab.armenia/',
  linkedin: 'https://www.linkedin.com/company/elab-armenia/',
  youtube: 'https://www.youtube.com/@eLab-armenia',
  websiteUrl: 'https://elab.am',
};

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: 'corporate' | 'ecommerce' | 'landing-page' | 'business-card' | 'restaurant' | 'custom';
  categoryLabel: {
    hy: string;
    en: string;
    ru: string;
  };
  client: string;
  year: number;
  description: {
    hy: string;
    en: string;
    ru: string;
  };
  overview: {
    hy: string;
    en: string;
    ru: string;
  };
  challenge: {
    hy: string;
    en: string;
    ru: string;
  };
  solution: {
    hy: string;
    en: string;
    ru: string;
  };
  services: string[];
  technologies: string[];
  coverImage: string;
  gallery?: string[];
  integrations?: string[];
  results?: {
    value: string;
    label: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    title: string;
  };
  websiteUrl?: string;
  featured: boolean;
  order: number;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'gayanes-kitchen',
    slug: 'gayanes-kitchen',
    title: "Gayane's Kitchen",
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ / Ռեստորան',
      en: 'E-Commerce & Restaurant',
      ru: 'Интернет-магазин / Ресторан',
    },
    client: "Gayane's Kitchen LLC",
    year: 2024,
    description: {
      hy: 'Ռեստորանային և խոհարարական ապրանքների օնլայն պատվերների ժամանակակից պորտալ:',
      en: 'Modern online ordering portal and e-commerce showcase for artisan culinary products.',
      ru: 'Современный онлайн-портал для заказа кулинарной продукции.',
    },
    overview: {
      hy: 'Gayane\'s Kitchen-ը Հայաստանում հայտնի խոհարարական ապրանքանիշ է, որին անհրաժեշտ էր թվայնացնել պատվերների ընդունման գործընթացը:',
      en: "Gayane's Kitchen is a renowned Armenian culinary brand that needed a fast, mobile-first e-commerce system for online ordering.",
      ru: 'Gayane\'s Kitchen — известный армянский кулинарный бренд, которому требовалась удобная система онлайн-заказов.',
    },
    challenge: {
      hy: 'Հին կայքը դանդաղ էր աշխատում, չուներ օնլայն վճարման ինտեգրացիա և բջջային սարքերով պատվերներ կատարելն անհարմար էր:',
      en: 'The previous system lacked mobile optimization, failed under high order concurrency, and had no integrated online payment gateways.',
      ru: 'Старая система медленно работала на мобильных устройствах и не поддерживала онлайн-оплату.',
    },
    solution: {
      hy: 'eLab-ը ստեղծեց գերարագ էլեկտրոնային խանութ ArCa/Visa/MasterCard վճարային համակարգերով և ավտոմատ պատվերների ծանուցմամբ:',
      en: 'eLab developed a blazing-fast WooCommerce & Next.js portal integrated with local Armenian payment gateways (ArCa/Visa/Mastercard) and automated instant SMS notifications.',
      ru: 'eLab создал быстрый интернет-магазин с интеграцией местных платежных систем и автоматическими уведомлениями.',
    },
    services: ['E-Commerce Development', 'UX/UI Design', 'Payment Gateway Integration', 'Mobile Optimization'],
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', 'ArCa Gateway', 'Tailwind CSS'],
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    ],
    integrations: ['ArCa Payment Gateway', 'Ameriabank iPos', 'Telegram Order Bot', 'Google Analytics 4'],
    results: [
      { value: '<0.6s', label: 'Mobile Load Time' },
      { value: '+45%', label: 'Online Orders Increase' },
      { value: '99.9%', label: 'Uptime Reliability' },
    ],
    testimonial: {
      quote: 'eLab-ի շնորհիվ մեր օնլայն պատվերների ծավալը կրկնապատկվեց առաջին իսկ ամսում:',
      author: 'Gayane S.',
      title: 'Founder, Gayane\'s Kitchen',
    },
    websiteUrl: 'https://gayaneskitchen.com',
    featured: true,
    order: 1,
  },
  {
    id: 'the-little-prince',
    slug: 'the-little-prince',
    title: 'The Little Prince',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Մանկական Օնլայն Խանութ',
      en: "Children's E-Commerce",
      ru: 'Детский интернет-магазин',
    },
    client: 'The Little Prince Kids Store',
    year: 2024,
    description: {
      hy: 'Մանկական հագուստի և աքսեսուարների գունեղ էլեկտրոնային խանութ:',
      en: "Vibrant and user-friendly e-commerce platform for children's clothing and accessories.",
      ru: 'Яркий интернет-магазин детской одежды и аксессуаров.',
    },
    overview: {
      hy: 'Մանկական ապրանքանիշի համար ստեղծվել է հարմարավետ կատալոգով օնլայն խանութ:',
      en: 'Created an intuitive e-commerce experience for parents searching for premium children products.',
      ru: 'Разработан удобный каталог для родителей с быстрой фильтрацией товаров.',
    },
    challenge: {
      hy: 'Ապրանքների բազմազանությունն ու չափսերի ֆիլտրացիան հին կայքում խճճված էին:',
      en: 'Product category navigation and size variant filters were complex and confusing on mobile screen sizes.',
      ru: 'Навигация и фильтрация товаров по размерам были сложными на мобильных.',
    },
    solution: {
      hy: 'Մշակվեց ինտուիտիվ ֆիլտրացիայի համակարգ և 1-click պատվերի հնարավորություն:',
      en: 'Designed an intuitive mobile filter bar and 1-click checkout funnel reducing user friction.',
      ru: 'Внедрена быстрая мобильная фильтрация и оформление заказа в один клик.',
    },
    services: ['E-Commerce Design', 'Mobile UX', 'Catalog Architecture'],
    technologies: ['WordPress', 'WooCommerce', 'MySQL', 'Tailwind CSS'],
    coverImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
    integrations: ['Idram Payment', 'ArCa', 'Instagram Shopping Feed'],
    results: [
      { value: '3.2x', label: 'Mobile Conversion' },
      { value: '100%', label: 'Responsive UX' },
    ],
    websiteUrl: 'https://littleprince.am',
    featured: true,
    order: 2,
  },
  {
    id: 'tntes-am',
    slug: 'tntes-am',
    title: 'Tntes.am',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Տնտեսական Օնլայն Հիպերմարկետ',
      en: 'Household Hypermarket E-Commerce',
      ru: 'Гипермаркет хозяйственных товаров',
    },
    client: 'Tntes LLC',
    year: 2023,
    description: {
      hy: 'Տնտեսական ապրանքների խոշոր օնլայն հիպերմարկետ՝ 10,000+ ապրանքատեսականիով:',
      en: 'Large-scale household goods e-commerce platform with over 10,000 product SKUs.',
      ru: 'Крупный интернет-гипермаркет хозяйственных товаров с более чем 10 000 наименований.',
    },
    overview: {
      hy: 'Tntes.am-ը Հայաստանում տնտեսական ապրանքների խոշորագույն մատակարարներից է:',
      en: 'Tntes.am needed a robust catalog engine capable of managing tens of thousands of dynamic inventory items.',
      ru: 'Tntes.am требовалась мощная система управления каталогом для десятков тысяч товаров.',
    },
    challenge: {
      hy: '10,000+ ապրանքների արագ որոնումը և 1C պահեստի հետ սինխրոնացումը ճարտարագիտական մարտահրավեր էր:',
      en: 'Syncing 10,000+ inventory items in real-time with local 1C ERP accounting software without slowing down search.',
      ru: 'Синхронизация 10 000+ товаров в реальном времени с системой 1С.',
    },
    solution: {
      hy: 'eLab-ը ստեղծեց 1C ավտոմատացված սինխրոնացում և բարձր արտադրողականությամբ որոնման համակարգ:',
      en: 'eLab engineered an automated 1C ERP sync pipeline and instant search indexing engine.',
      ru: 'eLab создал автоматическую синхронизацию с 1С и сверхбыстрый поиск.',
    },
    services: ['ERP Integration', 'E-Commerce Architecture', 'High-Traffic Caching'],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', '1C ERP Integration', 'Redis'],
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    integrations: ['1C ERP Enterprise', 'ArCa Gateway', 'In客户 CRM'],
    results: [
      { value: '10k+', label: 'Managed Products' },
      { value: '<200ms', label: 'Search Latency' },
    ],
    websiteUrl: 'https://tntes.am',
    featured: true,
    order: 3,
  },
  {
    id: 'mercury-houses',
    slug: 'mercury-houses',
    title: 'Mercury Houses',
    category: 'landing-page',
    categoryLabel: {
      hy: 'Անշարժ Գույքի Լենդինգ Էջ',
      en: 'Real Estate Landing Page',
      ru: 'Лендинг недвижимости',
    },
    client: 'Mercury Construction Group',
    year: 2024,
    description: {
      hy: 'Պրեմիում դասի Թաունհաուսների և առանձնատների վաճառքի բարձր փոխարկման լենդինգ էջ:',
      en: 'High-converting luxury townhouse real estate landing page with interactive 3D floor plan visualizer.',
      ru: 'Высококонверсионный лендинг премиальных таунхаусов с интерактивными планировками.',
    },
    overview: {
      hy: 'Երևանի մերձակայքում կառուցվող luxury թաունհաուսների վաճառքի խթանման նպատակով ստեղծվեց ներկայացուցչական լենդինգ:',
      en: 'Designed to capture high-intent leads for luxury townhouse developments in Yerevan.',
      ru: 'Создан репрезентативный лендинг для привлечения покупателей премиального жилья.',
    },
    challenge: {
      hy: 'Անհրաժեշտ էր ցուցադրել ճարտարապետական նախագիծը և հավաքագրել որակյալ լիդեր:',
      en: 'Present complex architectural renders, location benefits, and floorplans seamlessly on mobile devices.',
      ru: 'Предоставить архитектурные планировки и локацию в удобном виде на мобильных.',
    },
    solution: {
      hy: 'eLab-ը ստեղծեց ինտերակտիվ հատակագծերի դիտման համակարգ և բարձր փոխարկելիությամբ հայտերի ձև:',
      en: 'eLab delivered a sleek dark-mode glassmorphic visual experience with instant WhatsApp and CRM booking funnel.',
      ru: 'eLab разработал современный темный интерфейс с быстрой формой бронирования.',
    },
    services: ['CRO Landing Page', '3D Floorplan Visualizer', 'Lead Funnel Design'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    integrations: ['Bitrix24 CRM', 'WhatsApp API', 'Google Tag Manager'],
    results: [
      { value: '4.8%', label: 'Lead Conversion Rate' },
      { value: '150+', label: 'Qualified Inquiries' },
    ],
    websiteUrl: 'https://mercuryhouses.am',
    featured: true,
    order: 4,
  },
  {
    id: 'deka-development',
    slug: 'deka-development',
    title: 'DEKA Development',
    category: 'corporate',
    categoryLabel: {
      hy: 'Կորպորատիվ Կայք',
      en: 'Corporate Website',
      ru: 'Корпоративный сайт',
    },
    client: 'DEKA Development',
    year: 2024,
    description: {
      hy: 'Կառուցապատող ընկերության պրեմիում կորպորատիվ կայք:',
      en: 'Corporate showcase website for an established real estate developer.',
      ru: 'Премиальный корпоративный сайт девелоперской компании.',
    },
    overview: {
      hy: 'DEKA Development-ը խոշոր կառուցապատող է, որին անհրաժեշտ էր բրենդային նոր կայք:',
      en: 'DEKA needed an authoritative corporate website showcasing active construction projects and corporate legacy.',
      ru: 'DEKA требовался авторитетный сайт для презентации строящихся объектов.',
    },
    challenge: {
      hy: 'Հին կայքը չէր արտացոլում ընկերության մասշտաբն ու վստահությունը:',
      en: 'The previous website failed to convey the premium status of their multimillion-dollar developments.',
      ru: 'Старый сайт не отражал масштаб и надежность компании.',
    },
    solution: {
      hy: 'Ստեղծվեց բարձրաճաշակ դիզայնով եռալեզու կորպորատիվ պորտալ:',
      en: 'eLab crafted a multilingual enterprise platform featuring interactive project galleries and investor documents.',
      ru: 'eLab создал трехязычный корпоративный портал с интерактивными галереями.',
    },
    services: ['Corporate Web Development', 'Multilingual Setup', 'Brand Identity'],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    websiteUrl: 'https://deka.am',
    featured: true,
    order: 5,
  },
  {
    id: 'mijnaberd',
    slug: 'mijnaberd',
    title: 'Mijnaberd',
    category: 'corporate',
    categoryLabel: {
      hy: 'Բրենդային Կայք',
      en: 'Heritage Brand Showcase',
      ru: 'Брендовый сайт',
    },
    client: 'Mijnaberd Brandy & Wine Factory',
    year: 2023,
    description: {
      hy: 'Հայկական ավանդական կոնյակի և գինու բրենդային ներկայացուցչական կայք:',
      en: 'Editorial brand showcase celebrating authentic Armenian brandy and wine craftsmanship.',
      ru: 'Элегантный брендовый сайт армянского коньяка и вина.',
    },
    overview: {
      hy: 'Միջնաբերդ ապրանքանիշի համար պատրաստվել է ազգային ավանդույթներն ընդգծող կայք:',
      en: 'Mijnaberd needed an elegant digital presentation for international distributors and connoisseurs.',
      ru: 'Mijnaberd требовалась элегантная цифровая презентация для международных дистрибьюторов.',
    },
    challenge: {
      hy: 'Փոխանցել ավանդական կոնյակագործության շունչն ու որակը թվային տիրույթում:',
      en: 'Translate rich heritage and artisan bottle aesthetics into an immersive online visual experience.',
      ru: 'Передать историю и премиальное качество продукции в цифровом формате.',
    },
    solution: {
      hy: 'eLab-ը ստեղծեց էլեգանտ դիզայնով, բարձրորակ լուսանկարներով պատմողական կայք:',
      en: 'eLab designed a bespoke visual storytelling interface highlighting aging traditions and product lines.',
      ru: 'eLab разработал визуальный сайт-историю с акцентом на традиции производства.',
    },
    services: ['Brand Experience Design', 'Visual Storytelling', 'International Multilingual'],
    technologies: ['WordPress', 'PHP', 'Custom CSS', 'GSAP Animation'],
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    websiteUrl: 'https://mijnaberd.am',
    featured: true,
    order: 6,
  },
];

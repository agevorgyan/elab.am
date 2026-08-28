export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'websites' | 'ecommerce' | 'landing-page' | 'corporate' | 'business-card';
  categoryLabel: {
    hy: string;
    en: string;
    ru: string;
  };
  client: string;
  description: {
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
  technologies: string[];
  coverImage: string;
  year: string;
  featured: boolean;
  websiteUrl?: string;
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: '1',
    title: "Gayane's Kitchen",
    slug: 'gayanes-kitchen',
    category: 'websites',
    categoryLabel: {
      hy: 'Վեբ Կայքեր',
      en: 'Websites',
      ru: 'Веб-сайты',
    },
    client: "Gayane's Kitchen",
    description: {
      hy: 'Ռեստորանային և խոհարարական բրենդի ժամանակակից վեբ կայք՝ պատվերների ընդունման և մենյուի ինտերակտիվ ցուցադրությամբ։',
      en: 'Modern website for a culinary brand featuring interactive menu display and online order workflows.',
      ru: 'Современный веб-сайт для кулинарного бренда с интерактивным меню и оформлением заказов.',
    },
    challenge: {
      hy: 'Ստեղծել ճաշացանկի հեշտ ընթեռնելի ցուցադրություն, որն ապահովում է արագ բեռնում բջջային սարքերից և բարձրացնում է առցանց պատվերների քանակը։',
      en: 'Create an easy-to-browse menu presentation optimized for ultra-fast mobile loading and direct conversions.',
      ru: 'Создать удобный интерфейс меню с быстрой загрузкой на мобильных устройствах и высоким уровнем конверсии.',
    },
    solution: {
      hy: 'Մշակվել է mobile-first ճարտարապետություն՝ ֆոտոգենիկ visual UI էլեմենտներով և արագ կապի կոճակներով։',
      en: 'Implemented a mobile-first UI with high-resolution visual storytelling and instant order triggers.',
      ru: 'Разработан mobile-first интерфейс с визуальной презентацией блюд и быстрой связью.',
    },
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'WordPress API'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-01.jpg',
    year: '2023',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '2',
    title: 'The Little Prince',
    slug: 'the-little-prince',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ',
      en: 'Online Shop',
      ru: 'Онлайн-магазин',
    },
    client: 'The Little Prince Store',
    description: {
      hy: 'Մանկական ապրանքների և հագուստի էլեկտրոնային խանութ՝ ապրանքների հարմար ֆիլտրացիայով և վճարային համակարգերի ինտեգրմամբ։',
      en: 'E-commerce platform for children products featuring advanced filtering and online payment integrations.',
      ru: 'Интернет-магазин детских товаров с удобной фильтрацией и интеграцией платежных систем.',
    },
    challenge: {
      hy: 'Ապահովել բազմակատեգորիա ապրանքների արագ որոնում և հարմարավետ գնումների զամբյուղ ծնողների համար։',
      en: 'Deliver an intuitive shopping cart experience with smart categorization for catalog products.',
      ru: 'Обеспечить быстрый поиск товаров по категориям и удобную корзину покупок.',
    },
    solution: {
      hy: 'Ինտեգրվել են WooCommerce / Custom E-commerce մոդուլներ, ArCa/Visa/MasterCard վճարային համակարգեր և ավտոմատացված պատվերների կառավարում։',
      en: 'Integrated custom e-commerce workflows, seamless payment gateways, and automated stock indicators.',
      ru: 'Интегрированы платежные системы, удобные фильтры товаров и быстрая система оформления заказа.',
    },
    technologies: ['WooCommerce', 'PHP', 'JavaScript', 'REST API'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-02.jpg',
    year: '2023',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '3',
    title: 'Tntes.Am',
    slug: 'tntes-am',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ',
      en: 'Online Shop',
      ru: 'Онлайн-магазин',
    },
    client: 'Tntes.am Hypermarket',
    description: {
      hy: 'Տնտեսական և շինարարական ապրանքների խոշոր օնլայն հիպերմարկետ՝ հազարավոր ապրանքատեսակների կառավարմամբ։',
      en: 'Large-scale household and hardware online store managing thousands of SKU products efficiently.',
      ru: 'Крупный интернет-гипермаркет хозяйственных и строительных товаров.',
    },
    challenge: {
      hy: 'Ծանր ապրանքացանկի ակնթարթային բեռնում և 1C/ERP համակարգի հետ ավտոմատ սինխրոնացում։',
      en: 'Ensuring instantaneous loading speed for thousands of SKUs and real-time ERP inventory sync.',
      ru: 'Обеспечение высокой скорости работы крупного каталога и синхронизация с ERP.',
    },
    solution: {
      hy: 'Ստեղծվել է բարձր արտադրողականությամբ architecture, կեշավորման համակարգ և ճկուն որոնում։',
      en: 'Built high-performance database caching and optimized UI search components.',
      ru: 'Реализовано эффективное кэширование и оптимизированный поиск по каталогу.',
    },
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-03.jpg',
    year: '2023',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '4',
    title: 'Ton Visage Studio',
    slug: 'ton-visage-studio',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ',
      en: 'Online Shop',
      ru: 'Онлайн-магазин',
    },
    client: 'Ton Visage Beauty Studio',
    description: {
      hy: 'Գեղեցկության սրահի և պրոֆեսիոնալ կոսմետիկայի էլեգանտ առցանց խանութ ու գրանցումների համակարգ։',
      en: 'Elegant cosmetics e-commerce store and online appointment booking platform.',
      ru: 'Элегантный интернет-магазин косметики и система онлайн-записи в бьюти-студию.',
    },
    challenge: {
      hy: 'Միավորել ապրանքների վաճառքը և ծառայությունների առցանց ամրագրումը մեկ ներդաշնակ ինտերֆեյսում։',
      en: 'Combine product sales with online appointment scheduling in one seamless interface.',
      ru: 'Объединить продажу косметических средств и запись на услуги в едином интерфейсе.',
    },
    solution: {
      hy: 'Մշակվել է պրեմիում aesthetics UX/UI, ինտեգրվել է առցանց օրացույցային ամրագրման մոդուլ։',
      en: 'Crafted premium editorial UI with integrated booking backend and automated notifications.',
      ru: 'Разработан премиальный дизайн и встроен модуль онлайн-календаря.',
    },
    technologies: ['WordPress', 'WooCommerce', 'Custom CSS', 'REST APIs'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-04.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '5',
    title: 'Argo Houses in USA',
    slug: 'argo-houses-usa',
    category: 'business-card',
    categoryLabel: {
      hy: 'Այցեքարտ Կայք',
      en: 'Business Card',
      ru: 'Сайт-визитка',
    },
    client: 'Argo Houses (USA)',
    description: {
      hy: 'ԱՄՆ-ում տների շինարարության և ճարտարապետության ընկերության ներկայացուցչական կայք։',
      en: 'Representative website for a US-based home construction and architectural studio.',
      ru: 'Представительский веб-сайт строительно-архитектурной компании в США.',
    },
    challenge: {
      hy: 'Ցուցադրել իրականացված նախագծերի բարձրորակ լուսանկարները և ներգրավել նոր պատվերներ ԱՄՆ շուկայում։',
      en: 'Showcase high-resolution project galleries to generate targeted real-estate leads in the US market.',
      ru: 'Презентовать портфолио построенных домов и привлечь заказчиков на американском рынке.',
    },
    solution: {
      hy: 'Ստեղծվել է մինիմալիստական, բարձր վստահություն ներշնչող դիզայն՝ արագ հարցում ուղարկելու ֆորմաներով։',
      en: 'Designed a high-trust, editorial layout with optimized contact forms and visual project sliders.',
      ru: 'Создан доверительный премиум-дизайн с удобными формами заявки.',
    },
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-05.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '6',
    title: 'Herbalicious in USA',
    slug: 'herbalicious-usa',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ',
      en: 'Online Shop',
      ru: 'Онлайн-магазин',
    },
    client: 'Herbalicious Organics',
    description: {
      hy: 'Օրգանիկ հավելումների և բնական թեյերի օնլայն խանութ ԱՄՆ շուկայի համար։',
      en: 'Online store for organic supplements and natural herbal teas operating in the US.',
      ru: 'Интернет-магазин органических пищевых добавок и травяных чаев в США.',
    },
    challenge: {
      hy: 'Ստեղծել թեթև և էկոլոգիական դիզայն, որն արտացոլում է բրենդի բնական ծագումը։',
      en: 'Design a clean, eco-themed store that conveys purity and brand credibility.',
      ru: 'Передать эко-стиль бренда и обеспечить высокую конверсию карточек товаров.',
    },
    solution: {
      hy: 'Իրականացվել է Stripe վճարային ինտեգրում, բաժանորդագրությունների համակարգ և SEO օպտիմալացում։',
      en: 'Implemented Stripe payment processing, subscription modules, and technical SEO structure.',
      ru: 'Интегрирован Stripe, подписки на доставку и полная SEO-подготовка.',
    },
    technologies: ['WooCommerce', 'PHP', 'Stripe API'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-06.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '7',
    title: 'Vardanyan Law Group in USA',
    slug: 'vardanyan-law-group',
    category: 'business-card',
    categoryLabel: {
      hy: 'Այցեքարտ Կայք',
      en: 'Business Card',
      ru: 'Сайт-визитка',
    },
    client: 'Vardanyan Law Group',
    description: {
      hy: 'ԱՄՆ-ում փաստաբանական ծառայություններ մատուցող ընկերության պաշտոնական վեբ կայք։',
      en: 'Official web platform for a legal & attorney firm based in the USA.',
      ru: 'Официальный сайт юридической фирмы в США.',
    },
    challenge: {
      hy: 'Փոխանցել պրոֆեսիոնալիզմ, հուսալիություն և ապահովել խորհրդատվության արագ ամրագրում։',
      en: 'Communicate professionalism, authority, and convert traffic into law consultation bookings.',
      ru: 'Сформировать авторитетный образ компании и упростить запись на консультацию.',
    },
    solution: {
      hy: 'Մշակվել է դասական-ժամանակակից typography և ինտերակտիվ խորհրդատվության հայտի ձև։',
      en: 'Constructed an authoritative visual design with quick legal consultation request funnels.',
      ru: 'Создан строгий стильный дизайн с формой быстрых запросов.',
    },
    technologies: ['WordPress', 'TypeScript', 'Tailwind CSS'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-07.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '8',
    title: 'Sirunes in USA',
    slug: 'sirunes-usa',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ',
      en: 'Online Shop',
      ru: 'Онлайн-магазин',
    },
    client: 'Sirunes Fashion',
    description: {
      hy: 'Կանացի հագուստի և աքսեսուարների առցանց բուտիկ ԱՄՆ-ում։',
      en: 'Women fashion and accessories online boutique tailored for the US market.',
      ru: 'Онлайн-бутик женской одежды и аксессуаров в США.',
    },
    challenge: {
      hy: 'Ապահովել ինստագրամյան ոճով visual shopping փորձառություն և արագ պատվերի ձևակերպում։',
      en: 'Deliver an Instagram-style visual shopping experience with instant checkout options.',
      ru: 'Создать визуально привлекательный каталог в стиле соцсетей с быстрым чекаутом.',
    },
    solution: {
      hy: 'Ստեղծվել է բարձրորակ ֆոտո-գալերեայով կայք՝ Apple Pay / Credit Cards վճարային հնարավորությամբ։',
      en: 'Built a visually vibrant online catalog with Apple Pay and card checkout integration.',
      ru: 'Реализована поддержка Apple Pay и стильная сетկа лукбуков.',
    },
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Stripe'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-08.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '9',
    title: 'DEKA Development Company',
    slug: 'deka-development',
    category: 'corporate',
    categoryLabel: {
      hy: 'Կորպորատիվ Կայք',
      en: 'Corporate Website',
      ru: 'Корпоративный сайт',
    },
    client: 'DEKA Development',
    description: {
      hy: 'Շինարարական և կառուցապատող խոշոր ընկերության կորպորատիվ պորտալ։',
      en: 'Corporate portal for a premier real estate development and construction enterprise.',
      ru: 'Корпоративный портал крупной девелоперской и строительной компании.',
    },
    challenge: {
      hy: 'Ներկայացնել բազմաբնակարան շենքերի նախագծերը, բնակարանների հատակագծերն ու ընթացիկ շինարարության կարգավիճակը։',
      en: 'Present multi-story residential developments, apartment floor plans, and live construction updates.',
      ru: 'Презентовать жилые комплексы, планировки квартир и ходы строительства.',
    },
    solution: {
      hy: 'Իրականացվել է ինտերակտիվ բնակարանների ընտրության մոդուլ, 3D visualizers և զանգի պատվերի ֆորմաներ։',
      en: 'Developed an interactive floor-plan selector and direct apartment inquiry routing.',
      ru: 'Разработан интерактивный выбор квартир по этажам и планировкам.',
    },
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-09.jpg',
    year: '2023',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '10',
    title: 'Mijnaberd',
    slug: 'mijnaberd',
    category: 'corporate',
    categoryLabel: {
      hy: 'Կորպորատիվ Կայք',
      en: 'Corporate Website',
      ru: 'Корпоративный сайт',
    },
    client: 'Mijnaberd Brandy & Wines',
    description: {
      hy: 'Հայկական ազնվական կոնյակի և գինիների արտադրության պրեմիում կորպորատիվ կայք։',
      en: 'Premium corporate website for an authentic Armenian brandy and wine manufacturer.',
      ru: 'Премиальный сайт армянского производителя коньяка и вин.',
    },
    challenge: {
      hy: 'Ընդգծել ապրանքանիշի պատմական ժառանգությունը, բարձր որակը և արտահանման աշխարհագրությունը։',
      en: 'Highlight heritage, distillation craftsmanship, and international export distribution.',
      ru: 'Отразить многолетние традиции производства и географию экспортных поставок.',
    },
    solution: {
      hy: 'Ստեղծվել է մուգ, ոսկեզօծ շեշտադրումներով editorial UI, ինտերակտիվ պատմության ժամանակագրությամբ։',
      en: 'Created an editorial gold-accented UI featuring rich product storytelling and interactive heritage timeline.',
      ru: 'Разработан сдержанный премиум-дизайн с акцентом на историю бренда.',
    },
    technologies: ['WordPress', 'Custom CSS', 'PHP', 'JavaScript'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-10.jpg',
    year: '2023',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '11',
    title: 'Cargo New Horizon in USA',
    slug: 'cargo-new-horizon',
    category: 'business-card',
    categoryLabel: {
      hy: 'Այցեքարտ Կայք',
      en: 'Business Card',
      ru: 'Сайт-визитка',
    },
    client: 'Cargo New Horizon',
    description: {
      hy: 'Միջազգային բեռնափոխադրումների և լոգիստիկայի ընկերության կայք ԱՄՆ-ում։',
      en: 'International cargo transportation and logistics firm landing page in the USA.',
      ru: 'Веб-сайт логистической компании по международным грузоперевозкам в США.',
    },
    challenge: {
      hy: 'Ապահովել բեռի արժեքի արագ հաշվիչ և հարցումների անմիջական ստացում։',
      en: 'Provide a quick freight estimation tool and direct lead generation forms.',
      ru: 'Внедрить калькулятор стоимости доставки и форму расчета стоимости.',
    },
    solution: {
      hy: 'Ինտեգրվել է լոգիստիկ հաշվիչ և ավտոմատացված CRM հարցումների փոխանցում։',
      en: 'Built dynamic cost estimation calculator with instant CRM inquiry dispatch.',
      ru: 'Разработан онлайн-калькулятор и отправка заявок в CRM.',
    },
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-11.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '12',
    title: 'Len Djut in RUSSIA',
    slug: 'len-djut-russia',
    category: 'ecommerce',
    categoryLabel: {
      hy: 'Օնլայն Խանութ',
      en: 'Online Shop',
      ru: 'Онлайн-магазин',
    },
    client: 'Len Djut Industrial',
    description: {
      hy: 'Արդյունաբերական տեքստիլի և ջուտե արտադրանքի մեծածախ օնլայն պորտալ Ռուսաստանում։',
      en: 'Wholesale industrial textile and jute product e-commerce catalog in Russia.',
      ru: 'Оптовый интернет-магазин промышленного текстиля и джутовой продукции в РФ.',
    },
    challenge: {
      hy: 'Կազմակերպել մեծածախ պատվերների ճկուն զեղչային համակարգ և ծավալուն ապրանքացանկ։',
      en: 'Manage bulk tier pricing, wholesale order requests, and heavy B2B item catalogs.',
      ru: 'Реализовать систему оптовых цен и быстрый заказ больших объемов товаров.',
    },
    solution: {
      hy: 'Մշակվել է B2B E-commerce ֆունկցիոնալություն՝ անհատական հաշիվների ձևավորմամբ։',
      en: 'Constructed wholesale B2B e-commerce features with instant commercial quote generation.',
      ru: 'Создан B2B-функционал для оптовых клиентов.',
    },
    technologies: ['WooCommerce', 'PHP', 'JavaScript'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-12.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '13',
    title: 'Tatev Aloyan Blog',
    slug: 'tatev-aloyan-blog',
    category: 'business-card',
    categoryLabel: {
      hy: 'Այցեքարտ Կայք',
      en: 'Business Card',
      ru: 'Сайт-визитка',
    },
    client: 'Tatev Aloyan Media',
    description: {
      hy: 'Անհատական բլոգ, մեդիա հարթակ և անձնական բրենդինգի պորտալ։',
      en: 'Personal brand media hub, article publication platform, and consulting page.',
      ru: 'Персональный медиа-блог, публикация статей и платформа личного бренда.',
    },
    challenge: {
      hy: 'Ստեղծել հարմարավետ ընթերցանության ինտերֆեյս և մեդիա բովանդակության կազմակերպում։',
      en: 'Deliver an engaging typography layout optimized for article readability.',
      ru: 'Обеспечить удобство чтения статей и структурировать медиа-контент.',
    },
    solution: {
      hy: 'Իրականացվել է բարձրորակ typography, որոնման և կատեգորիաների ճկուն համակարգ։',
      en: 'Implemented clear publication hierarchy and reader engagement modules.',
      ru: 'Разработан стильный блог с акцентом на типографику.',
    },
    technologies: ['WordPress', 'React', 'CSS3'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-13.jpg',
    year: '2023',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '14',
    title: 'Pro Development Armenia',
    slug: 'pro-development-armenia',
    category: 'corporate',
    categoryLabel: {
      hy: 'Կորպորատիվ Կայք',
      en: 'Corporate Website',
      ru: 'Корпоративный сайт',
    },
    client: 'Pro Development Armenia LLC',
    description: {
      hy: 'Տեղեկատվական տեխնոլոգիաների և ինժեներական լուծումների ընկերության կորպորատիվ կայք։',
      en: 'Corporate digital platform for an IT engineering and software solution consultancy.',
      ru: 'Корпоративный сайт IT-инжиниринговой компании в Армении.',
    },
    challenge: {
      hy: 'Ցուցադրել ընկերության տեխնիկական փորձառությունը, ծառայությունները և թիմի կարողությունները։',
      en: 'Display technical enterprise capabilities and software service offerings clearly.',
      ru: 'Продемонстрировать техническую экспертизу и спектр IT-услуг.',
    },
    solution: {
      hy: 'Ստեղծվել է ժամանակակից tech UI դիզայն՝ ինտերակտիվ ծառայությունների բաժնով։',
      en: 'Designed a high-end tech Studio UI with dynamic service breakdown modules.',
      ru: 'Создан современный технический веб-сайт с презентацией услуг.',
    },
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    coverImage: 'https://elab.am/wp-content/uploads/2022/12/portfolio-14.jpg',
    year: '2023',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '15',
    title: 'Mercury Houses',
    slug: 'mercury-houses',
    category: 'landing-page',
    categoryLabel: {
      hy: 'Լենդինգ Էջ',
      en: 'Landing Page',
      ru: 'Лендинг',
    },
    client: 'Mercury Houses Project',
    description: {
      hy: 'Էլիտար թաունհաուսների և առանձնատների վաճառքի բարձր փոխարկելիությամբ (CRO) landing page։',
      en: 'High-converting real estate landing page for modern townhouse & villa developments.',
      ru: 'Высококонверсионный лендинг по продаже элитных таунхаусов.',
    },
    challenge: {
      hy: 'Մեկ էջում ներկայացնել շինարարության առավելությունները, տեղադրվածությունը և հավաքագրել lead-եր։',
      en: 'Showcase project location, architecture, floor plans, and drive qualified consultation leads.',
      ru: 'Презентовать преимущества объекта и собрать целевые заявки на просмотр.',
    },
    solution: {
      hy: 'Մշակվել է ինտերակտիվ 3D տուրի հնարավորություն, PDF բրոշյուրի ներբեռնման ֆորմա և զանգի պատվեր։',
      en: 'Built immersive photo visualizers, brochure download gate, and quick call request funnels.',
      ru: 'Интегрирована форма скачивания презентации и удобные кнопки связи.',
    },
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    coverImage: 'https://elab.am/wp-content/uploads/2024/04/Mercury-House.jpg',
    year: '2024',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '16',
    title: 'Gastro Clinic',
    slug: 'gastro-clinic',
    category: 'corporate',
    categoryLabel: {
      hy: 'Կորպորատիվ Կայք',
      en: 'Corporate Website',
      ru: 'Корпоративный сайт',
    },
    client: 'Gastro Medical Clinic',
    description: {
      hy: 'Մասնագիտացված բժշկական կենտրոնի պաշտոնական կայք՝ բժիշկների ցանկով և առցանց հերթագրմամբ։',
      en: 'Official medical center portal with doctor profiles and online appointment booking.',
      ru: 'Официальный сайт специализированной клиники с онлайн-записью к врачам.',
    },
    challenge: {
      hy: 'Ապահովել հիվանդների համար պարզ և վստահելի ինտերֆեյս՝ մասնագետ ընտրելու և հերթագրվելու համար։',
      en: 'Provide an accessible, empathetic layout for patients to easily book medical appointments.',
      ru: 'Сделать понятную навигацию для пациентов и удобный выбор врача.',
    },
    solution: {
      hy: 'Իրականացվել է բժիշկների ֆիլտրացիա ըստ մասնագիտության և ակնթարթային հերթագրման համակարգ։',
      en: 'Implemented doctor directory search, specialty filters, and appointment request API.',
      ru: 'Создан каталог специалистов с фильтрами и формой записи.',
    },
    technologies: ['WordPress', 'PHP', 'JavaScript', 'CSS3'],
    coverImage: 'https://elab.am/wp-content/uploads/2024/04/GastroClinic.jpg',
    year: '2024',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '17',
    title: 'Hair By Siri',
    slug: 'hair-by-siri',
    category: 'business-card',
    categoryLabel: {
      hy: 'Այցեքարտ Կայք',
      en: 'Business Card',
      ru: 'Сайт-визитка',
    },
    client: 'Hair By Siri Studio',
    description: {
      hy: 'Սթայլինգի և մազերի խնամքի հեղինակային ստուդիայի նորաոճ այցեքարտ կայք։',
      en: 'Stylish showcase and portfolio website for a premium hair styling studio.',
      ru: 'Стильный сайт-визитка авторской студии красоты и парикмахерского искусства.',
    },
    challenge: {
      hy: 'Ցուցադրել աշխատանքների ֆոտո-շարքը և ապահովել արագ կապ WhatsApp / Instagram հարթակներով։',
      en: 'Showcase visual transformation work and provide instant booking via WhatsApp/IG.',
      ru: 'Презентовать портфолио работ и настроить быструю связь через мессенджеры.',
    },
    solution: {
      hy: 'Ստեղծվել է modern dark-chic դիզայն՝ արագ գրանցման կոճակներով։',
      en: 'Designed modern dark-chic visuals with floating quick-message buttons.',
      ru: 'Создан стильный темный дизайн с кнопками быстрого перехода в мессенджеры.',
    },
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    coverImage: 'https://elab.am/wp-content/uploads/2024/04/Hairbysiri.jpg',
    year: '2024',
    featured: false,
    websiteUrl: 'https://elab.am/cases/',
  },
  {
    id: '18',
    title: 'Sigma Medicare by Sigma Group',
    slug: 'sigma-medicare',
    category: 'corporate',
    categoryLabel: {
      hy: 'Կորպորատիվ Կայք',
      en: 'Corporate Website',
      ru: 'Корпоративный сайт',
    },
    client: 'Sigma Group Healthcare',
    description: {
      hy: 'Բժշկական սարքավորումների և դեղագործական ապրանքների ներմուծող խոշոր ընկերության կայք։',
      en: 'Corporate portal for a medical equipment and pharmaceutical distribution group.',
      ru: 'Корпоративный сайт поставщика медицинского оборудования и фармацевтики.',
    },
    challenge: {
      hy: 'Ներկայացնել բարդ բժշկական սարքավորումների ցանկը, տեխնիկական անձնագրերն ու B2B հարցումները։',
      en: 'Catalog complex medical apparatus, specifications, and streamline B2B quote inquiries.',
      ru: 'Структурировать каталог медоборудования и внедрить форму коммерческого запроса.',
    },
    solution: {
      hy: 'Ստեղծվել է B2B կորպորատիվ կառուցվածք, PDF տեխնիկական փաստաթղթերի ներբեռնում և հայտի ձև։',
      en: 'Built B2B product documentation engine with interactive quote request routing.',
      ru: 'Разработан B2B-каталог с возможностью скачивания спецификаций.',
    },
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    coverImage: 'https://elab.am/wp-content/uploads/2024/04/SigmaMedicare.jpg',
    year: '2024',
    featured: true,
    websiteUrl: 'https://elab.am/cases/',
  },
];

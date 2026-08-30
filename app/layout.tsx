import type { Metadata } from 'next';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { CookieConsent } from '@/components/ui/CookieConsent';

export const metadata: Metadata = {
  title: 'eLab — Web Development & Digital Solutions in Armenia | elab.am',
  description: 'eLab (elab.am) builds modern, fast, high-converting websites, landing pages, e-commerce online stores, and digital solutions for Armenian and international businesses. 10+ years of experience, 50+ projects.',
  keywords: [
    'Website development Armenia',
    'Web development Armenia',
    'Website design Armenia',
    'Landing page Armenia',
    'Online store development Armenia',
    'WordPress development Armenia',
    'E-commerce development Armenia',
    'Website development company Armenia',
    'Կայքերի պատրաստում',
    'Կայքերի պատրաստում Հայաստանում',
    'Վեբ կայքերի ստեղծում',
    'Создание сайтов Армения',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: 'https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
  },
  authors: [{ name: 'eLab Digital Studio', url: 'https://elab.am' }],
  creator: 'eLab Digital Studio',
  publisher: 'eLab',
  metadataBase: new URL('https://elab.am'),
  alternates: {
    canonical: 'https://elab.am',
  },
  openGraph: {
    title: 'eLab — We build websites that move businesses forward',
    description: 'Premier Web Development Studio in Armenia. 10+ Years Experience, 50+ Successful Cases, 12+ Industry Awards.',
    url: 'https://elab.am',
    siteName: 'eLab Digital Studio',
    locale: 'hy_AM',
    type: 'website',
    images: [
      {
        url: 'https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg',
        width: 1200,
        height: 630,
        alt: 'eLab Digital Studio Armenia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eLab — Web Development Armenia',
    description: 'Modern, fast, conversion-focused websites for businesses in Armenia.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" className="dark">
      <head>
        <JsonLd />
      </head>
      <body className="antialiased bg-[#0b0c10] text-[#f8fafc]">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

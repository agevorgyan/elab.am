'use client';

import React from 'react';

export const JsonLd: React.FC = () => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://elab.am/#organization',
        name: 'eLab Digital Studio',
        url: 'https://elab.am',
        logo: 'https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg',
        telephone: '+37455776066',
        email: 'info@elab.am',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Yerevan',
          addressCountry: 'AM',
        },
        sameAs: [
          'https://www.facebook.com/elab.am',
          'https://www.instagram.com/elab.armenia/',
          'https://www.linkedin.com/company/elab-armenia/',
          'https://www.youtube.com/@eLab-armenia',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://elab.am/#website',
        url: 'https://elab.am',
        name: 'eLab - Web Development & Digital Studio Armenia',
        description: 'Modern websites and digital solutions for businesses in Armenia.',
        publisher: {
          '@id': 'https://elab.am/#organization',
        },
        inLanguage: ['hy', 'en', 'ru'],
      },
      {
        '@type': 'Service',
        name: 'Website Development & Design in Armenia',
        provider: {
          '@id': 'https://elab.am/#organization',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Armenia',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'eLab Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Landing Page Development',
              },
              price: '190000',
              priceCurrency: 'AMD',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Corporate Website Development',
              },
              price: '290000',
              priceCurrency: 'AMD',
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'E-Commerce Online Store Development',
              },
              price: '350000',
              priceCurrency: 'AMD',
            },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

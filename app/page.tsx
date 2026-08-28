'use client';

import React, { useState } from 'react';
import { Language } from '@/lib/translations';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { SocialProof } from '@/components/sections/SocialProof';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WhyElab } from '@/components/sections/WhyElab';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { TechStack } from '@/components/sections/TechStack';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  const [lang, setLang] = useState<Language>('hy');

  return (
    <main className="min-h-screen bg-[#0b0c10] text-[#f8fafc] overflow-hidden">
      {/* Sticky Header Navigation */}
      <Header lang={lang} onLanguageChange={setLang} />

      {/* 01. Hero Section */}
      <Hero lang={lang} />

      {/* 02. Trust & Social Proof Bar */}
      <SocialProof lang={lang} />

      {/* 03. Selected Work / Portfolio */}
      <PortfolioSection lang={lang} />

      {/* 04. Digital Services Grid */}
      <ServicesSection lang={lang} />

      {/* 05. Why eLab Differentiation */}
      <WhyElab lang={lang} />

      {/* 06. 5-Step Process Timeline */}
      <ProcessSection lang={lang} />

      {/* 07. Transparent Pricing Tiers */}
      <PricingSection lang={lang} />

      {/* 08. Technology Stack Showcase */}
      <TechStack lang={lang} />

      {/* 09. Frequently Asked Questions */}
      <FaqSection lang={lang} />

      {/* 10. High-Impact Closing CTA */}
      <FinalCta lang={lang} />

      {/* 11. Lead Inquiry Contact Form */}
      <ContactSection lang={lang} />

      {/* 12. Footer */}
      <Footer lang={lang} />
    </main>
  );
}

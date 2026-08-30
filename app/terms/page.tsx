import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileText } from 'lucide-react';
import { buildDynamicMetadata } from '@/lib/seo-db';
import { getPublishedLegalPageBySlug } from '@/lib/legal-db';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedLegalPageBySlug('terms');
  return await buildDynamicMetadata('/terms', {
    title: page?.title ? `${page.title} | eLab.am Digital Studio` : 'Terms of Use | eLab.am Digital Studio',
    description: 'Read eLab\'s Terms of Use governing website usage, intellectual property, and service agreements.',
  });
}

export default async function TermsPage() {
  const page = await getPublishedLegalPageBySlug('terms');

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc]">
      <Header lang="en" />

      <section className="pt-36 pb-20 bg-grid-pattern relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
            <FileText className="w-4 h-4" />
            <span>Legal Documentation (v{page.version})</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {page.title}<span className="text-[#00dc93]">.</span>
          </h1>

          <p className="text-xs font-mono text-slate-400">
            Last updated: {page.lastUpdated}
          </p>

        </div>
      </section>

      <section className="py-16 bg-[#0d0e14]">
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </section>

      <Footer lang="en" />
    </div>
  );
}

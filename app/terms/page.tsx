import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | eLab.am Digital Studio',
  description: 'Read eLab\'s Terms of Use governing website usage, intellectual property, and service agreements.',
  alternates: {
    canonical: 'https://elab.am/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc]">
      <Header lang="en" />

      <section className="pt-36 pb-20 bg-grid-pattern relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
            <FileText className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Use<span className="text-[#00dc93]">.</span>
          </h1>

          <p className="text-xs font-mono text-slate-400">
            Last updated: August 28, 2026
          </p>

        </div>
      </section>

      <section className="py-16 bg-[#0d0e14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-xs text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
            <strong>Legal Notice:</strong> This document governs your usage of the eLab website (elab.am). Legal documents should be reviewed by qualified legal counsel prior to formal execution.
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">1. General Information</h2>
            <p>
              Welcome to eLab.am (&quot;eLab&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing or using our website located at <code className="text-[#00dc93]">https://elab.am</code>, you agree to comply with and be bound by these Terms of Use.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">2. Website Usage</h2>
            <p>
              You agree to use this website solely for lawful purposes and in a manner that does not infringe upon the rights of, or restrict the use of this site by, any third party.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">3. Services &amp; Information</h2>
            <p>
              eLab provides web development, UX/UI design, e-commerce engineering, and digital solution services. The starting prices listed in AMD (Armenian Dram) on this website represent preliminary estimate baselines.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">4. Intellectual Property</h2>
            <p>
              All content, trademarks, logos, graphics, case studies, and source code displayed on this website are the intellectual property of eLab or its respective client brand partners and are protected by applicable intellectual property laws in Armenia and internationally.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">5. Contact Forms and Requests</h2>
            <p>
              Submitting an inquiry through our project form does not constitute a binding contract. A formal service agreement is executed prior to the commencement of any custom development work.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">6. Contact Information</h2>
            <p>
              For questions regarding these Terms of Use, please contact eLab at <a href="mailto:info@elab.am" className="text-[#00dc93] hover:underline">info@elab.am</a> or by phone at <a href="tel:+37455776066" className="text-[#00dc93] hover:underline">+374 55 77 60 66</a>.
            </p>
          </div>

        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}

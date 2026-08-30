import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Cookie, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | eLab.am Digital Studio',
  description: 'Read eLab\'s Cookie Policy explaining necessary and optional analytics cookies used on our website.',
  alternates: {
    canonical: 'https://elab.am/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc]">
      <Header lang="en" />

      <section className="pt-36 pb-20 bg-grid-pattern relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
            <Cookie className="w-4 h-4" />
            <span>Cookie Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Cookie Policy<span className="text-[#00dc93]">.</span>
          </h1>

          <p className="text-xs font-mono text-slate-400">
            Last updated: August 28, 2026
          </p>

        </div>
      </section>

      <section className="py-16 bg-[#0d0e14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-xs text-slate-300 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you visit websites. They help remember user choices and measure site performance.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">2. Essential vs Optional Cookies</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#141722] border border-white/10 space-y-1">
                <h3 className="font-bold text-white">Strictly Necessary Cookies (Always Active)</h3>
                <p className="text-[#00dc93]">Required for basic navigation, security, and contact form submission.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141722] border border-white/10 space-y-1">
                <h3 className="font-bold text-white">Analytics Cookies (Optional)</h3>
                <p className="text-slate-400">Google Analytics (G-XXXXXXXXXX) used to measure traffic and performance. Activated only with explicit user consent.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">3. Managing Your Preferences</h2>
            <p>
              You can reopen and update your Cookie Preferences at any time using the <strong>Cookie Settings</strong> link in our website footer.
            </p>
          </div>

        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}

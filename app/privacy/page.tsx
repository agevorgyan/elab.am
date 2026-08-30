import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | eLab.am Digital Studio',
  description: 'Read eLab\'s Privacy Policy describing how we handle personal information submitted through project inquiry forms.',
  alternates: {
    canonical: 'https://elab.am/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc]">
      <Header lang="en" />

      <section className="pt-36 pb-20 bg-grid-pattern relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
            <Lock className="w-4 h-4" />
            <span>Data Protection & Privacy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy<span className="text-[#00dc93]">.</span>
          </h1>

          <p className="text-xs font-mono text-slate-400">
            Last updated: August 28, 2026
          </p>

        </div>
      </section>

      <section className="py-16 bg-[#0d0e14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-xs text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
            <strong>Privacy Commitment:</strong> eLab is committed to handling project inquiry details transparently, securely, and in accordance with applicable Armenian privacy laws.
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">1. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide when submitting a project inquiry on our website. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Full Name</li>
              <li>Company Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Selected Project Type and Budget Range</li>
              <li>Project Description & Message Details</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">2. How We Use Information</h2>
            <p>
              We use collected information solely to respond to your project inquiry, provide preliminary price estimations, schedule project consultations, and deliver custom development services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">3. Data Security & Confidentiality</h2>
            <p>
              Your contact details are private. We store inquiry details securely and strictly enforce role-based access control (RBAC). We do not sell, rent, or trade your personal information to third parties.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">4. Cookies & Analytics</h2>
            <p>
              We use essential cookies for site functionality and optional analytics cookies to measure load speed. You can manage or revoke your consent anytime using our <Link href="/cookies" className="text-[#00dc93] hover:underline">Cookie Policy</Link> or Cookie Settings.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-white">5. Contact Data Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your submitted project inquiry details. Contact eLab at <a href="mailto:info@elab.am" className="text-[#00dc93] hover:underline">info@elab.am</a>.
            </p>
          </div>

        </div>
      </section>

      <Footer lang="en" />
    </div>
  );
}

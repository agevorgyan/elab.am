'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { ArrowRight, Sparkles, PhoneCall } from 'lucide-react';

interface FinalCtaProps {
  lang: Language;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].finalCta;

  return (
    <section className="py-20 bg-[#0d0e14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141722] via-[#181b26] to-[#141722] border border-[#00dc93]/30 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-[#00dc93]/10">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00dc93]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-bold text-[#00dc93]">
              <Sparkles className="w-4 h-4" />
              <span>eLab Digital Funnel</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {t.title}
            </h2>

            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-base shadow-xl shadow-[#00dc93]/25 hover:scale-[1.02] transition-all"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="tel:+37455776066"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#00dc93]" />
                <span>+374 55 77 60 66</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

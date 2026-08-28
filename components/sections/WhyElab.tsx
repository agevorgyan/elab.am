'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { ShieldCheck, Zap, Sparkles, Code2, Lock, Headphones, Trophy, CheckCircle2 } from 'lucide-react';

interface WhyElabProps {
  lang: Language;
}

export const WhyElab: React.FC<WhyElabProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].whyUs;

  const icons = [Trophy, Zap, Code2, Sparkles, Lock, Headphones];

  return (
    <section id="why-us" className="py-24 bg-[#0b0c10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00dc93]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={item.title}
                className="p-8 rounded-3xl bg-[#141722] border border-white/10 hover:border-[#00dc93]/40 transition-all duration-300 space-y-4 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00dc93]/10 border border-[#00dc93]/20 flex items-center justify-center text-[#00dc93] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-extrabold text-white group-hover:text-[#00dc93] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

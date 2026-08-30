'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';

interface SocialProofProps {
  lang: Language;
}

export const SocialProof: React.FC<SocialProofProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].stats;

  const stats = [
    { value: '10+', label: t.experience },
    { value: '50+', label: t.projects },
    { value: '12+', label: t.awards },
    { value: '99.4%', label: t.satisfaction },
  ];

  return (
    <section className="py-12 bg-[#0d0e14] border-y border-white/10 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-[#00dc93] font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

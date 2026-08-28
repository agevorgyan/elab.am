'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Award, Briefcase, Clock, Smile } from 'lucide-react';

interface SocialProofProps {
  lang: Language;
}

export const SocialProof: React.FC<SocialProofProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].stats;

  const stats = [
    {
      id: 'years',
      number: '10+',
      label: t.years,
      icon: Clock,
      color: 'from-[#00dc93] to-emerald-500',
    },
    {
      id: 'projects',
      number: '50+',
      label: t.projects,
      icon: Briefcase,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'awards',
      number: '12+',
      label: t.awards,
      icon: Award,
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'satisfaction',
      number: '99.4%',
      label: t.satisfaction,
      icon: Smile,
      color: 'from-teal-400 to-[#00dc93]',
    },
  ];

  return (
    <section className="relative py-12 bg-[#0d0e14] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="group relative p-6 rounded-2xl bg-[#141722]/60 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
                    <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center text-white">
                      <Icon className="w-6 h-6 text-[#00dc93]" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-white group-hover:text-[#00dc93] transition-colors">
                      {stat.number}
                    </span>
                    <span className="text-xs text-slate-400 font-medium mt-0.5">
                      {stat.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

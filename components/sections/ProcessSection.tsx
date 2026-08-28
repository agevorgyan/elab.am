'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Compass, FileText, Palette, Code2, Rocket, ArrowRight } from 'lucide-react';

interface ProcessSectionProps {
  lang: Language;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].process;

  const icons = [Compass, FileText, Palette, Code2, Rocket];

  return (
    <section id="process" className="py-24 bg-[#0d0e14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00dc93]">
            <Compass className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* 5-Step Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {t.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-3xl bg-[#141722] border border-white/10 hover:border-[#00dc93]/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Step Number & Icon Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-600 group-hover:text-[#00dc93] transition-colors font-mono">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#00dc93]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#00dc93] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Connective Indicator */}
                {index < t.steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-[#0b0c10] border border-white/20 flex items-center justify-center text-slate-500">
                      <ArrowRight className="w-3 h-3 text-[#00dc93]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

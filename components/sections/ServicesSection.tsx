'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Check, ArrowRight, Layout, ShoppingBag, Globe2, QrCode, Newspaper, Cpu } from 'lucide-react';

interface ServicesSectionProps {
  lang: Language;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].services;

  const serviceIcons = [Layout, Globe2, ShoppingBag, QrCode, Newspaper, Cpu];

  return (
    <section id="services" className="py-24 bg-[#0d0e14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00dc93]">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <div
                key={service.id}
                className="group relative p-8 rounded-3xl bg-[#141722] border border-white/10 hover:border-[#00dc93]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#00dc93]/10"
              >
                <div className="space-y-6">
                  {/* Icon & Price Tag Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#00dc93]/10 border border-[#00dc93]/20 flex items-center justify-center text-[#00dc93] group-hover:bg-[#00dc93] group-hover:text-black transition-colors duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                        {t.fromPrice}
                      </span>
                      <span className="text-sm font-extrabold text-[#00dc93] font-mono">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00dc93] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-[#00dc93] shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action CTA */}
                <div className="pt-8">
                  <a
                    href="#contact"
                    className="w-full py-3 rounded-xl bg-white/5 group-hover:bg-[#00dc93] text-white group-hover:text-black font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 group-hover:border-[#00dc93]"
                  >
                    <span>{t.discussProject}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

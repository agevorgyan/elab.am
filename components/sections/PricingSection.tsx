'use client';

import React, { useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { ServiceItem } from '@/lib/services';
import { Check, Sparkles, CreditCard } from 'lucide-react';

interface PricingSectionProps {
  lang: Language;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].pricing;
  const [dbServices, setDbServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.services) && data.services.length > 0) {
          setDbServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  // Format pricing string dynamically based on showPrice and priceCurrency
  const formatPriceDisplay = (service: ServiceItem) => {
    if (!service.showPrice) {
      return 'Custom Quote';
    }
    const val = service.priceAmd || '';
    if (val.includes(service.priceCurrency)) {
      return val;
    }
    return `${val} ${service.priceCurrency}`;
  };

  return (
    <section id="pricing" className="py-24 bg-[#0b0c10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00dc93]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dbServices.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-3xl bg-[#141722] border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl ${
                plan.popular
                  ? 'border-[#00dc93] shadow-2xl shadow-[#00dc93]/15'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#00dc93] text-black font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                  {t.popular}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white">{plan.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline || plan.description}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">
                    {plan.priceLabel || t.from}
                  </span>
                  <span className="text-2xl font-black text-[#00dc93] font-mono">
                    {formatPriceDisplay(plan)}
                  </span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-white/5">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-[#00dc93] shrink-0" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#contact"
                  className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-[#00dc93] text-black hover:bg-[#38ef7d] shadow-lg shadow-[#00dc93]/20'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <span>{plan.ctaText || t.getEstimate}</span>
                </a>
              </div>
            </div>
          ))}

          {/* Custom Project Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#141722] to-[#181b26] border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Custom Web Application</h3>
                <p className="text-xs text-slate-400 mt-1">Bespoke software, API integrations, and scalable business logic</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                <span className="text-2xl font-black text-indigo-400 font-mono">
                  Custom Quote
                </span>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Next.js / Node.js / PostgreSQL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Custom REST / GraphQL APIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Dedicated Architect &amp; PM</span>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition-colors shadow-lg shadow-indigo-600/20"
            >
              Discuss Custom Build
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

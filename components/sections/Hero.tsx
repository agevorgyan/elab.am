'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { ArrowRight, ShieldCheck, Zap, Sparkles, PhoneCall } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].hero;

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#090a0f] text-[#f8fafc]">
      {/* Background Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00dc93]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141722] border border-white/10 text-xs font-semibold text-[#00dc93] shadow-inner">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              {t.title}
              <span className="text-[#00dc93]">.</span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              {t.subtitle}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-sm shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                <span>{t.secondaryCta}</span>
              </a>
            </div>

            {/* Value Highlights Pill Row */}
            <div className="pt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Zap className="w-3.5 h-3.5 text-[#00dc93]" />
                <span>{t.speedMetric}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Sparkles className="w-3.5 h-3.5 text-[#00dc93]" />
                <span>100% Custom UX/UI</span>
              </div>
            </div>

          </div>

          {/* Right Hero Studio Visual Mockup Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#141722] border border-white/15 p-4 sm:p-6 shadow-2xl overflow-hidden group">
              
              {/* Fake Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">elab.am / showcase</span>
              </div>

              {/* Real Project Visual Preview (Gayane's Kitchen) */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Gayane's Kitchen Project Preview"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Live Speed Score Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0b0c10]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00dc93] animate-pulse" />
                    <span className="text-[11px] font-bold text-white">Gayane's Kitchen</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00dc93] font-bold bg-[#00dc93]/10 px-2 py-0.5 rounded border border-[#00dc93]/20">
                    Performance 99/100
                  </span>
                </div>
              </div>

              {/* Verified Trust Overlay Card */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-bold">10+ Years Building Web Solutions</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">50+ Verified Armenian & Global Cases</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-[#00dc93] flex items-center justify-center font-mono font-bold text-xs">
                  50+
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

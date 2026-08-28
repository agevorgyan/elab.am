'use client';

import React from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { ArrowRight, Sparkles, CheckCircle2, Zap, ShieldCheck, Play, Code, Smartphone, BarChart3 } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].hero;

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-grid-pattern">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] radial-glow pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] radial-glow-indigo pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Funnel CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00dc93] animate-ping" />
              <span className="text-[#00dc93] font-bold">eLab Studio</span>
              <span className="text-slate-500">•</span>
              <span>{t.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              {t.title1}{' '}
              <span className="block text-accent-gradient drop-shadow-sm mt-1">
                {t.titleHighlight}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              {t.subtitle}
            </p>

            {/* Key Value Pill Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 w-full">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#00dc93] shrink-0" />
                <span>100% Custom UX/UI (No Templates)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                <Zap className="w-4 h-4 text-[#00dc93] shrink-0" />
                <span>Lighthouse 95+ Speed & SEO</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-[#00dc93] shrink-0" />
                <span>Mobile-First Conversion Funnel</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/5 px-3 py-2 rounded-xl">
                <Sparkles className="w-4 h-4 text-[#00dc93] shrink-0" />
                <span>10+ Years of Verified Experience</span>
              </div>
            </div>

            {/* Primary & Secondary Funnel CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00dc93] to-[#38ef7d] text-black font-extrabold text-base shadow-xl shadow-[#00dc93]/25 hover:shadow-[#00dc93]/40 hover:scale-[1.02] transition-all duration-200"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#141722] border border-white/10 hover:border-white/20 text-white font-bold text-base hover:bg-white/5 transition-all duration-200"
              >
                <span>{t.secondaryCta}</span>
              </a>
            </div>

            {/* Live Status Footnote */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-700 border border-[#0b0c10] flex items-center justify-center text-[10px] font-bold text-white">eL</div>
                <div className="w-6 h-6 rounded-full bg-[#00dc93] border border-[#0b0c10] flex items-center justify-center text-[10px] font-bold text-black">AM</div>
                <div className="w-6 h-6 rounded-full bg-indigo-600 border border-[#0b0c10] flex items-center justify-center text-[10px] font-bold text-white">50+</div>
              </div>
              <span>{t.liveStatus}</span>
            </div>

          </div>

          {/* Right Column: Layered UI Visual Composition */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-lg">
              
              {/* Outer Decorative Glow Border */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#00dc93] via-indigo-500 to-[#38ef7d] opacity-30 blur-xl animate-pulse-glow" />

              {/* Main Browser Mockup Window */}
              <div className="relative rounded-2xl bg-[#141722] border border-white/10 shadow-2xl overflow-hidden">
                
                {/* Browser Header Bar */}
                <div className="bg-[#0b0c10] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 bg-[#181b26] px-3 py-1 rounded-md text-[11px] text-slate-400 font-mono">
                    <span className="text-[#00dc93]">https://</span>
                    <span className="text-white">elab.am</span>
                  </div>
                  <div className="w-4 h-4 text-slate-500">
                    <Code className="w-4 h-4" />
                  </div>
                </div>

                {/* Interactive Inner Preview Screen */}
                <div className="p-5 space-y-4 bg-gradient-to-b from-[#141722] to-[#0b0c10]">
                  
                  {/* Hero Visual Card Header */}
                  <div className="flex items-center justify-between bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00dc93]/20 border border-[#00dc93]/30 flex items-center justify-center text-[#00dc93]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">eLab Digital Engine</div>
                        <div className="text-[10px] text-slate-400">Next.js 14 • React • Tailwind</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#00dc93]/20 text-[#00dc93] text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>

                  {/* Real Project Teaser Highlight (Gayane's Kitchen) */}
                  <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                    <img
                      src="https://elab.am/wp-content/uploads/2022/12/portfolio-01.jpg"
                      alt="Gayane's Kitchen eLab Showcase"
                      className="w-full h-44 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <div className="text-xs font-bold text-white">Gayane's Kitchen</div>
                        <div className="text-[10px] text-[#00dc93]">Culinary E-Commerce & Menu</div>
                      </div>
                      <span className="text-[10px] font-bold bg-[#00dc93] text-black px-2 py-0.5 rounded">
                        Case Study
                      </span>
                    </div>
                  </div>

                  {/* Real Time Performance Metrics Chips */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Lighthouse</div>
                      <div className="text-sm font-extrabold text-[#00dc93]">99/100</div>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Load Speed</div>
                      <div className="text-sm font-extrabold text-indigo-400">&lt; 0.7s</div>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] text-slate-400 font-medium">Conversion</div>
                      <div className="text-sm font-extrabold text-emerald-400">+240%</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Tech Badges */}
              <div className="absolute -bottom-4 -left-4 bg-[#181b26] border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md animate-bounce-slow">
                <div className="p-2 rounded-xl bg-[#00dc93]/20 text-[#00dc93]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">100% Mobile Ready</div>
                  <div className="text-[10px] text-slate-400">Armenia & Global</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#181b26] border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-3 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">50+ Real Projects</div>
                  <div className="text-[10px] text-slate-400">12+ Awards</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

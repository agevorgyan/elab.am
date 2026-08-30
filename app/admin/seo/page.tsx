'use client';

import React, { useState } from 'react';
import { Search, Save, CheckCircle2, Globe, Sparkles } from 'lucide-react';

export default function AdminSeoPage() {
  const [seo, setSeo] = useState({
    siteTitle: 'eLab — Web Development & Digital Solutions in Armenia | elab.am',
    siteDescription: 'eLab (elab.am) builds modern, fast, high-converting websites, landing pages, e-commerce online stores, and digital solutions for Armenian and international businesses.',
    keywords: 'Website development Armenia, Web development Armenia, Landing page Armenia, Կայքերի պատրաստում, Создание сайтов Армения',
    ogImage: 'https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            SEO & Social Metadata Manager<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Optimize search engine titles, meta descriptions, Open Graph cards, and Armenian local SEO themes.
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 rounded-xl bg-[#00dc93]/20 border border-[#00dc93]/40 text-[#00dc93] text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>SEO Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
        
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-300 uppercase">Global Site Title</label>
          <input
            type="text"
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-300 uppercase">Global Meta Description</label>
          <textarea
            rows={3}
            value={seo.siteDescription}
            onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93] resize-none"
          />
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-300 uppercase">Target Armenian & Global Keywords</label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save SEO Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}

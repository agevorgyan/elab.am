'use client';

import React from 'react';
import { TRANSLATIONS } from '@/lib/translations';
import { FileText, Edit3, Plus, Globe2, CreditCard, HelpCircle, Quote } from 'lucide-react';

export default function AdminContentPage() {
  const services = TRANSLATIONS.en.services.items;
  const faq = TRANSLATIONS.en.faq.items;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Content & Services CMS<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage service packages, AMD pricing tiers, client testimonials, and FAQ accordion entries.
          </p>
        </div>
      </div>

      {/* Services & Pricing Management */}
      <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Digital Service Packages & Pricing</h2>
              <p className="text-xs text-slate-400">Configure public service descriptions and starting AMD pricing</p>
            </div>
          </div>

          <button className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10">
            <Plus className="w-4 h-4 text-[#00dc93]" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((item, idx) => (
            <div key={item.id} className="p-5 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#00dc93] font-bold">0{idx + 1}</span>
                <span className="text-white font-black">{item.price}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
              <div className="pt-2 flex justify-end">
                <button className="text-[11px] font-bold text-[#00dc93] hover:underline flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Package</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Management */}
      <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">FAQ Accordion Entries</h2>
              <p className="text-xs text-slate-400">Questions and answers presented in the FAQ section</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {faq.map((item) => (
            <div key={item.q} className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-white">{item.q}</div>
                <div className="text-slate-400 mt-0.5 line-clamp-1">{item.a}</div>
              </div>
              <button className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-[#00dc93]">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

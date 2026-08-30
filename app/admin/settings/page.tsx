'use client';

import React, { useState } from 'react';
import { INITIAL_SETTINGS, SiteSettings } from '@/lib/admin-store';
import { Settings, Phone, Mail, Globe, Save, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Site Settings & Contact Setup<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure branding, phone numbers, email destinations, and social links consumed dynamically by elab.am.
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 rounded-xl bg-[#00dc93]/20 border border-[#00dc93]/40 text-[#00dc93] text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Contact Settings (Rule #13) */}
        <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Contact & Communication Settings</h2>
              <p className="text-xs text-slate-400">Direct phone numbers and lead email destinations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Primary Phone Number</label>
              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Primary Email Address</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Telegram Handle</label>
              <input
                type="text"
                name="telegram"
                value={settings.telegram}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>
        </div>

        {/* Social Networks Settings (Rule #14) */}
        <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Social Network Profiles</h2>
              <p className="text-xs text-slate-400">Social channels displayed in header and footer</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Facebook Page URL</label>
              <input
                type="text"
                name="facebook"
                value={settings.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Instagram Profile URL</label>
              <input
                type="text"
                name="instagram"
                value={settings.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">LinkedIn Company URL</label>
              <input
                type="text"
                name="linkedin"
                value={settings.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">YouTube Channel URL</label>
              <input
                type="text"
                name="youtube"
                value={settings.youtube}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 rounded-2xl bg-[#00dc93] text-black font-black text-xs flex items-center gap-2 shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_SETTINGS, SiteSettings } from '@/lib/admin-store';
import { Phone, Mail, Globe, Save, CheckCircle2, AlertCircle, KeyRound, Building, Image as ImageIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Fetch real database settings on mount
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Database save failed.');
      } else {
        setSaved(true);
        if (data.settings) {
          setSettings(data.settings);
        }
        setTimeout(() => setSaved(false), 3500);
      }
    } catch {
      setErrorMsg('Database network connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaved(false);
    setErrorMsg('');

    if (!passwordState.currentPassword || !passwordState.newPassword || !passwordState.confirmPassword) {
      setErrorMsg('All password fields are required.');
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordState),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to change password.');
      } else {
        setPasswordSaved(true);
        setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSaved(false), 3500);
      }
    } catch {
      setErrorMsg('Network error while updating password.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Site Settings &amp; CMS<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Database-backed CMS settings: Configure branding assets, contact info, social links, and admin security.
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 rounded-xl bg-[#00dc93]/20 border border-[#00dc93]/40 text-[#00dc93] text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Database Saved Permanently!</span>
          </div>
        )}

        {errorMsg && (
          <div className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Branding Settings */}
        <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00dc93] flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Brand &amp; Identity Settings</h2>
              <p className="text-xs text-slate-400">Company brand name, logo reference, and official URL</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Company / Brand Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Logo Asset Path / URL</label>
              <div className="relative">
                <input
                  type="text"
                  name="logoUrl"
                  value={settings.logoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Website Base URL</label>
              <input
                type="text"
                name="websiteUrl"
                value={settings.websiteUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Contact &amp; Communication Settings</h2>
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

        {/* Social Networks Settings */}
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

        {/* Analytics & Tracking Settings */}
        <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Analytics &amp; Consent Tracking</h2>
              <p className="text-xs text-slate-400">Consent-aware Google Analytics measurement ID (e.g., G-XXXXXXXXXX)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Google Analytics ID (GOOGLE_ANALYTICS_ID)</label>
              <input
                type="text"
                name="googleAnalyticsId"
                value={settings.googleAnalyticsId || ''}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Loads only after explicit Analytics cookie consent.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase">Meta Pixel ID (META_PIXEL_ID)</label>
              <input
                type="text"
                name="metaPixelId"
                value={settings.metaPixelId || ''}
                onChange={handleChange}
                placeholder="123456789012345"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Loads only after explicit Marketing cookie consent.
              </p>
            </div>
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-xs flex items-center gap-2 shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving to Database...' : 'Save Settings to PostgreSQL'}</span>
          </button>
        </div>

      </form>

      {/* Admin Change Password Section */}
      <form onSubmit={handlePasswordChange} className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Change Admin Password</h2>
              <p className="text-xs text-slate-400">Update current admin account credentials with Argon2 hashing</p>
            </div>
          </div>

          {passwordSaved && (
            <div className="px-3 py-1 rounded-xl bg-[#00dc93]/20 text-[#00dc93] text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password Updated!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase">Current Password</label>
            <input
              type="password"
              required
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase">New Password</label>
            <input
              type="password"
              required
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>

    </div>
  );
}

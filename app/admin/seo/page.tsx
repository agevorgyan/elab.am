'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DbSeoMetadata } from '@/lib/seo-db';
import {
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Share2,
  Shield,
  Layers,
} from 'lucide-react';

const PRESET_ROUTES = [
  { path: '/', label: 'Homepage' },
  { path: '/services', label: 'Services & Packages' },
  { path: '/work', label: 'Portfolio Overview' },
  { path: '/#contact', label: 'Contact Section' },
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
  { path: '/cookies', label: 'Cookie Policy' },
];

export default function AdminSeoPage() {
  const [records, setRecords] = useState<DbSeoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    path: '/',
    title: '',
    description: '',
    keywordsText: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    robots: 'index, follow',
  });

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/seo');
      const data = await res.json();
      if (Array.isArray(data.seoRecords)) {
        setRecords(data.seoRecords);
      }
    } catch {
      setErrorMsg('Failed to load SEO metadata records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/seo')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data.seoRecords)) {
          setRecords(data.seoRecords);
        }
      })
      .catch(() => {
        if (isMounted) setErrorMsg('Failed to load SEO metadata.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (record?: DbSeoMetadata, initialPath?: string) => {
    if (record) {
      setFormData({
        id: record.id,
        path: record.path,
        title: record.title,
        description: record.description,
        keywordsText: (record.keywords || []).join(', '),
        canonical: record.canonical || '',
        ogTitle: record.ogTitle || '',
        ogDescription: record.ogDescription || '',
        ogImage: record.ogImage || '',
        robots: record.robots || 'index, follow',
      });
    } else {
      setFormData({
        id: '',
        path: initialPath || '/',
        title: 'eLab — Web Development & Digital Solutions in Armenia | elab.am',
        description:
          'eLab is a premier digital agency in Yerevan, Armenia specializing in turnkey web development, e-commerce, custom web apps, and digital branding.',
        keywordsText: 'web development Armenia, website creation Yerevan, eLab digital agency, e-commerce Armenia',
        canonical: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: 'https://elab.am/og-image.png',
        robots: 'index, follow',
      });
    }
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          keywords: formData.keywordsText
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save SEO metadata');
      } else {
        setSuccessMsg(`SEO metadata saved for ${formData.path}`);
        setModalOpen(false);
        fetchRecords();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Error saving SEO metadata');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, path: string) => {
    if (!confirm(`Are you sure you want to delete custom SEO metadata for ${path}?`)) return;

    try {
      const res = await fetch(`/api/admin/seo/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg(`Deleted SEO metadata for ${path}`);
        fetchRecords();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to delete SEO metadata');
      }
    } catch {
      setErrorMsg('Error deleting SEO record');
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            SEO &amp; Open Graph Management<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage page-specific titles, meta descriptions, canonical URLs, OG social images, and robots settings.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#00dc93]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Page SEO</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-[#00dc93] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preset Quick Setup Bar */}
      <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00dc93]" />
          <span>Quick Route Selectors</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {PRESET_ROUTES.map((preset) => {
            const existing = records.find((r) => r.path === preset.path);
            return (
              <button
                key={preset.path}
                onClick={() => (existing ? openModal(existing) : openModal(undefined, preset.path))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  existing
                    ? 'bg-[#00dc93]/10 text-[#00dc93] border-[#00dc93]/30 hover:bg-[#00dc93]/20'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{preset.label} ({preset.path})</span>
                {existing && <CheckCircle2 className="w-3 h-3 text-[#00dc93]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & List */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search configured SEO metadata by path, title, or description..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141722] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
              Loading SEO metadata records from PostgreSQL...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
              No SEO metadata overrides found. Click &quot;Add Custom Page SEO&quot; or select a preset above.
            </div>
          ) : (
            filteredRecords.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#00dc93]/10 text-[#00dc93] border border-[#00dc93]/20 font-mono text-[11px] font-bold">
                      {item.path}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                      {item.robots}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  {item.keywords && item.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.keywords.map((k, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300">
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.canonical && (
                    <div className="text-[11px] text-slate-400 truncate">
                      <span className="text-slate-500">Canonical:</span> {item.canonical}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 font-mono">
                    Updated: {new Date(item.updatedAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.path)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SEO Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141722] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00dc93]" />
                <span>Configure Page SEO ({formData.path})</span>
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Page Route Path</label>
                <input
                  type="text"
                  required
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/work or /work/gayanes-kitchen"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">SEO Title Tag</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Portfolio &amp; Case Studies — eLab Yerevan"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Meta Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a concise 150-160 character search engine summary..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.keywordsText}
                    onChange={(e) => setFormData({ ...formData, keywordsText: e.target.value })}
                    placeholder="web design, Yerevan, eLab"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Canonical URL Override</label>
                  <input
                    type="text"
                    value={formData.canonical}
                    onChange={(e) => setFormData({ ...formData, canonical: e.target.value })}
                    placeholder="https://elab.am/work"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              {/* Open Graph & Robots */}
              <div className="pt-2 border-t border-white/10 space-y-4">
                <div className="font-bold text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#00dc93]" />
                  <span>Open Graph (Social Sharing) Card Overrides</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase">OG Title</label>
                    <input
                      type="text"
                      value={formData.ogTitle}
                      onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                      placeholder="Optional social card title"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase">OG Image Media URL</label>
                    <input
                      type="text"
                      value={formData.ogImage}
                      onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                      placeholder="https://elab.am/og-image.png"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">OG Description</label>
                  <textarea
                    rows={2}
                    value={formData.ogDescription}
                    onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                    placeholder="Optional social card description..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              {/* Robots Settings */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="font-bold text-slate-300 uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00dc93]" />
                  <span>Robots Search Engine Directives</span>
                </label>
                <select
                  value={formData.robots}
                  onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                >
                  <option value="index, follow">index, follow (Standard Public Indexing)</option>
                  <option value="noindex, nofollow">noindex, nofollow (Private / Hide from Search Engines)</option>
                  <option value="index, nofollow">index, nofollow (Index Page, Do Not Follow Links)</option>
                  <option value="noindex, follow">noindex, follow (Do Not Index Page, Follow Links)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save SEO Metadata'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

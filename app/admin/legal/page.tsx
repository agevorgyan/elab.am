'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DbLegalPage } from '@/lib/legal-db';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  X,
  Eye,
  EyeOff,
  History,
  Scale,
} from 'lucide-react';

export default function AdminLegalPage() {
  const [pages, setPages] = useState<DbLegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    slug: 'terms',
    title: '',
    lastUpdated: '',
    content: '',
    published: true,
    version: 1,
  });

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/legal');
      const data = await res.json();
      if (Array.isArray(data.pages)) {
        setPages(data.pages);
      }
    } catch {
      setErrorMsg('Failed to load legal pages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/legal')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data.pages)) {
          setPages(data.pages);
        }
      })
      .catch(() => {
        if (isMounted) setErrorMsg('Failed to load legal pages.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (page?: DbLegalPage) => {
    if (page) {
      setFormData({
        id: page.id,
        slug: page.slug,
        title: page.title,
        lastUpdated: page.lastUpdated,
        content: page.content,
        published: page.published,
        version: page.version,
      });
    } else {
      setFormData({
        id: '',
        slug: 'terms',
        title: 'Terms of Use',
        lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        content: '<div className="space-y-4">\n  <h2>1. General Information</h2>\n  <p>Legal content goes here...</p>\n</div>',
        published: true,
        version: 1,
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
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save legal page');
      } else {
        setSuccessMsg(`Legal page "${formData.title}" saved successfully!`);
        setModalOpen(false);
        fetchPages();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Error saving legal page');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Are you sure you want to delete legal page for /${slug}?`)) return;

    try {
      const res = await fetch(`/api/admin/legal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg(`Deleted legal page /${slug}`);
        fetchPages();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to delete legal page');
      }
    } catch {
      setErrorMsg('Error deleting legal page');
    }
  };

  const handleTogglePublish = async (page: DbLegalPage) => {
    try {
      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          published: !page.published,
        }),
      });

      if (res.ok) {
        fetchPages();
      }
    } catch {
      setErrorMsg('Failed to toggle publication status');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Legal &amp; Policy CMS<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage terms of use, privacy policy, cookie policy, version tracking, and publication status.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#00dc93]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Legal Page</span>
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

      {/* Legal Advice Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-3">
        <Scale className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Legal Professional Notice:</strong> Legal text and policies should be reviewed by a qualified legal professional. Changes are tracked with version control in PostgreSQL.
        </span>
      </div>

      {/* Legal Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
            Loading legal pages from PostgreSQL...
          </div>
        ) : pages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
            No legal pages found.
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#00dc93]/10 text-[#00dc93] border border-[#00dc93]/20 font-mono text-[11px] font-bold">
                    /{page.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      v{page.version}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      page.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-white">{page.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    Last updated: {page.lastUpdated}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleTogglePublish(page)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  {page.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{page.published ? 'Unpublish' : 'Publish'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(page)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(page.id, page.slug)}
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

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#141722] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00dc93]" />
                <span>{formData.id ? `Edit Legal Page (${formData.title})` : 'Create Legal Page'}</span>
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Document Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Terms of Use"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">URL Slug (e.g. terms, privacy, cookies)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="terms"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Last Updated Date Label</label>
                  <input
                    type="text"
                    required
                    value={formData.lastUpdated}
                    onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
                    placeholder="August 28, 2026"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Current Version Tracked</label>
                  <input
                    type="text"
                    disabled
                    value={`Version ${formData.version} (Auto-increments on edit)`}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10]/50 border border-white/5 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Legal HTML Content (Sanitized Server-Side)</label>
                <textarea
                  rows={14}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="<div className='space-y-6'>...</div>"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <span>Publish legal document to live website</span>
                </label>
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
                  <span>{saving ? 'Saving...' : 'Save Legal Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

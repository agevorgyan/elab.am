'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DbPortfolioProject } from '@/lib/portfolio-db';
import { Plus, Search, Edit3, Eye, Trash2, CheckCircle2, AlertCircle, Copy, Star, Save, X } from 'lucide-react';

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<DbPortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client: '',
    category: 'corporate',
    categoryLabel: 'Corporate Website',
    summary: '',
    overview: '',
    challenge: '',
    solution: '',
    year: String(new Date().getFullYear()),
    liveUrl: '',
    heroImage: '',
    seoTitle: '',
    seoDescription: '',
    featured: false,
    published: true,
    servicesText: '',
    resultsText: '',
    galleryText: '',
  });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/portfolio');
      const data = await res.json();
      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch {
      setErrorMsg('Failed to load portfolio projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      })
      .catch(() => {
        if (active) setErrorMsg('Failed to load portfolio projects');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      client: '',
      category: 'corporate',
      categoryLabel: 'Corporate Website',
      summary: '',
      overview: '',
      challenge: '',
      solution: '',
      year: String(new Date().getFullYear()),
      liveUrl: '',
      heroImage: '',
      seoTitle: '',
      seoDescription: '',
      featured: false,
      published: true,
      servicesText: 'Next.js\nReact\nTypeScript\nTailwind CSS',
      resultsText: '<0.6s Mobile Load Time\n+45% Conversion Rate',
      galleryText: '',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (p: DbPortfolioProject) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      client: p.client,
      category: p.category,
      categoryLabel: p.categoryLabel || p.category,
      summary: p.summary,
      overview: p.overview || '',
      challenge: p.challenge || '',
      solution: p.solution || '',
      year: p.year,
      liveUrl: p.liveUrl || '',
      heroImage: p.heroImage || '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      featured: p.featured,
      published: p.published,
      servicesText: p.services.join('\n'),
      resultsText: p.results.join('\n'),
      galleryText: p.gallery.map((g) => g.url).join('\n'),
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const services = formData.servicesText.split('\n').map((s) => s.trim()).filter((s) => s.length > 0);
    const results = formData.resultsText.split('\n').map((r) => r.trim()).filter((r) => r.length > 0);
    const gallery = formData.galleryText.split('\n').map((url) => ({ url: url.trim() })).filter((g) => g.url.length > 0);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      client: formData.client,
      category: formData.category,
      categoryLabel: formData.categoryLabel,
      summary: formData.summary,
      overview: formData.overview,
      challenge: formData.challenge,
      solution: formData.solution,
      year: formData.year,
      liveUrl: formData.liveUrl,
      heroImage: formData.heroImage,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      featured: formData.featured,
      published: formData.published,
      services,
      results,
      gallery,
    };

    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : '/api/admin/portfolio';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to save portfolio project.');
      } else {
        setSuccessMsg(editingId ? 'Project updated successfully!' : 'Project created successfully!');
        setModalOpen(false);
        fetchProjects();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Failed to connect to server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (id: string, title: string) => {
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Duplicated "${title}".`);
        fetchProjects();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to duplicate.');
      }
    } catch {
      setErrorMsg('Failed to duplicate.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Project deleted.');
        fetchProjects();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to delete.');
      }
    } catch {
      setErrorMsg('Failed to delete.');
    }
  };

  const toggleFeatured = async (p: DbPortfolioProject) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (res.ok) fetchProjects();
    } catch {}
  };

  const togglePublished = async (p: DbPortfolioProject) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !p.published }),
      });
      if (res.ok) fetchProjects();
    } catch {}
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portfolio CMS Manager<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            PostgreSQL-backed Portfolio CRUD: Add, edit, duplicate, feature, publish, and order case studies.
          </p>
        </div>

        {successMsg && (
          <div className="px-4 py-2 rounded-xl bg-[#00dc93]/20 text-[#00dc93] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4 font-black" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#141722] border border-white/10 flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter project title or client..."
          className="w-full bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-600"
        />
      </div>

      {/* Projects Table */}
      <div className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4">
        {loading ? (
          <div className="text-xs text-slate-400 p-8 text-center">Loading portfolio projects from PostgreSQL...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="pb-3 font-bold">Cover</th>
                  <th className="pb-3 font-bold">Project Name</th>
                  <th className="pb-3 font-bold">Client</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Featured</th>
                  <th className="pb-3 font-bold">Published</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/10">
                        <img src={p.heroImage || ''} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 font-extrabold text-white">{p.title}</td>
                    <td className="py-3 text-slate-300">{p.client}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 text-[#00dc93] font-bold border border-white/5">
                        {p.categoryLabel || p.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          p.featured ? 'bg-[#00dc93]/20 text-[#00dc93]' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        <span>{p.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => togglePublished(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.published ? 'bg-[#00dc93]/20 text-[#00dc93]' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/work/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-[#00dc93]"
                          title="Preview Public Case Study"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                          title="Edit Case Study"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-indigo-400"
                          title="Duplicate Project"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl bg-[#141722] border border-white/15 p-6 sm:p-8 space-y-6 text-xs text-slate-300 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">
                {editingId ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                      setFormData({ ...formData, title: newTitle, ...(!editingId && { slug: autoSlug }) });
                    }}
                    placeholder="e.g. Gayane&#39;s Kitchen"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">URL Slug (Unique)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. gayanes-kitchen"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Gayane&#39;s Kitchen LLC"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, categoryLabel: e.target.selectedOptions[0].text })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                  >
                    <option value="ecommerce">E-Commerce &amp; Retail</option>
                    <option value="corporate">Corporate Website</option>
                    <option value="landing-page">Landing Page</option>
                    <option value="business-card">Business Card Website</option>
                    <option value="custom">Custom Web Application</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Year</label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2026"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Live Website URL</label>
                  <input
                    type="text"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://gayaneskitchen.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Short Summary / Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Modern online ordering portal and e-commerce showcase..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Client Challenge</label>
                  <textarea
                    rows={3}
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    placeholder="Describe the initial technical or business challenge..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Delivered Solution</label>
                  <textarea
                    rows={3}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Describe the solution engineered by eLab..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Technologies / Services (One per line)</label>
                  <textarea
                    rows={3}
                    value={formData.servicesText}
                    onChange={(e) => setFormData({ ...formData, servicesText: e.target.value })}
                    placeholder="Next.js&#10;WooCommerce&#10;ArCa Gateway"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Results / Metrics (One per line)</label>
                  <textarea
                    rows={3}
                    value={formData.resultsText}
                    onChange={(e) => setFormData({ ...formData, resultsText: e.target.value })}
                    placeholder="<0.6s Mobile Load Time&#10;+45% Online Orders"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <label htmlFor="featured" className="font-bold text-white cursor-pointer">
                    Feature as Hero Project
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <label htmlFor="published" className="font-bold text-white cursor-pointer">
                    Publish case study to live website
                  </label>
                </div>
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
                  <span>{saving ? 'Saving...' : editingId ? 'Update Case Study' : 'Create Case Study'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

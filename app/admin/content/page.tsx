'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ServiceItem } from '@/lib/services';
import { TRANSLATIONS } from '@/lib/translations';
import { Plus, Edit3, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, Globe2, HelpCircle, Save, X, DollarSign, Tag, Star } from 'lucide-react';

export default function AdminContentPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    priceAmd: '',
    priceCurrency: 'AMD',
    showPrice: true,
    priceLabel: 'Starting from',
    popular: false,
    tagline: '',
    description: '',
    icon: 'Zap',
    ctaText: 'Order Service →',
    seoTitle: '',
    seoDescription: '',
    published: true,
    featuresText: '',
  });

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (Array.isArray(data.services)) {
        setServices(data.services);
      }
    } catch {
      setErrorMsg('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.services)) {
          setServices(data.services);
        }
      })
      .catch(() => {
        if (active) setErrorMsg('Failed to load services');
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
      priceAmd: '',
      priceCurrency: 'AMD',
      showPrice: true,
      priceLabel: 'Starting from',
      popular: false,
      tagline: '',
      description: '',
      icon: 'Zap',
      ctaText: 'Order Service →',
      seoTitle: '',
      seoDescription: '',
      published: true,
      featuresText: '',
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      slug: service.slug,
      priceAmd: service.priceAmd,
      priceCurrency: service.priceCurrency || 'AMD',
      showPrice: service.showPrice ?? true,
      priceLabel: service.priceLabel || 'Starting from',
      popular: service.popular ?? false,
      tagline: service.tagline || service.description,
      description: service.description,
      icon: service.icon || 'Zap',
      ctaText: service.ctaText || 'Order Service →',
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
      published: service.published,
      featuresText: service.features.map((f) => f.text).join('\n'),
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const featuresList = formData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      priceAmd: formData.priceAmd,
      priceCurrency: formData.priceCurrency,
      showPrice: formData.showPrice,
      priceLabel: formData.priceLabel,
      popular: formData.popular,
      tagline: formData.tagline,
      description: formData.description,
      icon: formData.icon,
      ctaText: formData.ctaText,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      published: formData.published,
      features: featuresList.map((text, idx) => ({ text, sortOrder: idx + 1 })),
    };

    try {
      const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to save service.');
      } else {
        setSuccessMsg(editingId ? 'Service updated successfully!' : 'Service created successfully!');
        setModalOpen(false);
        fetchServices();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Failed to connect to server.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Service deleted.');
        fetchServices();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to delete service.');
      }
    } catch {
      setErrorMsg('Failed to delete service.');
    }
  };

  const handleTogglePublish = async (service: ServiceItem) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !service.published }),
      });
      if (res.ok) {
        fetchServices();
      }
    } catch {}
  };

  const faq = TRANSLATIONS.en.faq.items;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Services &amp; Pricing CMS<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            PostgreSQL-backed CMS: Edit starting prices, change currencies, toggle display, set custom labels, and reorder.
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
      </div>

      {/* Services & Pricing Management Section */}
      <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Digital Service Packages &amp; Pricing ({services.length})</h2>
              <p className="text-xs text-slate-400">Database-backed prices, currencies, and display toggles</p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-[#00dc93]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400 p-8 text-center">Loading services from PostgreSQL...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, idx) => (
              <div key={item.id} className="p-6 rounded-2xl bg-[#0b0c10] border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-2xl font-black text-slate-600 font-mono">0{idx + 1}</span>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">{item.priceLabel || 'Starting from'}</span>
                      <span className="text-xs font-black text-[#00dc93] font-mono">
                        {item.showPrice ? `${item.priceAmd} ${item.priceCurrency || 'AMD'}` : 'Custom Quote'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>{item.title}</span>
                      {item.popular && <Star className="w-3.5 h-3.5 text-[#00dc93] fill-[#00dc93]" />}
                    </h3>
                    <button
                      onClick={() => handleTogglePublish(item)}
                      title={item.published ? 'Published (Click to unpublish)' : 'Draft (Click to publish)'}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        item.published ? 'bg-[#00dc93]/20 text-[#00dc93]' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {item.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#00dc93]" />
                    <span>Edit Pricing &amp; Package</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Entries */}
      <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">FAQ Accordion Entries</h2>
            <p className="text-xs text-slate-400">Questions and answers presented in the FAQ section</p>
          </div>
        </div>

        <div className="space-y-3">
          {faq.map((item) => (
            <div key={item.q} className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-bold text-white">{item.q}</div>
                <div className="text-slate-400 mt-0.5 line-clamp-1">{item.a}</div>
              </div>
              <button className="p-2 rounded-xl bg-white/5 text-slate-[#00dc93] hover:text-[#00dc93]">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-[#141722] border border-white/15 p-6 sm:p-8 space-y-6 text-xs text-slate-300 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white">
                {editingId ? 'Edit Service Package & Pricing' : 'Create New Service Package & Pricing'}
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
              
              {/* Package Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Service Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                      setFormData({ ...formData, title: newTitle, ...(!editingId && { slug: autoSlug }) });
                    }}
                    placeholder="e.g. Corporate Website"
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
                    placeholder="e.g. corporate-website"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              {/* Pricing Management Controls */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-white font-extrabold text-xs">
                  <DollarSign className="w-4 h-4 text-[#00dc93]" />
                  <span>Pricing &amp; Currency Controls</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase">Starting Price</label>
                    <input
                      type="text"
                      required
                      value={formData.priceAmd}
                      onChange={(e) => setFormData({ ...formData, priceAmd: e.target.value })}
                      placeholder="e.g. 250,000"
                      className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase">Currency</label>
                    <select
                      value={formData.priceCurrency}
                      onChange={(e) => setFormData({ ...formData, priceCurrency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                    >
                      <option value="AMD">AMD (֏)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="RUB">RUB (₽)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase">Price Label</label>
                    <input
                      type="text"
                      value={formData.priceLabel}
                      onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                      placeholder="e.g. Starting from"
                      className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showPrice"
                      checked={formData.showPrice}
                      onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                      className="w-4 h-4 accent-[#00dc93] rounded"
                    />
                    <label htmlFor="showPrice" className="font-bold text-white cursor-pointer">
                      Enable price display (Uncheck for &quot;Custom Quote&quot;)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="popular"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-4 h-4 accent-[#00dc93] rounded"
                    />
                    <label htmlFor="popular" className="font-bold text-white cursor-pointer">
                      Mark tier as Popular / Highlighted
                    </label>
                  </div>
                </div>
              </div>

              {/* Tagline & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Short summary tagline for pricing card..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Order Service →"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-bold focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Full Description</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this service package includes..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Included Features (One per line)</label>
                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Multi-language support&#10;Full CMS Admin Panel&#10;SEO-optimized architecture"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 accent-[#00dc93] rounded"
                />
                <label htmlFor="published" className="font-bold text-white cursor-pointer">
                  Publish service package to live website
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
                  <span>{saving ? 'Saving...' : editingId ? 'Update Pricing & Package' : 'Create Package'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

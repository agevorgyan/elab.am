'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ServiceItem } from '@/lib/services';
import { DbTestimonial } from '@/lib/testimonials-db';
import { DbFaq } from '@/lib/faq-db';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  X,
  Star,
  MessageSquareQuote,
  Layers,
  HelpCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'services' | 'testimonials' | 'faq'>('services');

  // Services State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  // FAQ State
  const [faqs, setFaqs] = useState<DbFaq[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqSaving, setFaqSaving] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Service Form State
  const [serviceForm, setServiceForm] = useState({
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

  // Testimonial Form State
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    company: '',
    position: '',
    content: '',
    photo: '',
    rating: 5,
    published: true,
  });

  // FAQ Form State
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'general',
    published: true,
  });

  // Fetch Services
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
      setServicesLoading(false);
    }
  }, []);

  // Fetch Testimonials
  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }
    } catch {
      setErrorMsg('Failed to load testimonials');
    } finally {
      setTestimonialsLoading(false);
    }
  }, []);

  // Fetch FAQs
  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/faq');
      const data = await res.json();
      if (Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
      }
    } catch {
      setErrorMsg('Failed to load FAQs');
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetch('/api/admin/services').then((res) => res.json()),
      fetch('/api/admin/testimonials').then((res) => res.json()),
      fetch('/api/admin/faq').then((res) => res.json()),
    ])
      .then(([servicesData, testimonialsData, faqsData]) => {
        if (isMounted) {
          if (Array.isArray(servicesData.services)) setServices(servicesData.services);
          if (Array.isArray(testimonialsData.testimonials)) setTestimonials(testimonialsData.testimonials);
          if (Array.isArray(faqsData.faqs)) setFaqs(faqsData.faqs);
        }
      })
      .catch(() => {
        if (isMounted) setErrorMsg('Failed to load content');
      })
      .finally(() => {
        if (isMounted) {
          setServicesLoading(false);
          setTestimonialsLoading(false);
          setFaqsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Service Handlers
  // ---------------------------------------------------------------------------
  const openCreateServiceModal = () => {
    setEditingServiceId(null);
    setServiceForm({
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
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceForm({
      title: service.title,
      slug: service.slug,
      priceAmd: service.priceAmd,
      priceCurrency: service.priceCurrency || 'AMD',
      showPrice: service.showPrice ?? true,
      priceLabel: service.priceLabel || 'Starting from',
      popular: service.popular ?? false,
      tagline: service.tagline || '',
      description: service.description,
      icon: service.icon || 'Zap',
      ctaText: service.ctaText || 'Order Service →',
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
      published: service.published ?? true,
      featuresText: (service.features || []).join('\n'),
    });
    setErrorMsg('');
    setServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceSaving(true);
    setErrorMsg('');

    const payload = {
      ...serviceForm,
      features: serviceForm.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };

    try {
      const url = editingServiceId ? `/api/admin/services/${editingServiceId}` : '/api/admin/services';
      const method = editingServiceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save service package');
      } else {
        setSuccessMsg(editingServiceId ? 'Service updated successfully!' : 'New service package created!');
        setServiceModalOpen(false);
        fetchServices();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Failed to save service');
    } finally {
      setServiceSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service package?')) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Service package deleted');
        fetchServices();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to delete service');
      }
    } catch {
      setErrorMsg('Error deleting service');
    }
  };

  const handleToggleServicePublish = async (service: ServiceItem) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !service.published }),
      });
      if (res.ok) {
        fetchServices();
      }
    } catch {
      setErrorMsg('Failed to toggle publish status');
    }
  };

  // ---------------------------------------------------------------------------
  // Testimonial Handlers
  // ---------------------------------------------------------------------------
  const openCreateTestimonialModal = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      name: '',
      company: '',
      position: '',
      content: '',
      photo: '',
      rating: 5,
      published: true,
    });
    setErrorMsg('');
    setTestimonialModalOpen(true);
  };

  const openEditTestimonialModal = (item: DbTestimonial) => {
    setEditingTestimonialId(item.id);
    setTestimonialForm({
      name: item.name,
      company: item.company || '',
      position: item.position || '',
      content: item.content,
      photo: item.photo || '',
      rating: item.rating,
      published: item.published,
    });
    setErrorMsg('');
    setTestimonialModalOpen(true);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonialSaving(true);
    setErrorMsg('');

    try {
      const url = editingTestimonialId
        ? `/api/admin/testimonials/${editingTestimonialId}`
        : '/api/admin/testimonials';
      const method = editingTestimonialId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save testimonial');
      } else {
        setSuccessMsg(editingTestimonialId ? 'Testimonial updated!' : 'Testimonial created!');
        setTestimonialModalOpen(false);
        fetchTestimonials();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Failed to save testimonial');
    } finally {
      setTestimonialSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Testimonial deleted');
        fetchTestimonials();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to delete testimonial');
      }
    } catch {
      setErrorMsg('Error deleting testimonial');
    }
  };

  const handleToggleTestimonialPublish = async (item: DbTestimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch {
      setErrorMsg('Failed to toggle publish status');
    }
  };

  const handleMoveTestimonial = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...testimonials];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setTestimonials(newItems);

    try {
      const orderedIds = newItems.map((item) => item.id);
      await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds }),
      });
    } catch {
      fetchTestimonials();
    }
  };

  // ---------------------------------------------------------------------------
  // FAQ Handlers
  // ---------------------------------------------------------------------------
  const openCreateFaqModal = () => {
    setEditingFaqId(null);
    setFaqForm({
      question: '',
      answer: '',
      category: 'general',
      published: true,
    });
    setErrorMsg('');
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (item: DbFaq) => {
    setEditingFaqId(item.id);
    setFaqForm({
      question: item.question,
      answer: item.answer,
      category: item.category || 'general',
      published: item.published,
    });
    setErrorMsg('');
    setFaqModalOpen(true);
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFaqSaving(true);
    setErrorMsg('');

    try {
      const url = editingFaqId ? `/api/admin/faq/${editingFaqId}` : '/api/admin/faq';
      const method = editingFaqId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save FAQ item');
      } else {
        setSuccessMsg(editingFaqId ? 'FAQ updated!' : 'FAQ created!');
        setFaqModalOpen(false);
        fetchFaqs();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setErrorMsg('Failed to save FAQ item');
    } finally {
      setFaqSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;

    try {
      const res = await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('FAQ item deleted');
        fetchFaqs();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to delete FAQ item');
      }
    } catch {
      setErrorMsg('Error deleting FAQ item');
    }
  };

  const handleToggleFaqPublish = async (item: DbFaq) => {
    try {
      const res = await fetch(`/api/admin/faq/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        fetchFaqs();
      }
    } catch {
      setErrorMsg('Failed to toggle publish status');
    }
  };

  const handleMoveFaq = async (index: number, direction: 'up' | 'down') => {
    const newItems = [...faqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setFaqs(newItems);

    try {
      const orderedIds = newItems.map((item) => item.id);
      await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds }),
      });
    } catch {
      fetchFaqs();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Content &amp; CMS Management<span className="text-[#00dc93]">.</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage services, pricing packages, testimonials, and FAQ knowledge base.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#141722] border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'services'
                ? 'bg-[#00dc93] text-black shadow-lg shadow-[#00dc93]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'testimonials'
                ? 'bg-[#00dc93] text-black shadow-lg shadow-[#00dc93]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Testimonials</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'faq'
                ? 'bg-[#00dc93] text-black shadow-lg shadow-[#00dc93]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ Knowledge Base</span>
          </button>
        </div>
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

      {/* ========================================================================= */}
      {/* TAB 1: SERVICES & PRICING                                                */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Services &amp; Pricing Packages</h2>
            <button
              onClick={openCreateServiceModal}
              className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#00dc93]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesLoading ? (
              <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
                Loading services from PostgreSQL...
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
                No service packages created yet.
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        service.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {service.published ? 'Published' : 'Draft'}
                      </span>

                      {service.popular && (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                          ★ Most Popular
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-white">{service.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{service.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-baseline gap-1">
                      <span className="text-xs text-slate-400">{service.priceLabel}</span>
                      <span className="text-xl font-black text-[#00dc93]">{service.priceAmd} {service.priceCurrency}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3">{service.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleServicePublish(service)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      {service.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{service.published ? 'Unpublish' : 'Publish'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditServiceModal(service)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
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
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CLIENT TESTIMONIALS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Client Testimonials &amp; Reviews</h2>
            <button
              onClick={openCreateTestimonialModal}
              className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#00dc93]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonialsLoading ? (
              <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
                Loading testimonials from PostgreSQL...
              </div>
            ) : testimonials.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 font-bold text-xs">
                No testimonials added yet. Click &quot;Add New Testimonial&quot; above to create one.
              </div>
            ) : (
              testimonials.map((item, index) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveTestimonial(index, 'up')}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === testimonials.length - 1}
                          onClick={() => handleMoveTestimonial(index, 'down')}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.published ? 'Published' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      &quot;{item.content}&quot;
                    </p>

                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      {item.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#00dc93]/20 text-[#00dc93] flex items-center justify-center font-black text-sm">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-white text-xs">{item.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.position ? `${item.position}, ` : ''}{item.company || 'Client'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleTestimonialPublish(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      {item.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{item.published ? 'Hide' : 'Publish'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditTestimonialModal(item)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(item.id)}
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
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FAQ KNOWLEDGE BASE                                                */}
      {/* ========================================================================= */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">FAQ Knowledge Base Items</h2>
            <button
              onClick={openCreateFaqModal}
              className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#00dc93]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqsLoading ? (
              <div className="py-12 text-center text-slate-500 font-bold text-xs">
                Loading FAQs from PostgreSQL...
              </div>
            ) : faqs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-bold text-xs">
                No FAQ items created yet. Click &quot;Add New FAQ Item&quot; above to create one.
              </div>
            ) : (
              faqs.map((item, index) => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-[#141722] border border-white/10 space-y-3 relative flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase">
                        {item.category || 'general'}
                      </span>
                      <h3 className="text-base font-extrabold text-white">{item.question}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveFaq(index, 'up')}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={index === faqs.length - 1}
                        onClick={() => handleMoveFaq(index, 'down')}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#0b0c10] p-4 rounded-xl border border-white/5">
                    {item.answer}
                  </p>

                  <div className="pt-3 flex items-center justify-between border-t border-white/10 text-xs">
                    <button
                      onClick={() => handleToggleFaqPublish(item)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold flex items-center gap-1.5"
                    >
                      {item.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{item.published ? 'Hide' : 'Publish'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditFaqModal(item)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(item.id)}
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
      )}

      {/* ========================================================================= */}
      {/* SERVICE MODAL                                                             */}
      {/* ========================================================================= */}
      {serviceModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141722] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                {editingServiceId ? 'Edit Service Package' : 'Create New Service Package'}
              </h2>
              <button onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Package Title</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="e.g. Corporate Website"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Price (AMD)</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.priceAmd}
                    onChange={(e) => setServiceForm({ ...serviceForm, priceAmd: e.target.value })}
                    placeholder="e.g. 400,000"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Tagline Summary</label>
                <input
                  type="text"
                  required
                  value={serviceForm.tagline}
                  onChange={(e) => setServiceForm({ ...serviceForm, tagline: e.target.value })}
                  placeholder="e.g. Turnkey corporate platform for growing Armenian enterprises"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Describe what this service package includes..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Included Features (One per line)</label>
                <textarea
                  rows={4}
                  value={serviceForm.featuresText}
                  onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  placeholder="Multi-language support&#10;Full CMS Admin Panel&#10;SEO-optimized architecture"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white font-mono focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.popular}
                    onChange={(e) => setServiceForm({ ...serviceForm, popular: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <span>Mark as Most Popular Package</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.published}
                    onChange={(e) => setServiceForm({ ...serviceForm, published: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <span>Publish to live website</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={serviceSaving}
                  className="px-6 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{serviceSaving ? 'Saving...' : editingServiceId ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TESTIMONIAL MODAL                                                        */}
      {/* ========================================================================= */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#141722] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                {editingTestimonialId ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
              </h2>
              <button onClick={() => setTestimonialModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Client / Author Name</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  placeholder="e.g. Armen Grigoryan"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Company Name</label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                    placeholder="e.g. TechCorp LLC"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Position / Job Title</label>
                  <input
                    type="text"
                    value={testimonialForm.position}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, position: e.target.value })}
                    placeholder="e.g. Founder & CEO"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Testimonial Text / Quote</label>
                <textarea
                  rows={4}
                  required
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  placeholder="Enter the client feedback or testimonial..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Photo / Avatar Media URL</label>
                  <input
                    type="text"
                    value={testimonialForm.photo}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, photo: e.target.value })}
                    placeholder="/uploads/avatar.png"
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase">Rating (1 to 5 Stars)</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                    <option value={2}>2 Stars (★★☆☆☆)</option>
                    <option value={1}>1 Star (★☆☆☆☆)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testimonialForm.published}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, published: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <span>Publish testimonial to live website</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testimonialSaving}
                  className="px-6 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{testimonialSaving ? 'Saving...' : editingTestimonialId ? 'Update Testimonial' : 'Create Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FAQ MODAL                                                                */}
      {/* ========================================================================= */}
      {faqModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#141722] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                {editingFaqId ? 'Edit FAQ Item' : 'Add FAQ Item'}
              </h2>
              <button onClick={() => setFaqModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFaqSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="e.g. How long does a website project take?"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Answer</label>
                <textarea
                  rows={5}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Provide a detailed, clear response..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 uppercase">Category</label>
                <input
                  type="text"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  placeholder="e.g. general, pricing, timeline, technical"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white focus:outline-none focus:border-[#00dc93]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqForm.published}
                    onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] rounded"
                  />
                  <span>Publish FAQ to live website</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={faqSaving}
                  className="px-6 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{faqSaving ? 'Saving...' : editingFaqId ? 'Update FAQ' : 'Create FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

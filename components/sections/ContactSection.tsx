'use client';

import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Send, Phone, Mail, Clock, CheckCircle2, AlertCircle, Loader2, MessageSquare, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].contact;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    projectType: 'corporate-website',
    budget: t.budgetOptions[1],
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const projectTypeOptions = [
    { id: 'landing-page', label: 'Landing Page (Լենդինգ Էջ)' },
    { id: 'corporate-website', label: 'Corporate Website (Կորպորատիվ Կայք)' },
    { id: 'online-store', label: 'Online Store (Օնլայն Խանութ)' },
    { id: 'business-card', label: 'Business Card Website (Այցեքարտ Կայք)' },
    { id: 'news-website', label: 'News Website (Լրատվական Կայք)' },
    { id: 'custom-dev', label: 'Custom Web Application' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in required fields (Name & Phone number).');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-[#00dc93]': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.message || t.form.errorMsg);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(t.form.errorMsg);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#090a0f] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00dc93]/10 border border-[#00dc93]/30 text-xs font-semibold text-[#00dc93]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-base text-slate-400">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#141722] border border-white/10 space-y-6">
              <h3 className="text-xl font-extrabold text-white">{t.directContact.title}</h3>
              
              <div className="space-y-4">
                <a
                  href="tel:+37455776066"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00dc93]/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center group-hover:bg-[#00dc93] group-hover:text-black transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Direct Phone</div>
                    <div className="text-base font-bold text-white group-hover:text-[#00dc93] transition-colors">
                      {t.directContact.phone}
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Working Hours</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {t.directContact.hours}
                    </div>
                  </div>
                </div>

                <a
                  href="mailto:info@elab.am"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00dc93]/40 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:bg-teal-400 group-hover:text-black transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Email Address</div>
                    <div className="text-base font-bold text-white group-hover:text-[#00dc93] transition-colors">
                      {t.directContact.email}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#00dc93]/5 border border-[#00dc93]/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00dc93]">
                <CheckCircle2 className="w-4 h-4" />
                <span>eLab Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We respond to all project inquiries within 15 minutes during business hours with a preliminary estimate and timeline recommendation.
              </p>
            </div>
          </div>

          {/* Right Column: Progressive 4-Step Lead Funnel (Rule #21) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl space-y-8">
              
              {/* Step Progress Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#00dc93] tracking-widest uppercase">
                    Step {currentStep} of 4
                  </span>
                  <span className="text-slate-400">
                    {currentStep === 1 && 'Select Project Type'}
                    {currentStep === 2 && 'Estimated Budget'}
                    {currentStep === 3 && 'Project Details'}
                    {currentStep === 4 && 'Contact & Submit'}
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00dc93] to-[#38ef7d] transition-all duration-500"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {status === 'success' ? (
                <div className="p-8 rounded-2xl bg-[#00dc93]/10 border border-[#00dc93]/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#00dc93] text-black flex items-center justify-center mx-auto shadow-lg shadow-[#00dc93]/30">
                    <Check className="w-8 h-8 font-black" />
                  </div>
                  <h3 className="text-2xl font-black text-white">{t.form.successTitle}</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">{t.form.successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* STEP 1: What do you need? */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-base font-extrabold text-white">
                        What type of digital solution do you need?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {projectTypeOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => setFormData((prev) => ({ ...prev, projectType: opt.id }))}
                            className={`p-4 rounded-xl text-xs font-bold text-left transition-all border ${
                              formData.projectType === opt.id
                                ? 'bg-[#00dc93]/10 border-[#00dc93] text-[#00dc93] shadow-md'
                                : 'bg-[#0b0c10] border-white/10 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Budget Selection */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-base font-extrabold text-white">
                        What is your estimated project budget?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {t.budgetOptions.map((b) => (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setFormData((prev) => ({ ...prev, budget: b }))}
                            className={`p-4 rounded-xl text-xs font-bold text-left transition-all border ${
                              formData.budget === b
                                ? 'bg-[#00dc93]/10 border-[#00dc93] text-[#00dc93] shadow-md'
                                : 'bg-[#0b0c10] border-white/10 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Project Description */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-base font-extrabold text-white">
                        Tell us about your project goals & requirements
                      </h3>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t.form.messagePlaceholder}
                        className="w-full p-4 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93] transition-colors placeholder:text-slate-600 resize-none"
                      />
                    </div>
                  )}

                  {/* STEP 4: Contact Details & Submit */}
                  {currentStep === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h3 className="text-base font-extrabold text-white">
                        Your contact details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 uppercase">
                            {t.form.name} <span className="text-[#00dc93]">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={t.form.namePlaceholder}
                            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 uppercase">
                            {t.form.phone} <span className="text-[#00dc93]">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={t.form.phonePlaceholder}
                            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 uppercase">
                            {t.form.company}
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder={t.form.companyPlaceholder}
                            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300 uppercase">
                            {t.form.email}
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={t.form.emailPlaceholder}
                            className="w-full px-4 py-3 rounded-xl bg-[#0b0c10] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00dc93]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Feedback */}
                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-xs">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-3 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00dc93] to-[#38ef7d] text-black font-black text-xs shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t.form.submitting}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.form.submit}</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

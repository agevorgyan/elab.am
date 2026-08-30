'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Phone, Mail, ChevronDown } from 'lucide-react';

interface HeaderProps {
  lang?: Language;
  onLanguageChange?: (newLang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang = 'hy',
  onLanguageChange,
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(lang);
  const t = TRANSLATIONS[currentLang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  const handleLangSelect = (l: Language) => {
    setCurrentLang(l);
    if (onLanguageChange) {
      onLanguageChange(l);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const serviceSubmenu = [
    { href: '/#services', label: 'Landing Pages (Լենդինգ Էջ)' },
    { href: '/#services', label: 'Corporate Websites (Կորպորատիվ Կայք)' },
    { href: '/#services', label: 'Online Stores (Օնլայն Խանութ)' },
    { href: '/#services', label: 'Restaurant QR Menus (Ռեստորանային QR)' },
    { href: '/#services', label: 'Business Card Websites (Այցեքարտ)' },
    { href: '/#services', label: 'Custom Development' },
  ];

  const workSubmenu = [
    { href: '/work', label: 'All Case Studies (Բոլոր Աշխատանքները)' },
    { href: '/work?category=ecommerce', label: 'E-Commerce Projects' },
    { href: '/work?category=corporate', label: 'Corporate Websites' },
    { href: '/work?category=landing-page', label: 'Landing Pages' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 1. Official eLab SVG Brand Logo (Rules #1, #2) */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="h-9 w-auto flex items-center justify-center">
              <img
                src="https://elab.am/wp-content/uploads/2024/02/Artboard-2.svg"
                alt="eLab Digital Studio Logo"
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Right Header Controls: Language + Phone + Burger Button */}
          <div className="flex items-center gap-3 sm:gap-4 z-50">
            
            {/* Multilingual Selector */}
            <div className="flex items-center bg-[#141722] border border-white/10 rounded-full p-1 text-xs">
              {(['hy', 'en', 'ru'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLangSelect(l)}
                  className={`px-2.5 py-1 rounded-full font-bold uppercase transition-all ${
                    currentLang === l
                      ? 'bg-[#00dc93] text-black shadow-md shadow-[#00dc93]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Direct Phone Link */}
            <a
              href="tel:+37455776066"
              className="hidden sm:flex items-center gap-2 text-xs text-slate-300 hover:text-[#00dc93] font-medium transition-colors border border-white/10 px-3 py-2 rounded-full bg-white/5"
            >
              <Phone className="w-3.5 h-3.5 text-[#00dc93]" />
              <span>+374 55 77 60 66</span>
            </a>

            {/* Burger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuOpen}
              aria-controls="burger-menu-overlay"
              className="p-3 rounded-2xl bg-[#141722] border border-white/15 text-white hover:text-[#00dc93] hover:border-[#00dc93]/50 transition-all shadow-xl group flex items-center justify-center"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-2 bg-[#00dc93]' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    menuOpen ? 'opacity-0 scale-0' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-2.5 bg-[#00dc93]' : ''
                  }`}
                />
              </div>
            </button>

          </div>

        </div>
      </div>

      {/* Full-Screen Overlay Menu */}
      {menuOpen && (
        <div
          id="burger-menu-overlay"
          className="fixed inset-0 z-40 bg-[#090a0f]/95 backdrop-blur-2xl overflow-y-auto pt-32 pb-12 px-6 sm:px-12 animate-fadeIn flex flex-col justify-between"
        >
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <nav className="lg:col-span-7 space-y-6">
              <div>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors inline-block tracking-tight"
                >
                  Home
                </Link>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors flex items-center gap-4 tracking-tight"
                >
                  <span>Services</span>
                  <ChevronDown className={`w-8 h-8 text-[#00dc93] transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {servicesOpen && (
                  <div className="pl-4 sm:pl-8 space-y-2 pt-2 border-l-2 border-[#00dc93]/30 animate-fadeIn">
                    {serviceSubmenu.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        className="block text-sm sm:text-base font-bold text-slate-300 hover:text-[#00dc93] transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setWorkOpen(!workOpen)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors flex items-center gap-4 tracking-tight"
                >
                  <span>Work & Cases</span>
                  <ChevronDown className={`w-8 h-8 text-[#00dc93] transition-transform duration-300 ${workOpen ? 'rotate-180' : ''}`} />
                </button>

                {workOpen && (
                  <div className="pl-4 sm:pl-8 space-y-2 pt-2 border-l-2 border-[#00dc93]/30 animate-fadeIn">
                    {workSubmenu.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMenuOpen(false)}
                        className="block text-sm sm:text-base font-bold text-slate-300 hover:text-[#00dc93] transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <a
                  href="/#why-us"
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors inline-block tracking-tight"
                >
                  Why eLab
                </a>
              </div>

              <div>
                <a
                  href="/#process"
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors inline-block tracking-tight"
                >
                  Process
                </a>
              </div>

              <div>
                <a
                  href="/#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors inline-block tracking-tight"
                >
                  Pricing
                </a>
              </div>

              <div>
                <a
                  href="/#faq"
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors inline-block tracking-tight"
                >
                  FAQ
                </a>
              </div>

              <div>
                <a
                  href="/#contact"
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white hover:text-[#00dc93] transition-colors inline-block tracking-tight"
                >
                  Contact
                </a>
              </div>
            </nav>

            <div className="lg:col-span-5 space-y-8 p-8 rounded-3xl bg-[#141722] border border-white/10 shadow-2xl">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#00dc93] uppercase tracking-widest block">
                  Let's Build Something Better
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Have a project in mind? Let's engineer your digital solution.
                </h3>
              </div>

              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="w-full py-4 rounded-2xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
              >
                <span>Start a Project →</span>
              </a>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <a href="tel:+37455776066" className="flex items-center gap-3 text-white hover:text-[#00dc93] transition-colors font-bold text-sm">
                  <Phone className="w-4 h-4 text-[#00dc93]" />
                  <span>+374 55 77 60 66</span>
                </a>

                <a href="mailto:hello@elab.am" className="flex items-center gap-3 text-slate-300 hover:text-[#00dc93] transition-colors font-medium">
                  <Mail className="w-4 h-4 text-[#00dc93]" />
                  <span>hello@elab.am</span>
                </a>

                <div className="text-slate-500 pt-1">
                  Yerevan, Armenia
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Social Channels
                </span>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                  <a href="https://www.facebook.com/elab.am" target="_blank" rel="noopener noreferrer" className="hover:text-[#00dc93] transition-colors">
                    Facebook
                  </a>
                  <a href="https://www.instagram.com/elab.armenia/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00dc93] transition-colors">
                    Instagram
                  </a>
                  <a href="https://www.linkedin.com/company/elab-armenia/" target="_blank" rel="noopener noreferrer" className="hover:text-[#00dc93] transition-colors">
                    LinkedIn
                  </a>
                  <a href="https://www.youtube.com/@eLab-armenia" target="_blank" rel="noopener noreferrer" className="hover:text-[#00dc93] transition-colors">
                    YouTube
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: '/#services', label: t.services },
    { href: '/#portfolio', label: t.portfolio },
    { href: '/#why-us', label: t.whyUs },
    { href: '/#process', label: t.process },
    { href: '/#pricing', label: t.pricing },
    { href: '/#tech', label: t.tech },
    { href: '/#faq', label: t.faq },
    { href: '/#contact', label: t.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00dc93] to-[#3b82f6] p-[2px] shadow-lg shadow-[#00dc93]/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0b0c10] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-xl text-white tracking-tighter">e</span>
                <span className="font-bold text-xl text-[#00dc93]">L</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1">
                eLab<span className="text-[#00dc93]">.am</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase -mt-1">
                Digital Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#141722]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-[#00dc93] transition-colors rounded-full hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
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

            {/* Direct Phone Call */}
            <a
              href="tel:+37455776066"
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-[#00dc93] font-medium transition-colors border border-white/10 px-3 py-2 rounded-full bg-white/5"
            >
              <Phone className="w-3.5 h-3.5 text-[#00dc93]" />
              <span>+374 55 776066</span>
            </a>

            {/* Primary CTA */}
            <a
              href="/#contact"
              className="relative group overflow-hidden rounded-full p-[1px] font-semibold text-xs transition-all duration-300 hover:shadow-lg hover:shadow-[#00dc93]/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00dc93] via-[#38ef7d] to-[#3b82f6] rounded-full transition-transform group-hover:scale-105" />
              <span className="relative flex items-center gap-2 bg-[#0b0c10] text-white px-5 py-2.5 rounded-full transition-colors group-hover:bg-transparent group-hover:text-black font-bold">
                <span>{t.cta}</span>
                <ChevronRight className="w-4 h-4 text-[#00dc93] group-hover:text-black transition-colors" />
              </span>
            </a>
          </div>

          {/* Mobile Drawer Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex items-center bg-[#141722] border border-white/10 rounded-full p-0.5 text-[11px]">
              {(['hy', 'en', 'ru'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLangSelect(l)}
                  className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentLang === l ? 'bg-[#00dc93] text-black' : 'text-slate-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="p-2.5 rounded-xl bg-[#141722] border border-white/10 text-white hover:text-[#00dc93] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[70px] bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-[#00dc93] py-2 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
            
            <div className="pt-4 flex flex-col gap-3">
              <a
                href="tel:+37455776066"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm"
              >
                <Phone className="w-4 h-4 text-[#00dc93]" />
                <span>+374 55 77 60 66</span>
              </a>

              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-[#00dc93] to-[#38ef7d] text-black font-bold text-sm shadow-lg shadow-[#00dc93]/20"
              >
                {t.cta}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

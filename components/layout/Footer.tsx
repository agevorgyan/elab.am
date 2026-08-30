'use client';

import React from 'react';
import Link from 'next/link';
import { Language, TRANSLATIONS } from '@/lib/translations';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Phone, Mail, ArrowUp, ShieldCheck } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reopenCookiePreferences = () => {
    try {
      localStorage.removeItem('elab_cookie_consent_v1');
      window.location.reload();
    } catch {}
  };

  return (
    <footer className="bg-[#08090c] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Centralized Managed eLab Brand Logo in Footer */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo href="/" className="h-14 sm:h-16 w-auto" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.desc}
            </p>

            {/* Social Links SVGs */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/elab.am"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="eLab Facebook Page"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:text-[#00dc93] hover:border-[#00dc93]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/elab.armenia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="eLab Instagram Profile"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:text-[#00dc93] hover:border-[#00dc93]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/elab-armenia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="eLab LinkedIn Company Page"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:text-[#00dc93] hover:border-[#00dc93]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@eLab-armenia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="eLab YouTube Channel"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-300 hover:text-[#00dc93] hover:border-[#00dc93]/40 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186c-.275-1.026-1.082-1.833-2.108-2.108-1.858-.5-9.39-.5-9.39-.5s-7.532 0-9.39.5c-1.026.275-1.833 1.082-2.108 2.108-.5 1.858-.5 5.73-.5 5.73s0 3.872.5 5.73c.275 1.026 1.082 1.833 2.108 2.108 1.858.5 9.39.5 9.39.5s7.532 0 9.39-.5c1.026-.275 1.833-1.082 2.108-2.108.5-1.858.5-5.73.5-5.73s0-3.872-.5-5.73zm-13.498 9.42v-7.212l6.241 3.606-6.241 3.606z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li><Link href="/#services" className="hover:text-[#00dc93] transition-colors">Services</Link></li>
              <li><Link href="/work" className="hover:text-[#00dc93] transition-colors">Portfolio Work</Link></li>
              <li><Link href="/#why-us" className="hover:text-[#00dc93] transition-colors">Why eLab</Link></li>
              <li><Link href="/#process" className="hover:text-[#00dc93] transition-colors">Process</Link></li>
              <li><Link href="/#pricing" className="hover:text-[#00dc93] transition-colors">Pricing Tiers</Link></li>
            </ul>
          </div>

          {/* Legal Documents Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">Legal &amp; Privacy</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-[#00dc93] transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-[#00dc93] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-[#00dc93] transition-colors">Cookie Policy</Link></li>
              <li>
                <button
                  onClick={reopenCookiePreferences}
                  className="hover:text-[#00dc93] text-slate-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00dc93]" />
                  <span>Cookie Settings</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-xs tracking-wider">{t.contacts}</h4>
            <div className="space-y-2 text-xs">
              <a href="tel:+37455776066" className="flex items-center gap-2 text-white hover:text-[#00dc93] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#00dc93]" />
                <span>+374 55 77 60 66</span>
              </a>
              <a href="mailto:hello@elab.am" className="flex items-center gap-2 text-slate-300 hover:text-[#00dc93] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#00dc93]" />
                <span>hello@elab.am</span>
              </a>
              <div className="text-slate-500 pt-1">
                Yerevan, Armenia
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} eLab.am. {t.rights}</p>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">{t.terms}</Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">{t.privacy}</Link>
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#00dc93] hover:text-black text-slate-300 transition-all"
              aria-label="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

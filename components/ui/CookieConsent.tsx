'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, Check, X, Settings } from 'lucide-react';

export interface CookieConsentState {
  version: number;
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_KEY = 'elab_cookie_consent_v1';
const CURRENT_VERSION = 1;

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<{
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
  }>({
    preferences: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed: CookieConsentState = JSON.parse(stored);
        if (parsed.version !== CURRENT_VERSION) {
          setShowBanner(true);
        }
      } else {
        setShowBanner(true);
      }
    } catch (e) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (state: CookieConsentState) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    } catch (e) {}
    setShowBanner(false);
    setShowPreferences(false);

    // Dynamic analytics initialization based on consent
    if (state.analytics && typeof window !== 'undefined') {
      console.log('[eLab Cookie Consent]: Analytics enabled.');
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      version: CURRENT_VERSION,
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectOptional = () => {
    saveConsent({
      version: CURRENT_VERSION,
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSavePreferences = () => {
    saveConsent({
      version: CURRENT_VERSION,
      necessary: true,
      preferences: preferences.preferences,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <>
      {/* 1. COOKIE CONSENT BANNER (Rule #9 & #10) */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 animate-fadeIn">
          <div className="p-6 rounded-3xl bg-[#141722]/95 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-white">We Value Your Privacy & Choice</h3>
            </div>

            <p className="leading-relaxed">
              We use essential cookies to operate our digital platform, and optional analytics to help us improve site performance and user experience in Armenia and globally.
            </p>

            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
              <Link href="/privacy" className="hover:text-[#00dc93] transition-colors underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-[#00dc93] transition-colors underline">
                Cookie Policy
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs shadow-md transition-all"
              >
                Accept All
              </button>

              <button
                onClick={handleRejectOptional}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors"
              >
                Reject Optional
              </button>

              <button
                onClick={() => setShowPreferences(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COOKIE PREFERENCES MODAL (Rule #11) */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#141722] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-300">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00dc93]" />
                <h3 className="text-lg font-black text-white">Cookie Preferences Center</h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary Category */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Strictly Necessary Cookies</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00dc93]/20 text-[#00dc93] text-[10px] font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Required for basic website navigation, form submissions, and security features.
                </p>
              </div>

              {/* Preferences Category */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Functional Preferences</span>
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Remembers language choices (Armenian, English, Russian) and display settings.
                </p>
              </div>

              {/* Analytics Category */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Performance & Analytics</span>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Helps eLab measure site traffic, page load speed, and user interactions.
                </p>
              </div>

              {/* Marketing Category */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Marketing & Remarketing</span>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4 accent-[#00dc93] cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Used for measuring advertising campaign performance on social platforms.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={handleSavePreferences}
                className="w-full py-3 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs shadow-lg transition-all"
              >
                Save Cookie Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

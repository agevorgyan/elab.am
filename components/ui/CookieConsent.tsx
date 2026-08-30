'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X, Settings, Check } from 'lucide-react';

export interface CookieConsentState {
  version: number;
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const CONSENT_KEY = 'elab_cookie_consent_v1';
const COOKIE_NAME = 'elab_cookie_consent';
const CURRENT_VERSION = 1;

/**
 * Utility to check if a specific cookie category has consent
 */
export function hasCookieConsent(category: 'necessary' | 'preferences' | 'analytics' | 'marketing'): boolean {
  if (category === 'necessary') return true;
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    const parsed: CookieConsentState = JSON.parse(stored);
    if (parsed.version !== CURRENT_VERSION) return false;
    return !!parsed[category];
  } catch {
    return false;
  }
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const parsed: CookieConsentState = JSON.parse(stored);
        if (parsed.version === CURRENT_VERSION) {
          return false;
        }
      }
      return true;
    } catch {
      return true;
    }
  });

  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<{
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
          const parsed: CookieConsentState = JSON.parse(stored);
          return {
            preferences: !!parsed.preferences,
            analytics: !!parsed.analytics,
            marketing: !!parsed.marketing,
          };
        }
      } catch {}
    }
    return {
      preferences: true,
      analytics: false,
      marketing: false,
    };
  });

  const modalRef = useRef<HTMLDivElement>(null);

  // Subscribe to external trigger from Footer "Cookie Settings"
  useEffect(() => {
    const handleOpenSettings = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
          const parsed: CookieConsentState = JSON.parse(stored);
          setPreferences({
            preferences: !!parsed.preferences,
            analytics: !!parsed.analytics,
            marketing: !!parsed.marketing,
          });
        }
      } catch {}
      setShowPreferencesModal(true);
    };

    window.addEventListener('elab:open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('elab:open-cookie-settings', handleOpenSettings);
    };
  }, []);

  // Keyboard accessibility: ESC key closes modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPreferencesModal) {
        setShowPreferencesModal(false);
      }
    },
    [showPreferencesModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Save consent helper
  const saveConsent = (state: CookieConsentState) => {
    try {
      // 1. Store in localStorage
      localStorage.setItem(CONSENT_KEY, JSON.stringify(state));

      // 2. Store in Document Cookie for SSR / Server Headers
      const cookieValue = encodeURIComponent(JSON.stringify(state));
      document.cookie = `${COOKIE_NAME}=${cookieValue}; max-age=31536000; path=/; SameSite=Lax`;

      // 3. Dispatch Custom Event for Tracking Scripts
      window.dispatchEvent(
        new CustomEvent('elab:cookie-consent-changed', {
          detail: state,
        })
      );
    } catch {}

    setShowBanner(false);
    setShowPreferencesModal(false);
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
      {/* --------------------------------------------------------------------- */}
      {/* 1. COOKIE CONSENT BANNER                                              */}
      {/* --------------------------------------------------------------------- */}
      {showBanner && !showPreferencesModal && (
        <div
          role="region"
          aria-label="Cookie Consent Banner"
          className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 animate-fadeIn"
        >
          <div className="p-6 rounded-3xl bg-[#141722]/95 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00dc93]/10 text-[#00dc93] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-white">We Value Your Privacy &amp; Choice</h3>
            </div>

            <p className="leading-relaxed">
              We use strictly necessary cookies to operate our website, and optional cookies (Preferences, Analytics, Marketing) to measure performance and enhance your experience. Optional cookies load only after consent.
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
                className="px-4 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept All</span>
              </button>

              <button
                onClick={handleRejectOptional}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-colors"
              >
                Reject Optional
              </button>

              <button
                onClick={() => setShowPreferencesModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. COOKIE PREFERENCES ACCESSIBLE MODAL                                */}
      {/* --------------------------------------------------------------------- */}
      {showPreferencesModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-lg rounded-3xl bg-[#141722] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 max-h-[90vh] overflow-y-auto"
          >
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00dc93]" />
                <h3 id="cookie-modal-title" className="text-lg font-black text-white">
                  Cookie Preferences Center
                </h3>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                aria-label="Close Cookie Preferences"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category 1: Necessary */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">1. Strictly Necessary</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00dc93]/20 text-[#00dc93] text-[10px] font-bold">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Required for essential website navigation, contact form security, anti-spam protection, and basic layout operations.
                </p>
              </div>

              {/* Category 2: Preferences */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">2. Functional Preferences</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                      className="w-4 h-4 accent-[#00dc93] rounded"
                    />
                    <span className="text-[11px] font-bold text-white">
                      {preferences.preferences ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Remembers your language preferences (Armenian, English, Russian) and UI theme customizations.
                </p>
              </div>

              {/* Category 3: Analytics */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">3. Performance &amp; Analytics</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-4 h-4 accent-[#00dc93] rounded"
                    />
                    <span className="text-[11px] font-bold text-white">
                      {preferences.analytics ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Measures page load speeds, aggregated visitor counts, and navigation performance to help eLab improve features.
                </p>
              </div>

              {/* Category 4: Marketing */}
              <div className="p-4 rounded-2xl bg-[#0b0c10] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">4. Marketing &amp; Remarketing</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-4 h-4 accent-[#00dc93] rounded"
                    />
                    <span className="text-[11px] font-bold text-white">
                      {preferences.marketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Used for measuring advertising campaign performance and referral attribution across digital channels.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-colors"
              >
                Reject Optional
              </button>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 rounded-xl bg-[#00dc93] hover:bg-[#38ef7d] text-black font-extrabold text-xs shadow-lg transition-all"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

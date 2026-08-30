'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { hasCookieConsent, CookieConsentState } from '@/components/ui/CookieConsent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

interface GoogleAnalyticsProps {
  gaId?: string;
}

export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ gaId }) => {
  const pathname = usePathname();
  const scriptInjectedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!gaId || !gaId.trim()) return;
    const cleanId = gaId.trim();

    const applyConsentAndInitialize = (consentGranted: boolean) => {
      if (consentGranted) {
        // Enable Google Analytics
        window[`ga-disable-${cleanId}`] = false;

        // Inject script tag if not already injected
        if (!scriptInjectedRef.current && !document.getElementById('ga-gtag-script')) {
          const script = document.createElement('script');
          script.id = 'ga-gtag-script';
          script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
          script.async = true;
          document.head.appendChild(script);

          window.dataLayer = window.dataLayer || [];
          window.gtag = function gtag(...args: unknown[]) {
            if (window.dataLayer) {
              window.dataLayer.push(args);
            }
          };
          window.gtag('js', new Date());
          window.gtag('config', cleanId, {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });

          scriptInjectedRef.current = true;

          if (process.env.NODE_ENV !== 'production') {
            console.log(`[eLab Analytics]: Injected & initialized Google Analytics (${cleanId}) with user consent.`);
          }
        } else if (window.gtag) {
          window.gtag('config', cleanId, {
            page_path: window.location.pathname,
          });
        }
      } else {
        // Disable Google Analytics when consent is revoked / missing
        window[`ga-disable-${cleanId}`] = true;

        if (process.env.NODE_ENV !== 'production') {
          console.log(`[eLab Analytics]: Google Analytics (${cleanId}) disabled (Consent revoked or not granted).`);
        }
      }
    };

    // Check initial consent status
    const initialConsent = hasCookieConsent('analytics');
    applyConsentAndInitialize(initialConsent);

    // Listen for cookie consent changes
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsentState>;
      const isGranted = !!customEvent.detail?.analytics;
      applyConsentAndInitialize(isGranted);
    };

    window.addEventListener('elab:cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('elab:cookie-consent-changed', handleConsentChange);
    };
  }, [gaId]);

  // Track pageviews on Next.js route navigation
  useEffect(() => {
    if (!gaId || !gaId.trim()) return;
    const cleanId = gaId.trim();

    if (hasCookieConsent('analytics') && window.gtag && scriptInjectedRef.current) {
      window.gtag('config', cleanId, {
        page_path: pathname,
      });

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[eLab Analytics]: Tracked pageview for ${pathname}`);
      }
    }
  }, [pathname, gaId]);

  return null;
};

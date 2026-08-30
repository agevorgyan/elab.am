'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { hasCookieConsent, CookieConsentState } from '@/components/ui/CookieConsent';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

interface MetaPixelProps {
  pixelId?: string;
}

export const MetaPixel: React.FC<MetaPixelProps> = ({ pixelId }) => {
  const pathname = usePathname();
  const scriptInjectedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!pixelId || !pixelId.trim()) return;
    const cleanId = pixelId.trim();

    const applyConsentAndInitialize = (consentGranted: boolean) => {
      if (consentGranted) {
        // Inject script tag if not already injected
        if (!scriptInjectedRef.current && !document.getElementById('meta-pixel-script')) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const f = window as any;
          if (!f.fbq) {
            const n: any = (f.fbq = function (...args: any[]) {
              if (n.callMethod) {
                n.callMethod(...args);
              } else {
                n.queue.push(args);
              }
            });
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
          }
          /* eslint-enable @typescript-eslint/no-explicit-any */

          const script = document.createElement('script');
          script.id = 'meta-pixel-script';
          script.src = 'https://connect.facebook.net/en_US/fbevents.js';
          script.async = true;
          document.head.appendChild(script);

          if (window.fbq) {
            window.fbq('consent', 'grant');
            window.fbq('init', cleanId);
            window.fbq('track', 'PageView');
          }

          scriptInjectedRef.current = true;

          if (process.env.NODE_ENV !== 'production') {
            console.log(`[eLab Meta Pixel]: Injected & initialized Meta Pixel (${cleanId}) with marketing consent.`);
          }
        } else if (window.fbq) {
          window.fbq('consent', 'grant');
          window.fbq('track', 'PageView');
        }
      } else {
        // Revoke consent if tracking script is present
        if (window.fbq) {
          window.fbq('consent', 'revoke');
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log(`[eLab Meta Pixel]: Meta Pixel (${cleanId}) disabled (Marketing consent revoked or missing).`);
        }
      }
    };

    // Check initial consent status
    const initialConsent = hasCookieConsent('marketing');
    applyConsentAndInitialize(initialConsent);

    // Listen for cookie consent changes
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<CookieConsentState>;
      const isGranted = !!customEvent.detail?.marketing;
      applyConsentAndInitialize(isGranted);
    };

    window.addEventListener('elab:cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('elab:cookie-consent-changed', handleConsentChange);
    };
  }, [pixelId]);

  // Track pageviews on Next.js route navigation
  useEffect(() => {
    if (!pixelId || !pixelId.trim()) return;

    if (hasCookieConsent('marketing') && window.fbq && scriptInjectedRef.current) {
      window.fbq('track', 'PageView');

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[eLab Meta Pixel]: Tracked PageView for ${pathname}`);
      }
    }
  }, [pathname, pixelId]);

  return null;
};

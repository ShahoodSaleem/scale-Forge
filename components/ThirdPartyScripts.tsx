"use client";

import { useEffect } from 'react';

const CLARITY_PROJECT_ID = 'xxxxxxxxx';
const FB_PIXEL_ID = 'YOUR_PIXEL_ID';

export default function ThirdPartyScripts({ gaId }: { gaId?: string }) {
  useEffect(() => {
    let hasLoaded = false;
    
    const loadScripts = () => {
      if (hasLoaded) return;
      hasLoaded = true;

      // Google Analytics (Global Site Tag)
      if (gaId) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        function gtag(){window.dataLayer.push(arguments);}
        // @ts-ignore
        gtag('js', new Date());
        // @ts-ignore
        gtag('config', gaId);
      }

      // MS Clarity
      try {
        (function(c: any, l: Document, a: string, r: string, i: string, t?: any, y?: any){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window as any, document, "clarity", "script", CLARITY_PROJECT_ID);
      } catch(e) { console.error("Clarity error", e); }

      // FB Pixel
      try {
        (function(f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)})(window as any, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        // @ts-ignore
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('init', FB_PIXEL_ID);
          (window as any).fbq('track', 'PageView');
        }
      } catch(e) { console.error("FB Pixel error", e); }
      
      // Clean up listeners
      window.removeEventListener('scroll', loadScripts);
      window.removeEventListener('mousemove', loadScripts);
      window.removeEventListener('touchstart', loadScripts);
    };

    // Listen for interaction
    window.addEventListener('scroll', loadScripts, { passive: true });
    window.addEventListener('mousemove', loadScripts, { passive: true });
    window.addEventListener('touchstart', loadScripts, { passive: true });

    // Fallback timer (longer to ensure it doesn't block initial load)
    const timer = setTimeout(loadScripts, 8000);

    return () => {
      window.removeEventListener('scroll', loadScripts);
      window.removeEventListener('mousemove', loadScripts);
      window.removeEventListener('touchstart', loadScripts);
      clearTimeout(timer);
    };
  }, [gaId]);

  return null;
}

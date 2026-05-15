"use client";

import { useEffect } from 'react';

const CLARITY_PROJECT_ID = 'xxxxxxxxx';
const FB_PIXEL_ID = 'YOUR_PIXEL_ID';

export default function ThirdPartyScripts() {
  useEffect(() => {
    // Delay initialization of non-critical tracking to free up the main thread
    const timer = setTimeout(() => {
      // MS Clarity
      try {
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
      } catch(e) { console.error("Clarity error", e); }

      // FB Pixel
      try {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        // @ts-ignore
        fbq('init', FB_PIXEL_ID);
        // @ts-ignore
        fbq('track', 'PageView');
      } catch(e) { console.error("FB Pixel error", e); }
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, []);

  return null;
}

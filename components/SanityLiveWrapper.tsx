"use client";

import { useState, useEffect } from 'react';
import { SanityLive as OriginalSanityLive } from "@/sanity/lib/live";

export default function SanityLiveWrapper() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Defer Sanity Live connection to prevent it from being in the critical request chain
    // We wait 3 seconds after mount to ensure the initial LCP and interactive window are clear
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 3000); 
    
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return <OriginalSanityLive />;
}

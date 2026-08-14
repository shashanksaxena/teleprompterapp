"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __adsenseLoaderReady?: boolean;
  }
}

type AdSenseLoaderProps = {
  client: string;
};

export function AdSenseLoader({ client }: AdSenseLoaderProps) {
  useEffect(() => {
    if (!client) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-adsense-loader="true"]');
    if (existing) {
      window.__adsenseLoaderReady = true;
      window.dispatchEvent(new Event("adsense:ready"));
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.dataset.adsenseLoader = "true";
    script.onload = () => {
      window.__adsenseLoaderReady = true;
      window.dispatchEvent(new Event("adsense:ready"));
    };
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [client]);

  return null;
}

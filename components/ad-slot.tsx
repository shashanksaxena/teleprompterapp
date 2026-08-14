"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __adsenseLoaderReady?: boolean;
  }
}

type AdSlotProps = {
  client?: string;
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "autorelaxed";
  className?: string;
};

export function AdSlot({ client, slot, format = "auto", className }: AdSlotProps) {
  const adRef = useRef<HTMLElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!client || !slot || initialized) {
      return;
    }

    const initializeAd = () => {
      if (!adRef.current || initialized) {
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        setInitialized(true);
      } catch {
        // Ignore duplicate or delayed script pushes.
      }
    };

    if (window.__adsenseLoaderReady || document.querySelector('script[data-adsense-loader="true"]')) {
      initializeAd();
      return;
    }

    const onReady = () => initializeAd();
    window.addEventListener("adsense:ready", onReady);
    return () => window.removeEventListener("adsense:ready", onReady);
  }, [client, slot, initialized]);

  if (!client || !slot) {
    return null;
  }

  return (
    <ins
      ref={adRef as React.MutableRefObject<HTMLModElement | null>}
      className={`adsbygoogle block overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface-muted)] ${className ?? ""}`}
      style={{
        display: "block",
        minHeight: format === "horizontal" ? "90px" : format === "autorelaxed" ? "280px" : "250px"
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

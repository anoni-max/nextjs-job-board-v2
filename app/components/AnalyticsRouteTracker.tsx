"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render — gtag('config') already sends the initial page_view
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const gtag = (window as any).gtag;
    if (typeof gtag === "function") {
      gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
      });
    }
  }, [pathname]);

  return null;
}

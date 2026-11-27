// lib/analytics.ts
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(action: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
}

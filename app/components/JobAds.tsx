"use client";

import { useState, useEffect } from "react";

export default function JobAds() {
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/job-ads")
      .then((r) => r.json())
      .then((d) => setAds(d.ads || []))
      .catch(() => {});
  }, []);

  if (ads.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Featured Opportunities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad) => (
          <div key={ad.id} className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {ad.applyUrl ? (
              <a href={ad.applyUrl} target="_blank" rel="noopener noreferrer" className="block">
                <img src={ad.imageData} alt={ad.caption || "Job advertisement"} className="w-full h-auto bg-slate-50" />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                  APPLY
                </span>
              </a>
            ) : (
              <img src={ad.imageData} alt={ad.caption || "Job advertisement"} className="w-full h-auto bg-slate-50" />
            )}
            {ad.caption && <p className="px-3 py-2 text-sm text-gray-600">{ad.caption}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

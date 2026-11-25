"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JobAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/job-ads?placement=homepage")
      .then((r) => r.json())
      .then((d) => setAds(d.ads || []))
      .catch(() => {});
  }, []);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-card]");
    const width = card ? (card as HTMLElement).offsetWidth + 16 : 300;
    track.scrollBy({ left: dir * width, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (ads.length <= 1 || hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollBy(1);
      }
    }, 30000);

    return () => clearInterval(id);
  }, [ads.length, hovered, scrollBy]);

  if (ads.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Featured Opportunities</h2>

      <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {ads.length > 1 && (
          <>
            <button onClick={() => scrollBy(-1)} aria-label="Previous" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 rounded-full p-2 shadow hover:bg-white">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={() => scrollBy(1)} aria-label="Next" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 border border-gray-200 rounded-full p-2 shadow hover:bg-white">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        <div ref={trackRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2">
          {ads.map((ad) => (
            <div key={ad.id} data-card className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[31%] relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {ad.applyUrl ? (
                <a href={ad.applyUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={ad.imageData} alt={ad.title || ad.caption || "Advertisement"} className="w-full h-auto bg-slate-50" loading="lazy" />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow">APPLY</span>
                </a>
              ) : (
                <img src={ad.imageData} alt={ad.title || ad.caption || "Advertisement"} className="w-full h-auto bg-slate-50" loading="lazy" />
              )}
              {(ad.title || ad.caption) && <p className="px-3 py-2 text-sm text-gray-600">{ad.title || ad.caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

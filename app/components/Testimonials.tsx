"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function Testimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
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
    if (items.length <= 1 || hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      if (track.scrollLeft <= 5) {
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      } else {
        scrollBy(-1);
      }
    }, 10000);

    return () => clearInterval(id);
  }, [items.length, hovered, scrollBy]);

  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-4">What People Say About KaziSpot</h2>

      <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {items.length > 1 && (
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
          {items.map((item) => (
            <div key={item.id} data-card className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[31%] bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <Quote className="w-6 h-6 text-blue-200" />
              <p className="text-gray-700 text-sm mt-2 leading-relaxed">{item.comment}</p>
              {item.rating && (
                <div className="flex gap-0.5 mt-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
              )}
              <p className="font-bold text-gray-900 text-sm mt-3">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

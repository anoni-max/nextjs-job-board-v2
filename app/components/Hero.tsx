"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  return (
    <section className="bg-white border-b border-gray-100 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Discover Opportunities. Build Your Future.
        </h1>
        <p className="mt-4 text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
          Explore job opportunities from companies and employers around the world. Find opportunities that match your skills, experience and career goals.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title or keywords"
              className="w-full py-3 outline-none text-sm text-slate-900"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-gray-200">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full py-3 outline-none text-sm text-slate-900"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition whitespace-nowrap flex items-center justify-center gap-1">
            Search Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          or <a href="#jobs" className="text-blue-600 font-semibold hover:underline">browse all jobs →</a>
        </p>
      </div>
    </section>
  );
}

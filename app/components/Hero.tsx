"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";

interface HeroStats {
  activeJobs: number;
  employers: number;
  jobsPublished: number;
  countries: number;
}

const categories = [
  { label: "Remote Jobs", query: "Remote" },
  { label: "Entry-Level Jobs", query: "Entry-Level" },
  { label: "Internship Opportunities", query: "Internship" },
  { label: "Engineering Jobs", query: "Engineering" },
  { label: "IT & Technology", query: "Technology" },
  { label: "Administrative Jobs", query: "Administrative" },
];

export default function Hero({ stats }: { stats: HeroStats }) {
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
    <section className="relative bg-white border-b border-gray-100 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -top-10 left-0 w-72 h-72 bg-slate-100 rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Your Next Career Opportunity Starts Here.
        </h1>
        <p className="mt-4 text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
          Discover job opportunities from trusted employers around the world. Explore local and international vacancies, find opportunities that match your skills, and take the next step in your career.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col sm:flex-row gap-2"
        >
          <div className="flex items-center gap-2 flex-1 px-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, skill or keyword"
              className="w-full py-3 outline-none text-sm text-slate-900"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 px-3 border-t sm:border-t-0 sm:border-l border-gray-200">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location or country"
              className="w-full py-3 outline-none text-sm text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition whitespace-nowrap flex items-center justify-center gap-1"
          >
            Search Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick categories */}
        <div className="mt-5 flex flex-wrap justify-center items-center gap-2">
          <span className="text-sm text-slate-500 mr-1">Popular:</span>
          {categories.map((c) => (
            <Link
              key={c.label}
              href={`/?q=${encodeURIComponent(c.query)}`}
              className="text-sm text-slate-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
          <a href="#jobs" className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition inline-flex items-center gap-2">
            Explore Jobs <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#jobs" className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl border border-gray-300 hover:bg-slate-50 transition">
            Find Your Next Opportunity
          </a>
          <Link href="/post" className="text-sm text-blue-600 font-semibold hover:underline px-2">
            Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <Stat value={stats.activeJobs} label="Active Jobs" />
          <Stat value={stats.employers} label="Employers" />
          <Stat value={stats.jobsPublished} label="Jobs Published" />
          <Stat value={stats.countries} label="Countries" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-slate-50 border border-gray-100 rounded-2xl px-4 py-5">
      <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{value.toLocaleString()}</div>
      <div className="text-xs md:text-sm text-slate-500 font-medium mt-1">{label}</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ExternalLink, Mail, BadgeCheck } from "lucide-react";
import { useState } from "react";

export default function HomeClient({ jobs }: { jobs: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const categories = [
    "All", "Executive", "Customer Support", "Marketing",
    "Ops", "Medical", "Education", "Finance", "Design"
  ];

  // Unique locations from the data
  const locations = ["All", ...Array.from(new Set(jobs.map((j) => j.location).filter(Boolean)))];

  // Unique job types from employmentType
  const jobTypes = ["All", ...Array.from(new Set(
    jobs.flatMap((j) => (j.employmentType || "").split(/[,/]/).map((s: string) => s.trim()).filter(Boolean))
  ))];

  const filteredJobs = jobs.filter((job) => {
    if (activeCategory !== "All") {
      const matchesCat =
        job.tags?.some((tag: string) => tag.toLowerCase().includes(activeCategory.toLowerCase())) ||
        job.position?.toLowerCase().includes(activeCategory.toLowerCase());
      if (!matchesCat) return false;
    }
    if (locationFilter !== "All" && job.location !== locationFilter) return false;
    if (typeFilter !== "All") {
      const haystack = (job.employmentType || "").toLowerCase();
      if (!haystack.includes(typeFilter.toLowerCase())) return false;
    }
    return true;
  });

  // Website first -> email second -> Google search fallback
  function getApplyLink(job: any) {
    const url = (job.url || "").trim();
    const email = (job.applyEmail || "").trim();
    if (url) {
      return { href: url.startsWith("http") ? url : `https://${url}`, isMailto: false, label: "Apply" };
    }
    if (email) {
      return {
        href: `mailto:${email}?subject=${encodeURIComponent(`Application for ${job.position} at ${job.company}`)}`,
        isMailto: true,
        label: "Apply by Email",
      };
    }
    return {
      href: `https://www.google.com/search?q=${encodeURIComponent(`${job.position} ${job.company} jobs Kenya`)}`,
      isMailto: false,
      label: "Find Apply Link",
    };
  }

  return (
    <div className="w-full">
      {/* Category bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide border-b border-gray-100 px-4 pt-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters: Location + Job Type */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-3 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filters</span>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc === "All" ? "All Locations" : loc}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {jobTypes.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Job Types" : t}</option>
          ))}
        </select>
      </div>

      {/* Job list */}
      <div className="flex flex-col">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs match your filters.</p>
          </div>
        ) : (
          filteredJobs.map((job: any) => {
            const apply = getApplyLink(job);
            return (
              <div
                key={job.id}
                className="group flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 hover:bg-slate-50 transition-colors"
              >
                {/* Left side */}
                <Link href={`/jobs/${job.id}`} className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                  <Image
                    src={`https://logo.clearbit.com/${(job.company || "company").toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}
                    alt={job.company || "Company"}
                    width={48}
                    height={48}
                    unoptimized
                    className="rounded-full object-contain bg-white border border-gray-200 p-1 shrink-0 mt-1 md:mt-0"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company || "Company"}&background=random&color=fff`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {job.position}
                      </h2>
                      {job.isLocal && (
                        <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" aria-label="Verified" />
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5 truncate">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-200 text-xs text-gray-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{job.location || "Remote"}</span>
                      </div>
                      {job.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* Right side: time + apply */}
                <div className="flex items-center justify-end gap-3 mt-3 md:mt-0 shrink-0 md:ml-4 w-full md:w-auto">
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="whitespace-nowrap">{job.timeAgo || "New"}</span>
                  </div>
                  <a
                    href={apply.href}
                    target={apply.isMailto ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white text-sm font-semibold px-5 py-1.5 md:px-6 md:py-2 rounded-lg group-hover:bg-blue-700 transition shadow-sm inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {apply.isMailto ? <Mail className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                    {apply.label}
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

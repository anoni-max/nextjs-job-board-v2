"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, BadgeCheck } from "lucide-react";
import { useState } from "react";

function jobTypeOf(job: any): string {
  const s = `${job.employmentType || ""} ${(job.tags || []).join(" ")}`.toLowerCase();
  if (s.includes("intern")) return "Internship";
  if (s.includes("part-time") || s.includes("part time")) return "Part-time";
  if (s.includes("contract") || s.includes("freelance")) return "Contract";
  if (s.includes("remote")) return "Remote";
  return "Full-time";
}

export default function HomeClient({ jobs }: { jobs: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");

  const categories = [
    "All", "Executive", "Customer Support", "Marketing", 
    "Ops", "Medical", "Education", "Finance", "Design"
  ];
  const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const locations = Array.from(new Set(jobs.map((j: any) => j.location).filter(Boolean))).sort();

  const filteredJobs = jobs.filter((job: any) => {
    if (activeCategory !== "All") {
      const match = job.tags?.some((tag: string) => 
        tag.toLowerCase().includes(activeCategory.toLowerCase())
      ) || job.position?.toLowerCase().includes(activeCategory.toLowerCase());
      if (!match) return false;
    }
    if (location !== "All" && job.location !== location) return false;
    if (jobType !== "All" && jobTypeOf(job) !== jobType) return false;
    return true;
  });

  return (
    <div className="w-full">
      {/* Top Category Scrollable Bar */}
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
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Locations</option>
          {locations.map((loc: any) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {jobTypes.map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
          ))}
        </select>
      </div>

      {/* The List View */}
      <div className="flex flex-col">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found. Try different filters.</p>
          </div>
        ) : (
          filteredJobs.map((job: any) => (
            <Link 
              href={`/jobs/${job.id}`} 
              key={job.id} 
              className="group flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 hover:bg-slate-50 transition-colors"
            >
              
              {/* Left Side: Logo, Title, Company, Location+Time+Tags */}
              <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                <Image 
                  src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} 
                  alt={job.company}
                  width={48}
                  height={48}
                  unoptimized
                  className="rounded-full object-contain bg-white border border-gray-200 p-1 shrink-0 mt-1 md:mt-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random&color=fff`;
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {job.position}
                  </h2>
                  
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-500 text-sm truncate">{job.company}</p>
                    {job.verified && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <div className="bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-200 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[150px]">{job.location || "Remote"}</span>
                    </div>

                    {job.timeAgo && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{job.timeAgo}</span>
                      </span>
                    )}

                    {job.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Apply Button */}
              <div className="flex items-center justify-end mt-4 md:mt-0 shrink-0 md:ml-4 w-full md:w-auto">
                <div className="bg-blue-600 text-white text-sm font-semibold px-6 py-1.5 md:px-6 md:py-2 rounded-lg group-hover:bg-blue-700 transition shadow-sm">
                  Apply
                </div>
              </div>

            </Link>
          ))
        )}
      </div>
    </div>
  );
}

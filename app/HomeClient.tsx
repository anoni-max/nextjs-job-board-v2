"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, BadgeCheck } from "lucide-react";
import { useState } from "react";

export default function HomeClient({ jobs }: { jobs: any[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All", "Executive", "Customer Support", "Marketing", 
    "Ops", "Medical", "Education", "Finance", "Design"
  ];

  const categoryFilteredJobs = jobs.filter((job) => {
    if (activeCategory === "All") return true;
    return job.tags?.some((tag: string) => 
      tag.toLowerCase().includes(activeCategory.toLowerCase())
    ) || job.position?.toLowerCase().includes(activeCategory.toLowerCase());
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

      {/* The List View */}
      <div className="flex flex-col">
        {categoryFilteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found in this category.</p>
          </div>
        ) : (
          categoryFilteredJobs.map((job: any) => (
            <Link 
              href={`/jobs/${job.id}`} 
              key={job.id} 
              className="group flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 hover:bg-slate-50 transition-colors"
            >
              
              {/* Left Side: Logo, Title, Company, Location+Tags */}
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
                  {/* Title - Forced to single line with truncate */}
                  <h2 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {job.position}
                  </h2>
                  
                  {/* Company + Verified badge */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-500 text-sm truncate">{job.company}</p>
                    {job.verified && (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  
                  {/* Location + Skills on the same line */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {/* Location Pill */}
                    <div className="bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-200 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[150px]">{job.location || "Remote"}</span>
                    </div>

                    {/* Tags */}
                    {job.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Time & Apply Button */}
              <div className="flex items-center justify-end gap-4 mt-4 md:mt-0 shrink-0 md:ml-4 w-full md:w-auto">
                {/* Hides the "New" text on mobile so it doesn't stretch the button */}
                <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 font-medium mr-auto md:mr-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>New</span>
                </div>
                {/* The Apply Button - smaller padding on mobile */}
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

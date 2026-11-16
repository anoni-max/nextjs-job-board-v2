"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
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
              
              {/* Left Side: Logo and Details */}
              <div className="flex items-start gap-4 flex-1 pr-4">
                <Image 
                  src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} 
                  alt={job.company}
                  width={48}
                  height={48}
                  unoptimized
                  className="rounded-full object-contain bg-white border border-gray-200 p-1 shrink-0 mt-1"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random&color=fff`;
                  }}
                />
                
                <div className="flex-1">
                  {/* Title - Full display, no truncate */}
                  <h2 className="text-[17px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {job.position}
                  </h2>
                  
                  {/* Company */}
                  <p className="text-gray-500 text-sm mt-1">{job.company}</p>
                  
                  {/* Location + Skills on the same line */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    {/* Location Pill */}
                    <div className="bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-200 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location || "Remote"}</span>
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
              <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 shrink-0 md:pl-4">
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium md:block hidden">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  <span>New</span>
                </div>
                <div className="bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-lg group-hover:bg-blue-700 transition shadow-sm w-full md:w-auto text-center">
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
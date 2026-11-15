"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Briefcase } from "lucide-react";

export default function HomeClient({ jobs }: { jobs: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.position?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900 text-lg"
        />
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg">No jobs found matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          filteredJobs.map((job: any) => (
            <Link 
              href={`/jobs/${job.id}`} 
              key={job.id} 
              className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition duration-200 group"
            >
              <div className="flex items-start gap-4">
                <Image 
                  src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} 
                  alt={job.company}
                  width={48}
                  height={48}
                  unoptimized
                  className="rounded-lg object-contain bg-white border border-gray-100 p-1 mt-1"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random&color=fff`;
                  }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                        {job.position}
                      </h2>
                      <p className="text-gray-600 font-medium mt-1">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {job.tags?.[0] || "Tech"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {job.tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
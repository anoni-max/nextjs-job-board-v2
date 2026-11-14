"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import Link from "next/link";
import Image from "next/image";

export default function HomeClient({ jobs }: { jobs: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.position?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <SearchBar onSearch={setSearchQuery} />

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No jobs found matching &quot;{searchQuery}&quot;</p>
        ) : (
          filteredJobs.map((job: any) => (
            <Link 
              href={`/jobs/${job.id}`} 
              key={job.id} 
              className="block bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 mb-3">
                <Image 
                  src={`https://logo.clearbit.com/${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} 
                  alt={job.company}
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-lg object-contain bg-white border border-gray-200 p-1"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company}&background=random&color=fff`;
                  }}
                />
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">{job.position}</h2>
                  <p className="text-gray-600 text-sm">{job.company} · {job.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {job.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
export const dynamic = "force-dynamic";
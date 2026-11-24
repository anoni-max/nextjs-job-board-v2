"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Briefcase, ExternalLink, Mail, Trash2, Clock } from "lucide-react";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs/saved");
      const data = await res.json();
      if (res.ok) setJobs(data.jobs || []);
      else setError(data.error || "Failed to load saved jobs.");
    } catch (e) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function unsave(jobId: string) {
    await fetch("/api/jobs/saved", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }

  function applyHref(job: any) {
    if (job.applyUrl && job.applyUrl.trim()) {
      const u = job.applyUrl.trim();
      return { href: u.startsWith("http") ? u : `https://${u}`, mailto: false };
    }
    if (job.applyEmail && job.applyEmail.trim()) {
      return {
        href: `mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application for ${job.title}`)}`,
        mailto: true,
      };
    }
    return {
      href: `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} jobs Kenya`)}`,
      mailto: false,
    };
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-500 mt-1">Jobs you've saved for later.</p>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-12">Loading…</p>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No saved jobs yet.</p>
            <Link href="/matches" className="inline-block mt-4 text-blue-600 font-bold hover:underline">Find jobs for you</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const apply = applyHref(job);
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                      <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
                    </div>
                    <button onClick={() => unsave(job.id)} className="text-gray-400 hover:text-red-600 transition shrink-0" title="Remove">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                    {job.employmentType && (
                      <span className="inline-flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.employmentType}</span>
                    )}
                    {job.salary && <span>💰 {job.salary}</span>}
                    {job.expiresAt && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />Deadline: {new Date(job.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <a
                    href={apply.href}
                    target={apply.mailto ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {apply.mailto ? <Mail className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />} Apply
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

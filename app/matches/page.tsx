"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, MapPin, Clock, Briefcase, Save as SaveIcon,
  ExternalLink, Mail, ThumbsUp, ThumbsDown,
} from "lucide-react";

const timeOptions = [
  { value: "today", label: "Today" },
  { value: "24h", label: "Last 24 hours" },
  { value: "48h", label: "Last 48 hours" },
  { value: "week", label: "This week" },
  { value: "all", label: "All time" },
];

export default function MatchesPage() {
  const [time, setTime] = useState("week");
  const [matches, setMatches] = useState<any[]>([]);
  const [scanned, setScanned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMatches(time);
    loadSaved();
  }, []);

  async function loadMatches(timeParam: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/jobs/matches?time=${timeParam}`);
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches || []);
        setScanned(data.scanned || 0);
      } else {
        setError(data.error || "Failed to load matches.");
      }
    } catch (e) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSaved() {
    try {
      const res = await fetch("/api/jobs/saved");
      if (res.ok) {
        const data = await res.json();
        setSavedIds(new Set((data.jobs || []).map((j: any) => j.id)));
      }
    } catch (e) {
      /* ignore */
    }
  }

  function changeTime(t: string) {
    setTime(t);
    loadMatches(t);
  }

  async function saveJob(id: string) {
    await fetch("/api/jobs/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id }),
    });
    setSavedIds((prev) => new Set(prev).add(id));
  }

  async function sendFeedback(id: string, rating: string) {
    await fetch("/api/jobs/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, rating }),
    });
    if (rating === "not-relevant") {
      setMatches((prev) => prev.filter((j) => j.id !== id));
    }
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
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Jobs Matched For You</h1>
            <p className="text-gray-500 mt-1">Personalised recommendations based on your profile.</p>
          </div>
          <select
            value={time}
            onChange={(e) => changeTime(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-blue-600 mx-auto animate-pulse" />
            <p className="text-gray-500 mt-4">Finding your best matches…</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <Link href="/profile" className="inline-block mt-4 text-blue-600 font-bold hover:underline">
              {error === "Please create your profile first" ? "Set up your profile" : "Try again"}
            </Link>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              No strong matches found {scanned > 0 ? `among ${scanned} jobs scanned` : ""} in this period.
            </p>
            <p className="text-gray-400 text-sm mt-2">Try a wider time range or add more skills to your profile.</p>
            <Link href="/profile" className="inline-block mt-4 text-blue-600 font-bold hover:underline">Update profile</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((job) => {
              const apply = applyHref(job);
              return (
                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                      <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
                    </div>
                    <span className="shrink-0 text-2xl font-extrabold text-green-600">{Math.round(job.score)}%</span>
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

                  {job.reasons && (
                    <p className="mt-3 text-sm text-gray-600 bg-slate-50 border border-slate-100 rounded-lg p-3">
                      <strong>Why it matches:</strong> {job.reasons}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <a
                      href={apply.href}
                      target={apply.mailto ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-1"
                    >
                      {apply.mailto ? <Mail className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />} Apply
                    </a>
                    <button
                      onClick={() => saveJob(job.id)}
                      className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 hover:bg-slate-50 transition inline-flex items-center gap-1"
                    >
                      <SaveIcon className="w-4 h-4" /> {savedIds.has(job.id) ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={() => sendFeedback(job.id, "relevant")}
                      title="This is relevant"
                      className="text-gray-400 hover:text-green-600 transition p-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => sendFeedback(job.id, "not-relevant")}
                      title="Not relevant — hide this"
                      className="text-gray-400 hover:text-red-600 transition p-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Copy, CheckCircle2, Briefcase, Share2 } from "lucide-react";

function formatDeadline(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MarketingStudio() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");

  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const res = await fetch("/api/jobs/latest");
    if (res.ok) {
      const data = await res.json();
      setJobs(data);
    }
  }

  function selectJob(job: any) {
    setSelectedJob(job);
    setTitle(job.title || "");
    setCompany(job.company || "");
    setCategory(job.employmentType || "Featured Opportunity");
    setLocation(job.location || "Remote");
    setSalary(job.salary || "Competitive");
    setDeadline(formatDeadline(job.expiresAt));
  }

  function buildText() {
    return `🚨 NEW JOB ALERT — KaziSpot\n\n${title}\n${company}\n\n📍 ${location}\n💰 Est. ${salary}\n🗂️ ${category}${deadline ? `\n⏳ Deadline: ${deadline}` : ""}\n\n🔗 Apply now: https://www.kazispot.com/jobs/${selectedJob?.id}\n\nYour Work Awaits.\n#KaziSpot #JobsInKenya #Hiring #NowHiring`;
  }

  async function markAsMarketed() {
    if (!selectedJob) return;
    const id = selectedJob.id;
    try {
      await fetch("/api/jobs/marketed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error("Failed to mark as marketed", e);
    }
    setSelectedJob(null);
    await fetchJobs();
  }

  async function downloadPoster() {
    if (!posterRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(posterRef.current, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `KaziSpot-${title.replace(/\s+/g, "-")}.png`;
    link.click();
    await markAsMarketed();
  }

  function copyText() {
    navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    markAsMarketed();
  }

  async function shareNative() {
    const text = buildText();
    if (!navigator.share) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      await markAsMarketed();
      return;
    }
    try {
      let shared = false;
      if (posterRef.current) {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(posterRef.current, { scale: 2 });
        const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png"));
        if (blob) {
          const file = new File([blob], "kazispot-job.png", { type: "image/png" });
          try {
            await navigator.share({ title: "KaziSpot Job", text, files: [file] });
            shared = true;
          } catch {
            // files not supported
          }
        }
      }
      if (!shared) {
        await navigator.share({ title: "KaziSpot Job", text });
      }
      await markAsMarketed();
    } catch {
      // user cancelled — don't mark
    }
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildText())}`, "_blank");
    markAsMarketed();
  }

  function shareX() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildText())}`, "_blank");
    markAsMarketed();
  }

  function shareLinkedIn() {
    const url = `https://www.kazispot.com/jobs/${selectedJob?.id}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    markAsMarketed();
  }

  function shareFacebook() {
    const url = `https://www.kazispot.com/jobs/${selectedJob?.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    markAsMarketed();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-blue-600 hover:underline mb-2 inline-flex items-center gap-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Marketing Studio</h1>
            <p className="text-gray-500">Generate posters and captions for social media.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Job list */}
          <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-[800px] overflow-y-auto">
            <h2 className="font-bold text-gray-900 mb-4 px-2">Select a Job</h2>
            <div className="space-y-2">
              {jobs.length === 0 && (
                <p className="text-sm text-gray-400 px-2">No new jobs to share. 🎉</p>
              )}
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => selectJob(job)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedJob?.id === job.id ? "bg-blue-50 border-blue-300" : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <h3 className="font-bold text-sm text-gray-900 truncate">{job.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{job.company}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Studio */}
          <div className="lg:col-span-2 space-y-6">
            {selectedJob ? (
              <>
                {/* Editable fields */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Job Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company</label>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                    <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Salary</label>
                    <input value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Deadline</label>
                    <input value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>

                {/* Poster */}
                <div className="flex justify-center bg-gray-200 p-6 rounded-xl border border-gray-300">
                  <div
                    ref={posterRef}
                    className="w-[600px] h-[750px] bg-gradient-to-br from-[#071022] via-[#0c1c38] to-[#16365f] text-white p-10 flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-transparent"></div>
                    <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/20 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full"></div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-extrabold text-lg">K</div>
                        <span className="text-xl font-extrabold tracking-tight">KaziSpot</span>
                      </div>
                      <span className="text-xs font-bold bg-blue-600/20 border border-blue-400/40 text-blue-200 px-4 py-1.5 rounded-full uppercase tracking-widest">
                        We&apos;re Hiring
                      </span>
                    </div>

                    <div className="relative z-10 mt-16">
                      {company && (
                        <p className="text-sm text-sky-300 font-semibold uppercase tracking-widest mb-3">{company}</p>
                      )}
                      <h2 className="text-5xl font-extrabold leading-[1.1]">{title}</h2>
                      <div className="mt-6 inline-block bg-sky-400/10 border border-sky-400/30 text-sky-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        {category}
                      </div>
                    </div>

                    <div className="flex-1"></div>

                    <div className="relative z-10 grid grid-cols-3 gap-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Location</p>
                        <p className="font-semibold text-sm leading-snug">{location}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Salary</p>
                        <p className="font-semibold text-sm leading-snug text-sky-300">Est. {salary}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Deadline</p>
                        <p className="font-semibold text-sm leading-snug">{deadline || "Open"}</p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <p className="text-xl font-extrabold tracking-tight">Your Work Awaits.</p>
                        <p className="text-xs text-slate-400 mt-1">www.kazispot.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={downloadPoster} className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" /> Download
                  </button>
                  <button onClick={copyText} className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  <button onClick={shareNative} className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>

                {/* Quick share buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={shareWhatsApp} className="bg-[#25D366] text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                    WhatsApp
                  </button>
                  <button onClick={shareX} className="bg-slate-900 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                    X (Twitter)
                  </button>
                  <button onClick={shareLinkedIn} className="bg-[#0A66C2] text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                    LinkedIn
                  </button>
                  <button onClick={shareFacebook} className="bg-[#1877F2] text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                    Facebook
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white rounded-xl border border-gray-200 py-32">
                <Briefcase className="w-12 h-12 mb-4 text-gray-300" />
                <p>Select a job from the left to generate a poster.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

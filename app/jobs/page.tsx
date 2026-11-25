import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  MapPin, Briefcase, Clock, ExternalLink, Mail,
  ChevronLeft, ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function formatDate(d?: Date | null): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  const nums = Array.from(set)
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) result.push("…");
    result.push(n);
    prev = n;
  }
  return result;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string; type?: string; sort?: string; page?: string }>;
}) {
  const p = await searchParams;
  const q = p.q?.toLowerCase() || "";
  const location = p.location?.toLowerCase() || "";
  const type = p.type?.toLowerCase() || "";
  const sort = p.sort || "newest";
  const page = Math.max(1, parseInt(p.page || "1") || 1);

  const activeWhere = { isApproved: true, rejected: false, expiresAt: { gt: new Date() } };

  const where: any = { ...activeWhere };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { company: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (type) where.employmentType = { contains: type, mode: "insensitive" };

  const orderBy = sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

      prisma.jobAd.findMany({
      where: {
        active: true,
        placement: { in: ["jobs", "sidebar"] },
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: new Date() } }] },
          { OR: [{ expiryDate: null }, { expiryDate: { gte: new Date() } }] },
        ],
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),


  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = getPageNumbers(page, totalPages);

  function buildHref(n: number): string {
    const params = new URLSearchParams();
    if (q) params.set("q", p.q || "");
    if (location) params.set("location", p.location || "");
    if (type) params.set("type", p.type || "");
    if (sort && sort !== "newest") params.set("sort", sort);
    params.set("page", String(n));
    return `/jobs?${params.toString()}`;
  }

  const inputCls =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">All Jobs</h1>

        {/* Search + filters (full width) */}
        <form
          method="get"
          action="/jobs"
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <input name="q" defaultValue={p.q || ""} placeholder="Job title, skill or company" className={inputCls} />
          <input name="location" defaultValue={p.location || ""} placeholder="Location or country" className={inputCls} />
          <select name="type" defaultValue={p.type || ""} className={inputCls}>
            <option value="">All employment types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          <select name="sort" defaultValue={p.sort || "newest"} className={inputCls}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button type="submit" className="sm:col-span-2 lg:col-span-4 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition">
            Search Jobs
          </button>
        </form>

        {/* Two-column layout */}
        <div className="grid grid-cols-[minmax(0,1fr)_110px] sm:grid-cols-[minmax(0,1fr)_180px] lg:grid-cols-[minmax(0,1fr)_320px] gap-3 sm:gap-6 items-start">
          {/* LEFT: job listings */}
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {total} job{total === 1 ? "" : "s"} found
            </p>

            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                  No jobs found. Try different filters.
                </div>
              ) : (
                jobs.map((job) => {
                  const url = (job.applyUrl || "").trim();
                  const email = (job.applyEmail || "").trim();
                  const apply = url
                    ? { href: url.startsWith("http") ? url : `https://${url}`, mailto: false }
                    : email
                    ? { href: `mailto:${email}?subject=${encodeURIComponent(`Application for ${job.title}`)}`, mailto: true }
                    : { href: `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} jobs Kenya`)}`, mailto: false };

                  return (
                    <div key={job.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">{job.title}</h2>
                      <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>

                      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        {job.employmentType && (
                          <span className="inline-flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.employmentType}</span>
                        )}
                        {job.salary && <span>💰 {job.salary}</span>}
                        {job.postedDate && <span>Posted: {formatDate(job.postedDate)}</span>}
                        {job.expiresAt && (
                          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Deadline: {formatDate(job.expiresAt)}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 hover:bg-slate-50 transition"
                        >
                          View Details
                        </Link>
                        <a
                          href={apply.href}
                          target={apply.mailto ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-1"
                        >
                          {apply.mailto ? <Mail className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />} Apply
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                {page > 1 ? (
                  <Link href={buildHref(page - 1)} className="px-3 py-2 rounded-lg text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 inline-flex items-center gap-1">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </Link>
                ) : (
                  <span className="px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-400 inline-flex items-center gap-1 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </span>
                )}

                {pageNumbers.map((n, i) =>
                  n === "…" ? (
                    <span key={`e${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <Link
                      key={n}
                      href={buildHref(n)}
                      className={`px-3 py-2 rounded-lg text-sm font-bold ${
                        n === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-slate-50"
                      }`}
                    >
                      {n}
                    </Link>
                  )
                )}

                {page < totalPages ? (
                  <Link href={buildHref(page + 1)} className="px-3 py-2 rounded-lg text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 inline-flex items-center gap-1">
                    Next <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="px-3 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-400 inline-flex items-center gap-1 cursor-not-allowed">
                    Next <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: advertisements */}
          <aside className="space-y-4">
            {ads.length > 0 && (
              <div>
                <h3 className="hidden sm:block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Sponsored</h3>
                <div className="space-y-3">
                  {ads.map((ad) => (
                    <div key={ad.id} className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {ad.applyUrl ? (
                        <a href={ad.applyUrl} target="_blank" rel="noopener noreferrer" className="block">
                          <img src={ad.imageData} alt={ad.caption || "Advertisement"} className="w-full h-auto" loading="lazy" />
                        </a>
                      ) : (
                        <img src={ad.imageData} alt={ad.caption || "Advertisement"} className="w-full h-auto" loading="lazy" />
                      )}
                      <span className="absolute top-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Sponsored
                      </span>
                      {ad.caption && (
                        <p className="hidden sm:block px-2 py-1 text-[10px] text-gray-600 truncate">{ad.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featured.length > 0 && (
              <div className="hidden sm:block">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Featured Jobs</h3>
                <div className="space-y-3">
                  {featured.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <p className="text-sm font-bold text-gray-900 truncate">{job.title}</p>
                      <p className="text-xs text-gray-500 truncate">{job.company}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{job.location}
                      </p>
                      <Link href={`/jobs/${job.id}`} className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline">
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="hidden sm:block bg-slate-900 text-white rounded-lg p-4 text-center">
              <p className="text-sm font-bold mb-1">Looking for qualified candidates?</p>
              <p className="text-xs text-slate-300 mb-3">Advertise your vacancies on KaziSpot and reach job seekers worldwide.</p>
              <Link href="/post" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
                Advertise With Us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

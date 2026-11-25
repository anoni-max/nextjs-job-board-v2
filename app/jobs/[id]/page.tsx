import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, Briefcase, Clock, ExternalLink, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function formatDate(d?: Date | null): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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

  const where: any = {
    isApproved: true,
    rejected: false,
    expiresAt: { gt: new Date() },
  };

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

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({ where, orderBy, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const inputCls =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">All Jobs</h1>

        {/* Search + filters */}
        <form method="get" action="/jobs" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* Result count */}
        <p className="text-sm text-gray-500 mb-4">{total} job{total === 1 ? "" : "s"} found</p>

        {/* Job list */}
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
                <div key={job.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
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
                    <Link href={`/jobs/${job.id}`} className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 hover:bg-slate-50 transition">
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
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const params = new URLSearchParams();
              if (q) params.set("q", p.q || "");
              if (location) params.set("location", p.location || "");
              if (type) params.set("type", p.type || "");
              if (sort && sort !== "newest") params.set("sort", sort);
              params.set("page", String(n));
              return (
                <Link
                  key={n}
                  href={`/jobs?${params.toString()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-bold ${
                    n === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-slate-50"
                  }`}
                >
                  {n}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

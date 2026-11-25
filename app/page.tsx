import HomeClient from "./HomeClient";
import Hero from "./components/Hero";
import JobAds from "./components/JobAds";
import Testimonials from "./components/Testimonials";
import FeedbackWidget from "./components/FeedbackWidget";
import { prisma } from "@/lib/prisma";
import StatsHeader from "./components/StatsHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KaziSpot — Find Jobs in Kenya & Worldwide | Your Next Career Opportunity",
  description:
    "Discover job opportunities from trusted employers around the world. Explore local and international vacancies and find roles that match your skills.",
};

function timeAgo(dateInput?: Date | string | null): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  const years = Math.floor(months / 12);
  return `${years} yr ago`;
}

function extractCountry(loc?: string | null): string | null {
  if (!loc) return null;
  const parts = loc.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  const candidate = parts[parts.length - 1];
  if (/remote|online|worldwide|global|hybrid|onsite|on-site|anywhere/i.test(candidate)) return null;
  return candidate;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; location?: string }> }) {
  const activeWhere = { isApproved: true, rejected: false, expiresAt: { gt: new Date() } };

  const [jobs, activeCount, publishedCount, employerRows, locationRows] = await Promise.all([
    prisma.job.findMany({ where: activeWhere, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.job.count({ where: activeWhere }),
    prisma.job.count({ where: { isApproved: true } }),
    prisma.job.findMany({ where: activeWhere, distinct: ["company"], select: { company: true } }),
    prisma.job.findMany({ where: activeWhere, select: { location: true } }),
  ]);

  const formattedJobs = jobs.map((job) => ({
    id: job.id,
    position: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    url: job.applyUrl,
    applyEmail: job.applyEmail,
    salary: job.salary,
    employmentType: job.employmentType,
    postedAt: job.postedDate || job.createdAt,
    timeAgo: timeAgo(job.postedDate || job.createdAt),
    isLocal: true,
    tags: ["Local", "Featured"],
  }));

  const countries = new Set<string>();
  for (const r of locationRows) {
    const c = extractCountry(r.location);
    if (c) countries.add(c);
  }

  const stats = {
    activeJobs: activeCount,
    employers: employerRows.length,
    jobsPublished: publishedCount,
    countries: countries.size,
  };

  return (
    <main className="min-h-screen">
      {/* 1. Hero */}
      <Hero stats={stats} />

      {/* 2. Image Job Advertisements (carousel) */}
      <JobAds />

      {/* 3. Latest 3 Jobs */}
      <StatsHeader
        title="Latest Jobs"
        subtitle="Discover remote and local opportunities"
        count={activeCount}
        countLabel="Active Jobs"
        showSocialButton
      />

      <section className="max-w-6xl mx-auto px-4 py-8 scroll-mt-36" id="jobs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <HomeClient jobs={formattedJobs} />

              {/* Explore All button right after the 3 jobs */}
              <div className="p-5">
                <a
                  href="/jobs"
                  className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
                >
                  Explore All Opportunities →
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-36 h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Talent</h3>
              <p className="text-sm text-gray-600 mb-4">
                Looking to hire? Browse our pool of pre-vetted candidates ready to work.
              </p>
              <a href="/talent" className="block text-center w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">
                Browse Talent Pool
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-2">Have a role to fill?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Reach thousands of local and remote workers. Post your job today.
              </p>
              <a href="/post" className="block text-center w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                Post a Job
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials carousel */}
      <Testimonials />

      {/* 5. Floating feedback button (opens popup) */}
      <FeedbackWidget />
    </main>
  );
}

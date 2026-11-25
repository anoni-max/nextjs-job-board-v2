import HomeClient from "./HomeClient";
import Hero from "./components/Hero";
import JobAds from "./components/JobAds";
import Testimonials from "./components/Testimonials";
import FeedbackSection from "./components/FeedbackSection";
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
  let remoteJobs: any[] = [];
  try {
    const res = await fetch("https://remoteok.com/api", { cache: "no-store" });
    const data = await res.json();
    remoteJobs = Array.isArray(data) ? data.slice(1, 20) : [];
  } catch (error) {
    console.error("Failed to fetch remote jobs:", error);
  }

  let localJobs: any[] = [];
  try {
    localJobs = await prisma.job.findMany({
      where: { expiresAt: { gt: new Date() }, isApproved: true, rejected: false },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch local jobs:", error);
  }

  let totalPublished = 0;
  try {
    totalPublished = await prisma.job.count({ where: { isApproved: true } });
  } catch (error) {
    console.error("Failed to count jobs:", error);
  }

  const formattedLocalJobs = localJobs.map((job) => ({
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
    isLocal: true,
    tags: ["Local", "Featured"],
  }));

  const formattedRemoteJobs = remoteJobs.map((job: any) => ({
    id: String(job.id),
    position: job.position || job.title || "Remote Job",
    company: job.company || "Remote Company",
    location: job.location || "Remote",
    description: job.description,
    url: job.url || job.apply_url,
    applyEmail: null,
    salary: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : null,
    employmentType: null,
    postedAt: job.date || job.created_at,
    isLocal: false,
    tags: ["Remote"],
  }));

  const allJobs = [...formattedLocalJobs, ...formattedRemoteJobs].sort((a, b) => {
    const ta = new Date(a.postedAt).getTime();
    const tb = new Date(b.postedAt).getTime();
    return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
  });

  const jobsWithTime = allJobs.map((job) => ({ ...job, timeAgo: timeAgo(job.postedAt) }));

  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";
  const locationQuery = resolvedParams.location?.toLowerCase() || "";

  const filteredJobs = jobsWithTime.filter((job) => {
    const matchQ =
      !searchQuery ||
      job.position?.toLowerCase().includes(searchQuery) ||
      job.company?.toLowerCase().includes(searchQuery) ||
      job.location?.toLowerCase().includes(searchQuery);
    const matchLoc = !locationQuery || job.location?.toLowerCase().includes(locationQuery);
    return matchQ && matchLoc;
  });

  const employers = new Set(localJobs.map((j) => j.company).filter(Boolean)).size;
  const countries = new Set<string>();
  for (const j of [...localJobs, ...remoteJobs]) {
    const c = extractCountry(j.location);
    if (c) countries.add(c);
  }

  const stats = {
    activeJobs: allJobs.length,
    employers,
    jobsPublished: totalPublished,
    countries: countries.size,
  };

  return (
    <main className="min-h-screen">
      {/* 1. Hero */}
      <Hero stats={stats} />

      {/* 2. Image Job Advertisements (carousel) */}
      <JobAds />

      {/* 3. Latest Jobs */}
      <StatsHeader
        title="Latest Jobs"
        subtitle="Discover remote and local opportunities"
        count={allJobs.length}
        countLabel="Active Jobs"
        showSocialButton
      />

      <section className="max-w-6xl mx-auto px-4 py-8 scroll-mt-36" id="jobs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <HomeClient jobs={filteredJobs} />
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

      {/* 5. Feedback form */}
      <FeedbackSection />
    </main>
  );
}

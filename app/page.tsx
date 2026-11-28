import FeedbackSection from "./components/FeedbackSection";
import HomeClient from "./HomeClient";
import Hero from "./components/Hero";
import JobAds from "./components/JobAds";
import Categories from "./components/Categories";
import CareerResources from "./components/CareerResources";
import Testimonials from "./components/Testimonials";
import FeedbackWidget from "./components/FeedbackWidget";
import EmployerBanner from "./components/EmployerBanner";
import TrustSection from "./components/TrustSection";
import { prisma } from "@/lib/prisma";
import StatsHeader from "./components/StatsHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KaziSpot — Find Jobs in Kenya & Worldwide | Discover Opportunities",
  description:
    "Explore job opportunities from companies and employers around the world. Find roles that match your skills, experience and career goals.",
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

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; location?: string }> }) {
  const activeWhere = { isApproved: true, rejected: false, expiresAt: { gt: new Date() } };

  const [jobs, activeCount] = await Promise.all([
    prisma.job.findMany({ where: activeWhere, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.job.count({ where: activeWhere }),
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

  return (
    <main className="min-h-screen">
      <Hero />
      <StatsHeader title="Latest Jobs" subtitle="Discover remote and local opportunities" count={activeCount} countLabel="Active Jobs" showSocialButton />

      <section className="max-w-3xl mx-auto px-4 py-8 scroll-mt-36" id="jobs">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <HomeClient jobs={formattedJobs} />
          <div className="p-5">
            <a href="/jobs" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
              Explore All Opportunities →
            </a>
          </div>
        </div>
      </section>

      <JobAds />
      <Categories />
      <EmployerBanner />
      <CareerResources />
      <TrustSection />
      <Testimonials />
      <FeedbackSection />
      <FeedbackWidget />
    </main>
  );
}

import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";
import StatsHeader from "./components/StatsHeader";

export const dynamic = "force-dynamic";

function timeAgo(input?: string | number): string {
  if (!input) return "";
  const date = new Date(input);
  if (isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "1 day ago" : `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  let remoteJobs = [];
  try {
    const res = await fetch("https://remoteok.com/api", { cache: 'no-store' });
    const data = await res.json();
    remoteJobs = Array.isArray(data) ? data.slice(1, 20) : [];
    remoteJobs = remoteJobs.map((job: any) => ({
      ...job,
      timeAgo: timeAgo(job.date),
    }));
  } catch (error) {
    console.error("Failed to fetch remote jobs:", error);
  }

  let localJobs = [];
  try {
    localJobs = await prisma.job.findMany({
      where: { 
        expiresAt: { gt: new Date() },
        isApproved: true
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch local jobs:", error);
  }

  const formattedLocalJobs = localJobs.map((job) => ({
    id: job.id,
    position: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    url: job.applyUrl,
    employmentType: job.employmentType,
    tags: ["Local", "Featured"],
    verified: true,
    timeAgo: timeAgo((job.publishedAt || job.createdAt).getTime()),
  }));

  const allJobs = [...formattedLocalJobs, ...remoteJobs];

  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";
  
  const filteredJobs = allJobs.filter((job) => {
    return (
      job.position?.toLowerCase().includes(searchQuery) ||
      job.company?.toLowerCase().includes(searchQuery) ||
      job.location?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <main className="min-h-screen">
      
      {/* Sticky Stats Header */}
      <StatsHeader 
        title="Latest Jobs" 
        subtitle="Discover remote and local opportunities" 
        count={allJobs.length} 
        countLabel="Active Jobs"
        showSocialButton
      />

      {/* Main Two-Column Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Jobs List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <HomeClient jobs={filteredJobs} />
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-36 h-fit">
            
            {/* Sidebar Box 1: Featured Talent */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Talent</h3>
              <p className="text-sm text-gray-600 mb-4">
                Looking to hire? Browse our pool of pre-vetted candidates ready to work.
              </p>
              <a href="/talent" className="block text-center w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition">
                Browse Talent Pool
              </a>
            </div>

            {/* Sidebar Box 2: Post a Job */}
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
    </main>
  );
}

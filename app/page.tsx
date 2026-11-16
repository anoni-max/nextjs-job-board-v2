import HomeClient from "./HomeClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Notice we defined searchParams as a Promise
export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  let remoteJobs = [];
  try {
    const res = await fetch("https://remoteok.com/api", { cache: 'no-store' });
    const data = await res.json();
    remoteJobs = Array.isArray(data) ? data.slice(1, 20) : [];
  } catch (error) {
    console.error("Failed to fetch remote jobs:", error);
  }

  let localJobs = [];
  try {
    localJobs = await prisma.job.findMany({
      where: { expiresAt: { gt: new Date() } },
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
    tags: ["Local", "Featured"],
  }));

  const allJobs = [...formattedLocalJobs, ...remoteJobs];

  // THIS IS THE FIX: We must await the searchParams in Next.js 15
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
      <section className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Latest Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">Discover remote and local opportunities</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <HomeClient jobs={filteredJobs} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
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
    </main>
  );
}
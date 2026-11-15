import HomeClient from "./HomeClient";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function Home() {
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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Find your next <span className="text-blue-300">dream job</span>.
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Discover thousands of remote and local opportunities. Your future starts here.
          </p>
          
          {/* The search bar lives here visually via the HomeClient */}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-3xl mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
           <HomeClient jobs={allJobs} />
        </div>
      </section>
    </main>
  );
}
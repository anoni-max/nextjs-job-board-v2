import HomeClient from "./HomeClient";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function Home() {
  // 1. Fetch Remote Jobs
  let remoteJobs = [];
  try {
    const res = await fetch("https://remoteok.com/api", { cache: 'no-store' });
    const data = await res.json();
    remoteJobs = Array.isArray(data) ? data.slice(1, 20) : [];
  } catch (error) {
    console.error("Failed to fetch remote jobs:", error);
  }

  // 2. Fetch Local Jobs from Database (bypassing cache)
  let localJobs = [];
  try {
    localJobs = await prisma.job.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch local jobs:", error);
  }

  // 3. Format Local Jobs to match RemoteOK
  const formattedLocalJobs = localJobs.map((job) => ({
    id: job.id,
    position: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    url: job.applyUrl,
    tags: ["Local", "Featured"],
  }));

  // 4. Combine them
  const allJobs = [...formattedLocalJobs, ...remoteJobs];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Jobs</h1>
        <HomeClient jobs={allJobs} />
      </div>
    </main>
  );
}
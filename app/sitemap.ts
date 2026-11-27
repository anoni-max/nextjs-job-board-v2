import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Always regenerate so new jobs appear immediately
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kazispot.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/talent`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/join-talent`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/post`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/career-toolkit`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/trust`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  let jobUrls: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job.findMany({
      where: { isApproved: true, rejected: false, expiresAt: { gt: new Date() } },
      select: { id: true, updatedAt: true },
    });
    jobUrls = jobs.map((j) => ({
      url: `${baseUrl}/jobs/${j.id}`,
      lastModified: j.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.error("sitemap: failed to fetch jobs", e);
  }

  return [...staticPages, ...jobUrls];
}

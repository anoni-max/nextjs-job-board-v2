import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJobs } from "@/lib/match";

export const dynamic = "force-dynamic";

function truncate(s?: string | null, max = 150): string {
  if (!s) return "";
  const t = s.trim();
  return t.length > max ? t.slice(0, max) + "..." : t;
}

function sinceFor(time: string): Date | null {
  const now = Date.now();
  if (time === "today") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (time === "24h") return new Date(now - 24 * 3600 * 1000);
  if (time === "48h") return new Date(now - 48 * 3600 * 1000);
  if (time === "week") return new Date(now - 7 * 24 * 3600 * 1000);
  return null; // "all"
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const time = url.searchParams.get("time") || "week";

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return NextResponse.json({ error: "Please create your profile first" }, { status: 400 });
  }

  const hidden = await prisma.jobFeedback.findMany({
    where: { userId: user.id, rating: "not-relevant" },
    select: { jobId: true },
  });
  const hiddenIds = new Set(hidden.map((h) => h.jobId));

  const where: any = {
    isApproved: true,
    rejected: false,
    expiresAt: { gt: new Date() },
  };
  if (hiddenIds.size > 0) {
    where.id = { notIn: Array.from(hiddenIds) };
  }

  const since = sinceFor(time);
  if (since) {
    where.createdAt = { gte: since };
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  if (jobs.length === 0) {
    return NextResponse.json({ matches: [], scanned: 0, time });
  }

  const profileSummary = {
    education: profile.education,
    qualifications: profile.qualifications,
    workExperience: profile.workExperience,
    skills: profile.skills,
    certifications: profile.certifications,
    preferredIndustries: profile.preferredIndustries,
    preferredTitles: profile.preferredTitles,
    preferredLocations: profile.preferredLocations,
    preferredCountries: profile.preferredCountries,
    expectedSalary: profile.expectedSalary,
    employmentType: profile.employmentType,
    workPreference: profile.workPreference,
  };

  const jobList = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    salary: j.salary,
    employmentType: j.employmentType,
    qualifications: truncate(j.qualifications, 100),
    responsibilities: truncate(j.responsibilities, 100),
    description: truncate(j.description, 150),
    expiresAt: j.expiresAt,
  }));

  let scored;
  try {
    scored = await scoreJobs(profileSummary, jobList);
  } catch (e: any) {
    console.error("Matching failed:", e);
    return NextResponse.json(
      { error: "Matching failed: " + (e?.message || "Unknown error") },
      { status: 502 }
    );
  }

  const scoreMap = new Map(scored.map((s) => [s.jobId, s]));

  const combined = jobs
    .map((j) => {
      const s = scoreMap.get(j.id);
      return {
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        salary: j.salary,
        employmentType: j.employmentType,
        expiresAt: j.expiresAt,
        applyUrl: j.applyUrl,
        applyEmail: j.applyEmail,
        score: s ? s.score : 0,
        reasons: s ? s.reasons : "",
      };
    })
    .filter((j) => j.score >= 40)
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ matches: combined, scanned: jobs.length, time });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJobs } from "@/lib/match";

export const dynamic = "force-dynamic";

const STOPWORDS = new Set([
  "and", "the", "with", "for", "that", "this", "are", "you",
  "have", "has", "was", "were", "can", "will", "from", "into",
  "their", "there", "your", "not", "but",
]);

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
  return null;
}

function extractKeywords(profile: any): string[] {
  const raw = [
    profile.skills,
    profile.preferredTitles,
    profile.preferredIndustries,
    profile.qualifications,
    profile.education,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return Array.from(
    new Set(
      raw
        .split(/[^a-z0-9+#]+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
    )
  );
}

function keywordScore(job: any, keywords: string[]): number {
  const text = `${job.title} ${job.description} ${job.qualifications} ${job.responsibilities} ${job.company}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) score += 1;
  }
  return score;
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

  // ---- Step 1: fast keyword pre-filter (no AI) ----
  const keywords = extractKeywords(profile);
  let candidates: any[] = [];

  if (keywords.length > 0) {
    const scored = jobs.map((j) => ({ j, k: keywordScore(j, keywords) }));
    const matched = scored.filter((s) => s.k > 0).sort((a, b) => b.k - a.k);
    candidates = matched.slice(0, 15).map((s) => s.j);

    // Fill up to 15 with the newest jobs if we have too few matches
    if (candidates.length < 15) {
      const ids = new Set(candidates.map((j) => j.id));
      for (const j of jobs) {
        if (!ids.has(j.id)) {
          candidates.push(j);
          ids.add(j.id);
        }
        if (candidates.length >= 15) break;
      }
    }
  } else {
    candidates = jobs.slice(0, 15);
  }

  // ---- Step 2: AI semantic scoring on just those candidates ----
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

  const jobList = candidates.map((j) => ({
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

  const combined = candidates
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

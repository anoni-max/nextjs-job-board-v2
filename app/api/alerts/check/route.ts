import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJobs } from "@/lib/match";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Please create your profile first" }, { status: 400 });

  const jobs = await prisma.job.findMany({
    where: { isApproved: true, rejected: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (jobs.length === 0) return NextResponse.json({ created: 0 });

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
    qualifications: j.qualifications,
    responsibilities: j.responsibilities,
    description: j.description,
    expiresAt: j.expiresAt,
  }));

  let scored;
  try {
    scored = await scoreJobs(profileSummary, jobList);
  } catch (e) {
    console.error("Matching failed:", e);
    return NextResponse.json({ error: "Matching failed. Please try again." }, { status: 502 });
  }

  const scoreMap = new Map(scored.map((s) => [s.jobId, s]));

  const existing = await prisma.notification.findMany({
    where: { userId: user.id },
    select: { jobId: true },
  });
  const notifiedIds = new Set(existing.map((n) => n.jobId).filter(Boolean));

  let created = 0;
  for (const job of jobs) {
    const s = scoreMap.get(job.id);
    if (!s || s.score < 70) continue;
    if (notifiedIds.has(job.id)) continue;

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `${Math.round(s.score)}% match: ${job.title}`,
        message: `${job.company} — ${job.location}`,
        jobId: job.id,
      },
    });
    created++;
  }

  return NextResponse.json({ created });
}

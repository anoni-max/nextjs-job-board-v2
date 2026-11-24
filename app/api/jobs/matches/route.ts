import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJobs } from "@/lib/match";

export const dynamic = "force-dynamic";

export async function GET() {
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

  const jobs = await prisma.job.findMany({
    where: { isApproved: true, rejected: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (jobs.length === 0) {
    return NextResponse.json({ matches: [] });
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
    .filter((j) => j.score > 0)
    .sort((a, b) => b.score - a.score);

  return NextResponse.json({ matches: combined });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  return NextResponse.json(profile || null);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));

  const data = {
    education: body.education || null,
    qualifications: body.qualifications || null,
    workExperience: body.workExperience || null,
    skills: body.skills || null,
    certifications: body.certifications || null,
    preferredIndustries: body.preferredIndustries || null,
    preferredTitles: body.preferredTitles || null,
    preferredLocations: body.preferredLocations || null,
    preferredCountries: body.preferredCountries || null,
    expectedSalary: body.expectedSalary || null,
    employmentType: body.employmentType || null,
    workPreference: body.workPreference || null,
    cvConsent: Boolean(body.cvConsent),
  };

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });

  return NextResponse.json(profile);
}

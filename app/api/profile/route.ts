import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function ensureUser(email: string, name?: string | null, image?: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: {
      name: name ?? undefined,
      image: image ?? undefined,
    },
    create: {
      email,
      name: name ?? null,
      image: image ?? null,
    },
  });
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await ensureUser(session.user.email, session.user.name, session.user.image);
    const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
    return NextResponse.json(profile || null);
  } catch (e) {
    console.error("Profile GET failed:", e);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const user = await ensureUser(session.user.email, session.user.name, session.user.image);

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
  } catch (e) {
    console.error("Profile POST failed:", e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}

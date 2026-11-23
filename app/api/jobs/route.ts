import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, company, location, description, applyUrl, applyEmail, expiresInDays } = body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(expiresInDays));

    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        location,
        description,
        applyUrl: applyUrl || "",
        applyEmail: applyEmail || null,
        expiresAt,
        isApproved: true,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}

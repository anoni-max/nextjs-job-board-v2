import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      company,
      location,
      description,
      applyUrl,
      salary,
      employmentType,
      positions,
      qualifications,
      responsibilities,
      deadline,
    } = body;

    const data: any = {
      title,
      company,
      location,
      description,
      applyUrl,
      salary: salary || null,
      employmentType: employmentType || null,
      positions: positions || null,
      qualifications: qualifications || null,
      responsibilities: responsibilities || null,
    };

    if (deadline) {
      const d = new Date(deadline);
      if (!isNaN(d.getTime())) data.expiresAt = d;
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

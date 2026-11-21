import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { isApproved: true, marketed: false },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

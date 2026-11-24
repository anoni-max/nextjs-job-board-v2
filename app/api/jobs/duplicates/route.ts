import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const flagged = await prisma.job.findMany({
      where: {
        rejected: false,
        isApproved: false,
        duplicateStatus: { in: ["confirmed", "pending"] },
      },
      orderBy: { duplicateScore: "desc" },
    });

    const matchedIds = flagged
      .map((j) => j.duplicateOfId)
      .filter((id): id is string => !!id);

    const matchedJobs = await prisma.job.findMany({ where: { id: { in: matchedIds } } });
    const matchedMap = new Map(matchedJobs.map((m) => [m.id, m]));

    const result = flagged.map((f) => ({
      ...f,
      matchedJob: f.duplicateOfId ? matchedMap.get(f.duplicateOfId) || null : null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch duplicates:", error);
    return NextResponse.json({ error: "Failed to fetch duplicates" }, { status: 500 });
  }
}

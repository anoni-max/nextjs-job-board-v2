import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rejected = await prisma.job.findMany({
      where: { rejected: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(rejected);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rejected jobs" }, { status: 500 });
  }
}

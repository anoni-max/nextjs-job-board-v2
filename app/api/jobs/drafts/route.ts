import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const drafts = await prisma.job.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(drafts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 });
  }
}
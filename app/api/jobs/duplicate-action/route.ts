import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action } = body;
  if (!id || !action) {
    return NextResponse.json({ error: "id and action are required" }, { status: 400 });
  }

  try {
    if (action === "confirm" || action === "reject") {
      await prisma.job.update({
        where: { id },
        data: { rejected: true },
      });
    } else if (action === "not-duplicate" || action === "keep-both") {
      await prisma.job.update({
        where: { id },
        data: {
          duplicateStatus: "none",
          duplicateScore: null,
          duplicateOfId: null,
          duplicateReasons: null,
        },
      });
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Duplicate action failed:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

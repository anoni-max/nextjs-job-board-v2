import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const jobId = body?.jobId;
  const rating = body?.rating; // "relevant" | "not-relevant"

  if (!jobId || !rating) {
    return NextResponse.json({ error: "jobId and rating required" }, { status: 400 });
  }

  await prisma.jobFeedback.upsert({
    where: { userId_jobId: { userId: user.id, jobId } },
    update: { rating },
    create: { userId: user.id, jobId, rating },
  });

  return NextResponse.json({ ok: true });
}

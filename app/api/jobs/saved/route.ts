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

  const saved = await prisma.savedJob.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const jobIds = saved.map((s) => s.jobId);
  const jobs = jobIds.length ? await prisma.job.findMany({ where: { id: { in: jobIds } } }) : [];
  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  const result = saved
    .map((s) => jobMap.get(s.jobId))
    .filter((j) => j)
    .map((j) => ({
      id: j!.id,
      title: j!.title,
      company: j!.company,
      location: j!.location,
      salary: j!.salary,
      employmentType: j!.employmentType,
      expiresAt: j!.expiresAt,
      applyUrl: j!.applyUrl,
      applyEmail: j!.applyEmail,
    }));

  return NextResponse.json({ jobs: result });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const jobId = body?.jobId;
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  await prisma.savedJob.deleteMany({ where: { userId: user.id, jobId } });
  return NextResponse.json({ ok: true });
}

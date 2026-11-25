import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

function sanitize(s: string): string {
  return s.replace(/<[^>]*>/g, "").trim();
}

// GET: public (approved only), or admin=1 (all)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = url.searchParams.get("admin") === "1";

  if (admin) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const items = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items });
  }

  const items = await prisma.feedback.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

// POST: submit feedback (public)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // Honeypot spam protection
  if (body.website) return NextResponse.json({ ok: true });

  const name = sanitize(String(body.name || ""));
  const comment = sanitize(String(body.comment || ""));
  const ratingRaw = Number(body.rating);

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!comment) return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  if (name.length > 100) return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  if (comment.length > 1000) return NextResponse.json({ error: "Comment is too long" }, { status: 400 });

  const rating = ratingRaw >= 1 && ratingRaw <= 5 ? Math.round(ratingRaw) : null;

  // Simple duplicate protection: same name + comment in the last 5 minutes
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const dup = await prisma.feedback.findFirst({
    where: { name, comment, createdAt: { gte: fiveMinAgo } },
  });
  if (dup) return NextResponse.json({ error: "Duplicate submission detected" }, { status: 400 });

  await prisma.feedback.create({
    data: { name, comment, rating, approved: false },
  });

  return NextResponse.json({ ok: true });
}

// PATCH: approve / reject (admin)
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id, approved } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.feedback.update({
    where: { id },
    data: { approved: Boolean(approved) },
  });
  return NextResponse.json({ ok: true });
}

// DELETE: remove (admin)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.feedback.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

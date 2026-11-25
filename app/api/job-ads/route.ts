import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

function toDate(s?: string, endOfDay = false): Date | null {
  if (!s) return null;
  const d = new Date(`${s}T${endOfDay ? "23:59:59" : "00:00:00"}`);
  return isNaN(d.getTime()) ? null : d;
}

function eligibleWhere(placement?: string) {
  const now = new Date();
  const w: any = {
    active: true,
    AND: [
      { OR: [{ startDate: null }, { startDate: { lte: now } }] },
      { OR: [{ expiryDate: null }, { expiryDate: { gte: now } }] },
    ],
  };
  if (placement) w.placement = placement;
  return w;
}

// GET: public (eligible), or admin=1 (all)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = url.searchParams.get("admin") === "1";
  const placement = url.searchParams.get("placement") || "";

  if (admin) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ads = await prisma.jobAd.findMany({ orderBy: [{ priority: "desc" }, { createdAt: "desc" }] });
    return NextResponse.json({ ads });
  }

  const where = eligibleWhere(placement || undefined);
  const ads = await prisma.jobAd.findMany({
    where,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ads });
}

// POST: create (admin)
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));

  if (!body.imageData || typeof body.imageData !== "string") {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }
  if (body.imageData.length > 4_000_000) {
    return NextResponse.json({ error: "Image is too large (max ~3MB)" }, { status: 400 });
  }

  const ad = await prisma.jobAd.create({
    data: {
      imageData: body.imageData,
      caption: body.caption || null,
      title: body.title || null,
      description: body.description || null,
      applyUrl: body.applyUrl || null,
      placement: body.placement || "homepage",
      priority: Number(body.priority) || 0,
      startDate: toDate(body.startDate, false),
      expiryDate: toDate(body.expiryDate, true),
      active: true,
    },
  });

  return NextResponse.json(ad);
}

// PATCH: update / activate / deactivate (admin)
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const data: any = {};
  if (body.imageData !== undefined) data.imageData = body.imageData;
  if (body.caption !== undefined) data.caption = body.caption || null;
  if (body.title !== undefined) data.title = body.title || null;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.applyUrl !== undefined) data.applyUrl = body.applyUrl || null;
  if (body.placement !== undefined) data.placement = body.placement;
  if (body.priority !== undefined) data.priority = Number(body.priority) || 0;
  if (body.startDate !== undefined) data.startDate = toDate(body.startDate, false);
  if (body.expiryDate !== undefined) data.expiryDate = toDate(body.expiryDate, true);
  if (body.active !== undefined) data.active = Boolean(body.active);

  const ad = await prisma.jobAd.update({ where: { id }, data });
  return NextResponse.json(ad);
}

// DELETE: remove (admin)
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  await prisma.jobAd.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

// GET: public (active only), or admin=1 (all)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = url.searchParams.get("admin") === "1";

  if (admin) {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ads = await prisma.jobAd.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ ads });
  }

  const ads = await prisma.jobAd.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ads });
}

// POST: create (admin)
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { imageData, caption, applyUrl } = body;

  if (!imageData || typeof imageData !== "string") {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }
  if (imageData.length > 4_000_000) {
    return NextResponse.json({ error: "Image is too large (max ~3MB)" }, { status: 400 });
  }

  const ad = await prisma.jobAd.create({
    data: {
      imageData,
      caption: caption || null,
      applyUrl: applyUrl || null,
      active: true,
    },
  });

  return NextResponse.json(ad);
}

// PATCH: update / activate / deactivate (admin)
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { id, imageData, caption, applyUrl, active } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const data: any = {};
  if (imageData !== undefined) data.imageData = imageData;
  if (caption !== undefined) data.caption = caption || null;
  if (applyUrl !== undefined) data.applyUrl = applyUrl || null;
  if (active !== undefined) data.active = Boolean(active);

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

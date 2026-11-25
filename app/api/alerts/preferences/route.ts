import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function ensureUser(email: string, name?: string | null, image?: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: { name: name ?? undefined, image: image ?? undefined },
    create: { email, name: name ?? null, image: image ?? null },
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await ensureUser(session.user.email, session.user.name, session.user.image);
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  return NextResponse.json({
    alertFrequency: profile?.alertFrequency || "daily",
    emailAlerts: profile?.emailAlerts || false,
    whatsappAlerts: profile?.whatsappAlerts || false,
    whatsappNumber: profile?.whatsappNumber || "",
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await ensureUser(session.user.email, session.user.name, session.user.image);
  const body = await req.json().catch(() => ({}));

  const data = {
    alertFrequency: body.alertFrequency || "daily",
    emailAlerts: Boolean(body.emailAlerts),
    whatsappAlerts: Boolean(body.whatsappAlerts),
    whatsappNumber: body.whatsappNumber || null,
  };

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });

  return NextResponse.json({ ok: true });
}

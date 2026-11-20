import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJobEmail } from "@/lib/fikra";

interface IncomingEmail {
  from?: string;
  subject?: string;
  body?: string;
  messageId?: string;
  receivedAt?: string;
}

const DEFAULT_EXPIRY_DAYS = 30;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-auto-post-secret");
  if (!secret || secret !== process.env.AUTO_POST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let email: IncomingEmail;
  try {
    email = (await req.json()) as IncomingEmail;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!email.body || email.body.trim().length === 0) {
    return NextResponse.json({ error: "Empty email body" }, { status: 400 });
  }

  if (email.messageId) {
    const existing = await prisma.job.findUnique({
      where: { sourceEmailId: email.messageId },
    });
    if (existing) {
      return NextResponse.json({ skipped: true, reason: "duplicate" });
    }
  }

  const rawText = [
    email.subject ? `Subject: ${email.subject}` : "",
    email.from ? `From: ${email.from}` : "",
    "",
    email.body,
  ].join("\n");

  let parsed;
  try {
    parsed = await parseJobEmail(rawText);
  } catch (e) {
    console.error("AI parse failed:", e);
    return NextResponse.json({ error: "AI parse failed" }, { status: 502 });
  }

  if (!parsed || parsed.isJob === false || !parsed.title || !parsed.company) {
    return NextResponse.json({ skipped: true, reason: "not-a-job" });
  }

  const job = await prisma.job.create({
    data: {
      title: parsed.title,
      company: parsed.company,
      location: parsed.location || "Remote",
      description: parsed.description || "",
      applyUrl: parsed.applyUrl || "",
      expiresAt: new Date(Date.now() + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      salary: parsed.salary || null,
      employmentType: parsed.employmentType || null,
      sourceEmailId: email.messageId || null,
      rawEmail: rawText,
      isApproved: false,
      rejected: false,
    },
  });

  return NextResponse.json({ created: true, jobId: job.id, title: job.title });
}

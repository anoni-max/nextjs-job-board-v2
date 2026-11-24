import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJobEmail } from "@/lib/fikra";
import { detectDuplicate, normalizeCompany } from "@/lib/duplicate";
import { getDuplicateThresholds } from "@/lib/settings";

interface IncomingEmail {
  from?: string;
  subject?: string;
  body?: string;
  messageId?: string;
  receivedAt?: string;
}

const DEFAULT_EXPIRY_DAYS = 30;

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

async function findCandidateJobs(title: string, company: string) {
  const normCompany = normalizeCompany(company);
  const companyToken = normCompany.split(" ")[0] || "";
  const titleToken = (title || "").split(/\s+/)[0] || "";

  const or: any[] = [];
  if (normCompany) or.push({ companyNormalized: normCompany });
  if (companyToken) or.push({ company: { contains: companyToken, mode: "insensitive" } });
  if (titleToken) or.push({ title: { contains: titleToken, mode: "insensitive" } });

  if (or.length === 0) return [];

  try {
    return await prisma.job.findMany({
      where: { rejected: false, OR: or },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Candidate search failed:", e);
    return [];
  }
}

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

  const deadline = parseDate(parsed.deadline);
  const title = parsed.title;
  const company = parsed.company;
  const location = parsed.location || "Kenya";
  const description = parsed.description || "";
  const applyUrl = parsed.applyUrl || "";
  const applyEmail = parsed.applyEmail || null;

  const thresholds = await getDuplicateThresholds();

  // ---- Duplicate detection ----
  let duplicateScore: number | null = null;
  let duplicateOfId: string | null = null;
  let duplicateReasons: string | null = null;
  let duplicateStatus = "none";

  const candidates = await findCandidateJobs(title, company);

  if (candidates.length > 0) {
    let best: { id: string; score: number; reasons: string } | null = null;
    for (const cand of candidates) {
      try {
        const result = await detectDuplicate(
          { title, company, location, description, applyUrl },
          {
            title: cand.title,
            company: cand.company,
            location: cand.location,
            description: cand.description,
            applyUrl: cand.applyUrl,
          }
        );
        if (!best || result.score > best.score) {
          best = { id: cand.id, score: result.score, reasons: result.reasons };
        }
        if (best && best.score >= 98) break;
      } catch (e) {
        console.error("Duplicate comparison failed:", e);
      }
    }

    if (best && best.score >= thresholds.pending) {
      duplicateScore = best.score;
      duplicateOfId = best.id;
      duplicateReasons = best.reasons;
      duplicateStatus = best.score >= thresholds.confirm ? "confirmed" : "pending";
    }
  }

  const job = await prisma.job.create({
    data: {
      title,
      company,
      location,
      description,
      applyUrl,
      applyEmail,
      expiresAt: deadline || new Date(Date.now() + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      salary: parsed.salary || null,
      employmentType: parsed.employmentType || null,
      positions: parsed.positions || null,
      postedDate: parseDate(parsed.postedDate),
      qualifications: parsed.qualifications || null,
      responsibilities: parsed.responsibilities || null,
      sourceEmailId: email.messageId || null,
      rawEmail: rawText,
      isApproved: false,
      rejected: false,
      companyNormalized: normalizeCompany(company) || null,
      duplicateScore,
      duplicateOfId,
      duplicateReasons,
      duplicateStatus,
    },
  });

  return NextResponse.json({
    created: true,
    jobId: job.id,
    title: job.title,
    duplicateStatus,
    duplicateScore,
  });
}

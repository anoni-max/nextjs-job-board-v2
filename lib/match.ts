export interface ProfileSummary {
  education?: string | null;
  qualifications?: string | null;
  workExperience?: string | null;
  skills?: string | null;
  certifications?: string | null;
  preferredIndustries?: string | null;
  preferredTitles?: string | null;
  preferredLocations?: string | null;
  preferredCountries?: string | null;
  expectedSalary?: string | null;
  employmentType?: string | null;
  workPreference?: string | null;
}

export interface JobForMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  employmentType?: string | null;
  qualifications?: string | null;
  responsibilities?: string | null;
  description?: string | null;
  expiresAt: Date | string;
}

export interface MatchResult {
  jobId: string;
  score: number;
  reasons: string;
}

const BATCH_SIZE = 15;
const MAX_RETRIES = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(text: string): number {
  const m = text.match(/try again in ([\d.]+)s/);
  if (m) return Math.ceil(parseFloat(m[1]) * 1000);
  return 15000;
}

export async function scoreJobs(profile: ProfileSummary, jobs: JobForMatch[]): Promise<MatchResult[]> {
  const results: MatchResult[] = [];

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    const batchResults = await scoreBatch(profile, batch);
    results.push(...batchResults);

    if (i + BATCH_SIZE < jobs.length) {
      await sleep(1000);
    }
  }

  return results;
}

async function scoreBatch(profile: ProfileSummary, jobs: JobForMatch[], attempt = 0): Promise<MatchResult[]> {
  if (jobs.length === 0) return [];

  const baseUrl = (process.env.FIKRA_BASE_URL ?? "https://api.fikraapi.co.ke/v1").replace(/\/$/, "");
  const apiKey = process.env.FIKRA_API_KEY;
  // Use a DIFFERENT model than the email pipeline so they don't share the same rate limit
  const model = process.env.MATCH_MODEL || "qwen/qwen3.8-27b";

  if (!apiKey) throw new Error("FIKRA_API_KEY is not set");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a job matching engine. Given a candidate's profile and a list of jobs, score how well each job matches the profile from 0 to 100 using SEMANTIC matching (not just keywords). " +
            "Be strict and honest: give a high score (70+) only when the job genuinely fits the candidate's skills, qualifications, experience and preferences. " +
            "Give clearly unrelated jobs a low score (below 40) or 0. For example, a Procurement, Finance or Administrative role is NOT a match for an Electrical Technician profile. " +
            "Return ONLY valid JSON in this exact shape: {\"matches\": [{\"jobId\": \"...\", \"score\": 0-100, \"reasons\": \"short explanation\"}]}. " +
            "Consider qualifications, skills, experience, responsibilities, industry, location preference, employment type, salary expectation, and remote/onsite preference. " +
            "Do not present scores as a guarantee of employment.",
        },
        {
          role: "user",
          content: JSON.stringify({ profile, jobs }),
        },
      ],
      temperature: 0,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 && attempt < MAX_RETRIES) {
      const wait = parseRetryAfter(errText);
      await sleep(wait);
      return scoreBatch(profile, jobs, attempt + 1);
    }
    throw new Error(`Fikra error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const parsed = JSON.parse(cleaned);

  const matches = Array.isArray(parsed?.matches) ? parsed.matches : [];
  return matches
    .map((m: any) => ({
      jobId: String(m.jobId || ""),
      score: typeof m.score === "number" ? m.score : 0,
      reasons: typeof m.reasons === "string" ? m.reasons : "",
    }))
    .filter((m) => m.jobId);
}

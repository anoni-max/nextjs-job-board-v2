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

export async function scoreJobs(profile: ProfileSummary, jobs: JobForMatch[]): Promise<MatchResult[]> {
  const results: MatchResult[] = [];

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);
    const batchResults = await scoreBatch(profile, batch);
    results.push(...batchResults);

    if (i + BATCH_SIZE < jobs.length) {
      await sleep(500);
    }
  }

  return results;
}

async function scoreBatch(profile: ProfileSummary, jobs: JobForMatch[], attempt = 0): Promise<MatchResult[]> {
  if (jobs.length === 0) return [];

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.MATCH_MODEL || "gemini-2.5-flash";

  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const prompt =
    "You are a job matching engine. Given a candidate's profile and a list of jobs, score how well each job matches the profile from 0 to 100 using SEMANTIC matching (not just keywords). " +
    "Be strict and honest: give a high score (70+) only when the job genuinely fits the candidate's skills, qualifications, experience and preferences. " +
    "Give clearly unrelated jobs a low score (below 40) or 0. For example, a Procurement, Finance or Administrative role is NOT a match for an Electrical Technician profile. " +
    "Return ONLY valid JSON in this exact shape: {\"matches\": [{\"jobId\": \"...\", \"score\": 0-100, \"reasons\": \"short explanation\"}]}. " +
    "Consider qualifications, skills, experience, responsibilities, industry, location preference, employment type, salary expectation, and remote/onsite preference. " +
    "Do not present scores as a guarantee of employment.\n\n" +
    "Candidate profile and jobs:\n" +
    JSON.stringify({ profile, jobs });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 && attempt < MAX_RETRIES) {
      await sleep(20000);
      return scoreBatch(profile, jobs, attempt + 1);
    }
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
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

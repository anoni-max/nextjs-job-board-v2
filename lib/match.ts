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

export async function scoreJobs(profile: ProfileSummary, jobs: JobForMatch[]): Promise<MatchResult[]> {
  if (jobs.length === 0) return [];

  const baseUrl = (process.env.FIKRA_BASE_URL ?? "https://api.fikraapi.co.ke/v1").replace(/\/$/, "");
  const apiKey = process.env.FIKRA_API_KEY;
  const model = process.env.FIKRA_MODEL ?? "openai/gpt-oss-20b";

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
            "Return ONLY valid JSON in this exact shape: {\"matches\": [{\"jobId\": \"...\", \"score\": 0-100, \"reasons\": \"short explanation\"}]}. " +
            "Consider qualifications, skills, experience, responsibilities, industry, location preference, employment type, salary expectation, and remote/onsite preference. " +
            "A high score means a strong match. Do not present scores as a guarantee of employment.",
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
    const err = await res.text();
    throw new Error(`Fikra error ${res.status}: ${err}`);
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

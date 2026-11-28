export interface JobForCompare {
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
}

export interface DuplicateResult {
  score: number;
  reasons: string;
}

const MAX_RETRIES = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeCompany(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Scores ALL candidate jobs in ONE Gemini call (fast, no timeout)
export async function scoreDuplicateCandidates(
  incoming: JobForCompare,
  candidates: (JobForCompare & { id: string })[],
  attempt = 0
): Promise<{ id: string; score: number; reasons: string }[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.DUP_MODEL || "gemini-3.8-flash";

  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const prompt =
    "You compare a NEW job listing against a list of EXISTING job listings and decide which (if any) are duplicates of the new job. " +
    "Return ONLY valid JSON in this exact shape: {\"results\": [{\"id\": \"...\", \"score\": 0-100, \"reasons\": \"short explanation\"}]}. " +
    "Include a result ONLY for existing jobs that score 60 or above (omit clearly different jobs). " +
    "Consider employer name (including aliases and abbreviations), job title, location, description, and application URL. " +
    "Score 90-100 = very likely duplicate; 70-89 = possible duplicate; below 70 = different vacancy. " +
    "Be careful: similar titles (e.g. 'Electrical Technician' vs 'Electrical Maintenance Technician') are NOT automatically duplicates unless the employer, location and duties clearly match.\n\n" +
    "NEW JOB:\n" + JSON.stringify(incoming) + "\n\n" +
    "EXISTING JOBS:\n" + JSON.stringify(candidates);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0,
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429 && attempt < MAX_RETRIES) {
      await sleep(20000);
      return scoreDuplicateCandidates(incoming, candidates, attempt + 1);
    }
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  if (!cleaned) throw new Error("Gemini returned empty response");

  const parsed = JSON.parse(cleaned);
  const results = Array.isArray(parsed?.results) ? parsed.results : [];

  return results
    .map((r: any) => ({
      id: String(r.id || ""),
      score: typeof r.score === "number" ? r.score : 0,
      reasons: typeof r.reasons === "string" ? r.reasons : "",
    }))
    .filter((r) => r.id);
}

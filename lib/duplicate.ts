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

export function normalizeCompany(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function detectDuplicate(
  incoming: JobForCompare,
  existing: JobForCompare
): Promise<DuplicateResult> {
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
            "You compare two job listings and decide if they are duplicates. " +
            "Return ONLY valid JSON with keys: score (number 0-100) and reasons (string, 1-2 short sentences explaining why). " +
            "Consider employer name (including aliases and abbreviations), job title, location, description, and application URL. " +
            "Score 90-100 = very likely duplicate; 70-89 = possible duplicate; below 70 = different vacancies. " +
            "Be careful: similar titles (e.g. 'Electrical Technician' vs 'Electrical Maintenance Technician') are NOT automatically duplicates unless the employer, location and duties clearly match.",
        },
        {
          role: "user",
          content: JSON.stringify({
            jobA: incoming,
            jobB: existing,
          }),
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

  return {
    score: typeof parsed.score === "number" ? parsed.score : 0,
    reasons: typeof parsed.reasons === "string" ? parsed.reasons : "",
  };
}

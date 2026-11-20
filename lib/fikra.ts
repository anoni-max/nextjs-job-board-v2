export interface ParsedJob {
  isJob: boolean;
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  salary?: string;
  employmentType?: string;
  positions?: string;
  postedDate?: string;
  deadline?: string;
  qualifications?: string;
  responsibilities?: string;
  applyUrl?: string;
}

export async function parseJobEmail(rawText: string): Promise<ParsedJob> {
  const baseUrl = (process.env.FIKRA_BASE_URL ?? "https://api.fikraapi.co.ke/v1").replace(/\/$/, "");
  const apiKey = process.env.FIKRA_API_KEY;
  const model = process.env.FIKRA_MODEL ?? "deepseek-v4-1-flash-economy-free";

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
            "You extract structured data from job-alert emails. " +
            "Return ONLY valid JSON with these keys: " +
            "isJob (boolean), title (string), company (string), location (string), " +
            "description (string, a 1-2 sentence overview of the role), " +
            "salary (string or empty), " +
            "employmentType (string, e.g. 'Permanent, On-site' or 'Contract, Remote', or empty), " +
            "positions (string, the number of openings if mentioned, or empty), " +
            "postedDate (ISO date YYYY-MM-DD if mentioned, or empty), " +
            "deadline (ISO date YYYY-MM-DD if mentioned, or empty), " +
            "qualifications (string, newline-separated list, each line starting with '- ', or empty), " +
            "responsibilities (string, newline-separated list, each line starting with '- ', or empty), " +
            "applyUrl (string or empty). " +
            "Strip out newsletter headers, footers, 'unsubscribe' links and boilerplate. " +
            'If the email is NOT a job posting, return {"isJob": false}.',
        },
        { role: "user", content: rawText },
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
  return JSON.parse(cleaned) as ParsedJob;
}

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
  applyEmail?: string;
}

const MAX_INPUT_CHARS = 4000;

export async function parseJobEmail(rawText: string): Promise<ParsedJob> {
  const baseUrl = (process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1").replace(/\/$/, "");
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  // Truncate long emails to save tokens (Groq free tier = 200k tokens/day)
  const trimmed = rawText.length > MAX_INPUT_CHARS ? rawText.slice(0, MAX_INPUT_CHARS) : rawText;

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
            "applyUrl (string or empty, the website link used to apply), " +
            "applyEmail (string or empty, the email address to send applications/CVs to; leave empty if applications go through a website link or no email is given). " +
            "Ignore the sender's own email, 'unsubscribe' addresses and newsletter/alert emails. " +
            "Strip out newsletter headers, footers, 'unsubscribe' links and boilerplate. " +
            'If the email is NOT a job posting, return {"isJob": false}.',
        },
        { role: "user", content: trimmed },
      ],
      temperature: 0,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content: string = data.choices?.[0]?.message?.content ?? "";
  const cleaned = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(cleaned) as ParsedJob;
}

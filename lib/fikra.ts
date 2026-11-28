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

const MAX_RETRIES = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function parseJobEmail(rawText: string, attempt = 0): Promise<ParsedJob> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.PARSE_MODEL || "gemini-2.0-flash";

  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const prompt =
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
    'If the email is NOT a job posting, return {"isJob": false}.\n\n' +
    "EMAIL TO PARSE:\n" +
    rawText;

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
      return parseJobEmail(rawText, attempt + 1);
    }
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  if (!cleaned) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(cleaned);
  if (parsed && typeof parsed.isJob !== "boolean") {
    parsed.isJob = true;
  }
  return parsed as ParsedJob;
}

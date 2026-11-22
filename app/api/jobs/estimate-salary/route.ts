import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { title, company, location, category, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const baseUrl = (process.env.FIKRA_BASE_URL ?? "https://api.groq.com/openai/v1").replace(/\/$/, "");
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
        messages: [
          {
            role: "system",
            content:
              "You estimate realistic monthly salary ranges for jobs in Kenya (in KES). " +
              "Given a job's title, company, location, category and description, " +
              "return ONLY a short salary range string like 'KSh 50,000 - 80,000' " +
              "(no extra words, no explanation). " +
              "Base it on typical Kenyan market rates for that role and experience level.",
          },
          {
            role: "user",
            content: `Title: ${title}\nCompany: ${company || "Unknown"}\nLocation: ${location || "Kenya"}\nCategory: ${category || "General"}\nDescription: ${(description || "").slice(0, 500)}`,
          },
        ],
        temperature: 0,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`AI error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    const estimate = content.trim().replace(/^["']|["']$/g, "");

    return NextResponse.json({ estimate });
  } catch (error) {
    console.error("Salary estimate failed:", error);
    return NextResponse.json({ error: "Failed to estimate salary" }, { status: 502 });
  }
}

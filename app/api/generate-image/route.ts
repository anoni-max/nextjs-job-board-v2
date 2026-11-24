import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function toDataUrl(res: Response): Promise<string | null> {
  const buffer = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type") || "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export async function POST(req: Request) {
  let prompt: string | undefined;
  try {
    const body = await req.json();
    prompt = body?.prompt;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.IMAGE_API_KEY;

  try {
    // ===== FREE mode (no key): Pollinations.ai =====
    if (!apiKey) {
      const url =
        "https://image.pollinations.ai/prompt/" +
        encodeURIComponent(prompt.trim()) +
        "?width=1024&height=1024&nologo=true&model=flux";

      const res = await fetch(url);
      if (!res.ok) {
        return NextResponse.json({ error: `Image API error ${res.status}` }, { status: 502 });
      }
      const dataUrl = await toDataUrl(res);
      if (!dataUrl) return NextResponse.json({ error: "No image returned" }, { status: 502 });
      return NextResponse.json({ imageUrl: dataUrl });
    }

    // ===== Paid/OpenAI-compatible mode (needs IMAGE_API_KEY) =====
    const baseUrl = (process.env.IMAGE_API_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.IMAGE_MODEL || "gpt-image-1";
    const size = process.env.IMAGE_SIZE || "1024x1024";

    const res = await fetch(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, prompt: prompt.trim(), n: 1, size }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Image API error:", res.status, errText);
      return NextResponse.json(
        { error: `Image API error ${res.status}: ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const item = data?.data?.[0];
    if (!item) return NextResponse.json({ error: "No image returned" }, { status: 502 });

    let dataUrl: string | null = null;
    if (item.b64_json) {
      dataUrl = `data:image/png;base64,${item.b64_json}`;
    } else if (item.url) {
      const imgRes = await fetch(item.url);
      if (!imgRes.ok) return NextResponse.json({ error: "Failed to download image" }, { status: 502 });
      dataUrl = await toDataUrl(imgRes);
    }

    if (!dataUrl) return NextResponse.json({ error: "No image data returned" }, { status: 502 });
    return NextResponse.json({ imageUrl: dataUrl });
  } catch (e) {
    console.error("Image generation failed:", e);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}

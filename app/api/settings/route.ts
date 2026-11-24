import { NextResponse } from "next/server";
import { getDuplicateThresholds, setSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const thresholds = await getDuplicateThresholds();
    return NextResponse.json(thresholds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const confirm = parseInt(String(body?.confirm ?? ""), 10);
  const pending = parseInt(String(body?.pending ?? ""), 10);

  if (isNaN(confirm) || isNaN(pending)) {
    return NextResponse.json({ error: "Thresholds must be numbers" }, { status: 400 });
  }
  if (confirm < 0 || confirm > 100 || pending < 0 || pending > 100) {
    return NextResponse.json({ error: "Thresholds must be between 0 and 100" }, { status: 400 });
  }
  if (pending > confirm) {
    return NextResponse.json({ error: "Pending threshold must be less than or equal to confirm threshold" }, { status: 400 });
  }

  try {
    await setSetting("duplicate.confirmThreshold", String(confirm));
    await setSetting("duplicate.pendingThreshold", String(pending));
    return NextResponse.json({ ok: true, confirm, pending });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the request (Security)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.AUTO_POST_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get the raw text
    const body = await req.json();
    const { rawText } = body;

    if (!rawText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    /* 
      TODO: In the next step, we will plug OpenAI in here to parse the rawText.
      For now, we will use a basic placeholder so you can test the flow.
    */
    const parsedJob = {
      title: "Test AI Job Title",
      company: "Test AI Company",
      location: "Remote",
      description: rawText, // We will dump the raw text for now
      applyUrl: "https://google.com",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isApproved: false, // Saved as a draft!
    };

    // 3. Save to Database
    const newJob = await prisma.job.create({
      data: parsedJob,
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });

  } catch (error) {
    console.error("Auto-post failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, skills, education, bio } = body;

    const newCandidate = await prisma.candidate.create({
      data: { name, email, phone, skills, education, bio },
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(candidates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
    console.error("Failed to fetch candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
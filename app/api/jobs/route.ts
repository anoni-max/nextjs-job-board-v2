import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

// This is the recommended way to use Prisma in Next.js development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, company, location, description, applyUrl, expiresInDays } = body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(expiresInDays));

    const newJob = await prisma.job.create({
      data: {
        title,
        company,
        location,
        description,
        applyUrl,
        expiresAt,
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error); // This will print the real error in Vercel
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
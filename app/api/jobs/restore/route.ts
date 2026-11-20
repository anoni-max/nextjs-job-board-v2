import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { rejected: false, isApproved: false },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ error: "Failed to restore" }, { status: 500 });
  }
}

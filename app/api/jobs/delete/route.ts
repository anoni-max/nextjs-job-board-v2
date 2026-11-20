import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

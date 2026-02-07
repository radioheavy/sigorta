import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const makes = await prisma.vehicleMake.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return NextResponse.json({ makes });
  } catch {
    return NextResponse.json({ makes: [] }, { status: 500 });
  }
}

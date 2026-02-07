import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const makeId = req.nextUrl.searchParams.get("makeId");
  if (!makeId) {
    return NextResponse.json({ error: "makeId required" }, { status: 400 });
  }

  try {
    const models = await prisma.vehicleModel.findMany({
      where: { makeId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, hsn: true, tsn: true },
    });
    return NextResponse.json({ models });
  } catch {
    return NextResponse.json({ models: [] }, { status: 500 });
  }
}

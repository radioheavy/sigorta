import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { vehicleLookupSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const hsn = req.nextUrl.searchParams.get("hsn") || "";
  const tsn = req.nextUrl.searchParams.get("tsn") || "";

  const parsed = vehicleLookupSchema.safeParse({ hsn, tsn });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ungültige HSN/TSN", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const vehicle = await prisma.vehicleModel.findFirst({
      where: { hsn: parsed.data.hsn, tsn: parsed.data.tsn },
      include: { make: { select: { id: true, name: true } } },
    });

    if (!vehicle) {
      return NextResponse.json({ vehicle: null }, { status: 404 });
    }

    return NextResponse.json({
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        hsn: vehicle.hsn,
        tsn: vehicle.tsn,
        makeId: vehicle.make.id,
        makeName: vehicle.make.name,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Datenbankfehler" },
      { status: 500 }
    );
  }
}

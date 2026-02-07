import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { generateTrackingId } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      trackingId: session.trackingId,
      vehicleData: session.vehicleData,
      driverData: session.driverData,
      insuranceType: session.insuranceType,
    });
  } catch {
    return NextResponse.json({ error: "Session-Fehler" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSession();

    // Create session if new
    if (!session.trackingId) {
      const trackingId = generateTrackingId();
      const dbSession = await prisma.session.create({
        data: {
          trackingId,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      session.trackingId = trackingId;
      session.sessionDbId = dbSession.id;
    }

    // Update vehicle data
    if (body.vehicleData) {
      session.vehicleData = body.vehicleData;
    }

    // Update driver data
    if (body.driverData) {
      session.driverData = body.driverData;
    }

    // Update insurance type
    if (body.insuranceType) {
      session.insuranceType = body.insuranceType;
    }

    await session.save();

    // Sync to DB
    if (session.sessionDbId) {
      await prisma.session.update({
        where: { id: session.sessionDbId },
        data: {
          vehicleData: session.vehicleData
            ? JSON.parse(JSON.stringify(session.vehicleData))
            : undefined,
          driverData: session.driverData
            ? JSON.parse(JSON.stringify(session.driverData))
            : undefined,
          insuranceType: session.insuranceType as "HAFTPFLICHT" | "TEILKASKO" | "VOLLKASKO" | undefined,
        },
      });
    }

    return NextResponse.json({
      trackingId: session.trackingId,
      success: true,
    });
  } catch (err) {
    console.error("Session error:", err);
    return NextResponse.json(
      { error: "Session konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}

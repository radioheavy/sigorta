import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { consentSchema } from "@/lib/validation";
import { hashIP, generateTrackingId } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({
      consent: session.consent || null,
    });
  } catch {
    return NextResponse.json({ consent: null }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = consentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Einwilligung" },
        { status: 400 }
      );
    }

    const session = await getSession();
    const trackingId = session.trackingId || generateTrackingId();

    const ipHash = hashIP(
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    );

    // Save consent to session
    session.consent = {
      necessary: parsed.data.necessary,
      functional: parsed.data.functional,
      analytics: parsed.data.analytics,
    };
    if (!session.trackingId) {
      session.trackingId = trackingId;
    }
    await session.save();

    // Save consent record to DB
    await prisma.consentRecord.create({
      data: {
        trackingId,
        necessary: parsed.data.necessary,
        functional: parsed.data.functional,
        analytics: parsed.data.analytics,
        ipHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Consent error:", err);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Einwilligung" },
      { status: 500 }
    );
  }
}

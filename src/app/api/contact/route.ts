import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { contactRequestSchema } from "@/lib/validation";
import { hashIP } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.sessionDbId || !session.trackingId) {
      return NextResponse.json(
        { error: "Keine aktive Session" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = contactRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Eingabe", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const ipHash = hashIP(
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    );

    const contact = await prisma.contactRequest.create({
      data: {
        sessionId: session.sessionDbId,
        tariffId: parsed.data.tariffId.startsWith("temp_")
          ? null
          : parsed.data.tariffId,
        channel: parsed.data.channel as "WHATSAPP" | "TELEGRAM" | "WEB_MESSENGER" | "EMAIL" | "PHONE",
        message: parsed.data.message,
        status: "PENDING",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        trackingId: session.trackingId,
        sessionId: session.sessionDbId,
        action: "CONTACT_REQUEST",
        details: {
          channel: parsed.data.channel,
          tariffId: parsed.data.tariffId,
        },
        ipHash,
      },
    });

    // CRM webhook (fire and forget)
    if (process.env.CRM_WEBHOOK_URL) {
      sendCrmWebhook(session.trackingId, contact.id, parsed.data.channel).catch(
        console.error
      );
    }

    return NextResponse.json({
      id: contact.id,
      success: true,
    });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Kontaktanfrage" },
      { status: 500 }
    );
  }
}

async function sendCrmWebhook(
  trackingId: string,
  contactId: string,
  channel: string,
  retries = 3
) {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, contactId, channel }),
      });
      if (res.ok) {
        await prisma.contactRequest.update({
          where: { id: contactId },
          data: { webhookSent: true },
        });
        return;
      }
    } catch {
      // retry with exponential backoff
    }
    await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
  }
}

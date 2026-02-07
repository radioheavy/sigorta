import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { messageSchema } from "@/lib/validation";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.sessionDbId) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.message.findMany({
      where: { sessionId: session.sessionDbId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        sender: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}

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
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ungültige Nachricht" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        sessionId: session.sessionDbId,
        sender: "user",
        content: parsed.data.content,
      },
    });

    // Auto-reply after brief delay (simulates advisor)
    setTimeout(async () => {
      try {
        await prisma.message.create({
          data: {
            sessionId: session.sessionDbId!,
            sender: "advisor",
            content:
              "Vielen Dank für Ihre Nachricht. Ein Berater wird sich in Kürze bei Ihnen melden. Ihre Tracking-ID: " +
              session.trackingId,
          },
        });
      } catch {
        // non-critical
      }
    }, 2000);

    return NextResponse.json({
      id: message.id,
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Senden der Nachricht" },
      { status: 500 }
    );
  }
}

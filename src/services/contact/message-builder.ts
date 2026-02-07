interface MessageContext {
  trackingId: string;
  vehicleName?: string;
  insuranceType?: string;
  provider?: string;
  monthlyPrice?: number;
  productName?: string;
}

export function buildContactMessage(ctx: MessageContext): string {
  const lines = [
    `Hallo, ich interessiere mich für eine KFZ-Versicherung.`,
    ``,
    `Tracking-ID: ${ctx.trackingId}`,
  ];

  if (ctx.vehicleName) {
    lines.push(`Fahrzeug: ${ctx.vehicleName}`);
  }

  if (ctx.insuranceType) {
    lines.push(`Versicherungsart: ${ctx.insuranceType}`);
  }

  if (ctx.provider && ctx.productName) {
    lines.push(`Angebot: ${ctx.provider} - ${ctx.productName}`);
  }

  if (ctx.monthlyPrice) {
    lines.push(
      `Monatspreis: ${ctx.monthlyPrice.toFixed(2).replace(".", ",")} €`
    );
  }

  lines.push(``);
  lines.push(`Bitte kontaktieren Sie mich für weitere Informationen.`);

  return lines.join("\n");
}

export function buildWhatsAppURL(phone: string, message: string): string {
  const cleaned = phone.replace(/[^+\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildTelegramURL(bot: string, message: string): string {
  return `https://t.me/${bot}?start=${encodeURIComponent(message)}`;
}

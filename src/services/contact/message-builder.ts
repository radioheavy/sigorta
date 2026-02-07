interface MessageContext {
  trackingId: string;
  vehicleName?: string;
  insuranceType?: string;
  provider?: string;
  monthlyPrice?: number;
  productName?: string;
}

interface MessageLabels {
  greeting: string;
  vehicleLabel: string;
  insuranceTypeLabel: string;
  offerLabel: string;
  monthlyPriceLabel: string;
  contactRequest: string;
}

const DEFAULT_LABELS: MessageLabels = {
  greeting: "Hallo, ich interessiere mich für eine KFZ-Versicherung.",
  vehicleLabel: "Fahrzeug",
  insuranceTypeLabel: "Versicherungsart",
  offerLabel: "Angebot",
  monthlyPriceLabel: "Monatspreis",
  contactRequest: "Bitte kontaktieren Sie mich für weitere Informationen.",
};

export function buildContactMessage(
  ctx: MessageContext,
  labels?: MessageLabels
): string {
  const t = labels || DEFAULT_LABELS;

  const lines = [
    t.greeting,
    ``,
    `Tracking-ID: ${ctx.trackingId}`,
  ];

  if (ctx.vehicleName) {
    lines.push(`${t.vehicleLabel}: ${ctx.vehicleName}`);
  }

  if (ctx.insuranceType) {
    lines.push(`${t.insuranceTypeLabel}: ${ctx.insuranceType}`);
  }

  if (ctx.provider && ctx.productName) {
    lines.push(`${t.offerLabel}: ${ctx.provider} - ${ctx.productName}`);
  }

  if (ctx.monthlyPrice) {
    lines.push(
      `${t.monthlyPriceLabel}: ${ctx.monthlyPrice.toFixed(2).replace(".", ",")} €`
    );
  }

  lines.push(``);
  lines.push(t.contactRequest);

  return lines.join("\n");
}

export function buildWhatsAppURL(phone: string, message: string): string {
  const cleaned = phone.replace(/[^+\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildTelegramURL(bot: string, message: string): string {
  return `https://t.me/${bot}?start=${encodeURIComponent(message)}`;
}

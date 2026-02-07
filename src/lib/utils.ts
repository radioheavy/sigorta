import { nanoid } from "nanoid";
import { createHash } from "crypto";

export function generateTrackingId(): string {
  return nanoid(12);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function formatPriceShort(price: number): string {
  return price.toFixed(2).replace(".", ",") + " €";
}

export function hashIP(ip: string): string {
  const salt = new Date().toISOString().slice(0, 10); // daily salt
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 16);
}

export function generateCacheKey(data: Record<string, unknown>): string {
  const sorted = JSON.stringify(data, Object.keys(data).sort());
  return createHash("md5").update(sorted).digest("hex");
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const locales = ["de", "tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export function isValidLocale(lang: string): lang is Locale {
  return locales.includes(lang as Locale);
}

import { z } from "zod";

export const vehicleLookupSchema = z.object({
  hsn: z.string().min(4).max(4),
  tsn: z.string().min(3).max(3),
});

export const vehicleInputSchema = z.object({
  makeId: z.string().min(1, "Marke ist erforderlich"),
  modelId: z.string().min(1, "Modell ist erforderlich"),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  engineType: z.enum([
    "BENZIN",
    "DIESEL",
    "ELEKTRO",
    "HYBRID",
    "PLUGIN_HYBRID",
    "LPG",
    "CNG",
  ]),
  registrationDate: z.string().min(1, "Erstzulassung ist erforderlich"),
  hsn: z.string().optional(),
  tsn: z.string().optional(),
});

export const driverInputSchema = z.object({
  age: z
    .number()
    .int()
    .min(18, "Mindestalter: 18 Jahre")
    .max(99, "Maximalalter: 99 Jahre"),
  experienceYears: z
    .number()
    .int()
    .min(0, "Mindestens 0 Jahre")
    .max(80, "Maximal 80 Jahre"),
  sfKlasse: z.string().min(1, "SF-Klasse ist erforderlich"),
});

export const insuranceInputSchema = z.object({
  insuranceType: z.enum(["HAFTPFLICHT", "TEILKASKO", "VOLLKASKO"]),
  deductible: z.number().int().min(0).max(2500).default(150),
});

export const tariffCompareSchema = z.object({
  vehicle: vehicleInputSchema,
  driver: driverInputSchema,
  insurance: insuranceInputSchema,
});

export const contactRequestSchema = z.object({
  tariffId: z.string().min(1),
  channel: z.enum(["WHATSAPP", "TELEGRAM", "WEB_MESSENGER", "EMAIL", "PHONE"]),
  message: z.string().optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const consentSchema = z.object({
  necessary: z.literal(true),
  functional: z.boolean(),
  analytics: z.boolean(),
});

export type VehicleInput = z.infer<typeof vehicleInputSchema>;
export type DriverInput = z.infer<typeof driverInputSchema>;
export type InsuranceInput = z.infer<typeof insuranceInputSchema>;
export type TariffCompareInput = z.infer<typeof tariffCompareSchema>;
export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;

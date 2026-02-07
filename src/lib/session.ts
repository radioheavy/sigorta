import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  trackingId?: string;
  sessionDbId?: string;
  vehicleData?: VehicleSessionData;
  driverData?: DriverSessionData;
  insuranceType?: string;
  consent?: ConsentData;
}

export interface VehicleSessionData {
  makeId?: string;
  makeName?: string;
  modelId?: string;
  modelName?: string;
  hsn?: string;
  tsn?: string;
  year?: number;
  engineType?: string;
  registrationDate?: string;
  deductible?: number;
}

export interface DriverSessionData {
  age?: number;
  experienceYears?: number;
  sfKlasse?: string;
}

export interface ConsentData {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

const SESSION_OPTIONS = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long_for_dev",
  cookieName: "sigorta_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24, // 24 hours
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

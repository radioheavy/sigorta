"use client";

import VehicleForm from "@/components/forms/VehicleForm";

export default function FahrzeugPage() {
  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          Fahrzeugdaten
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          Schritt 1 von 4 — Geben Sie Ihre Fahrzeugdaten ein
        </p>
      </div>
      <VehicleForm />
    </div>
  );
}

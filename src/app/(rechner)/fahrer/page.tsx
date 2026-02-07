"use client";

import DriverForm from "@/components/forms/DriverForm";

export default function FahrerPage() {
  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          Fahrerprofil
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          Schritt 2 von 4 — Geben Sie Ihre Fahrerinformationen ein
        </p>
      </div>
      <DriverForm />
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactPanel from "@/components/contact/ContactPanel";

function KontaktContent() {
  const searchParams = useSearchParams();
  const tariffId = searchParams.get("tariffId") || "";

  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          Kontakt
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          Schritt 4 von 4 — Kontaktieren Sie unseren Berater
        </p>
      </div>
      <ContactPanel tariffId={tariffId} />
    </div>
  );
}

export default function KontaktPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Laden...</div>}>
      <KontaktContent />
    </Suspense>
  );
}

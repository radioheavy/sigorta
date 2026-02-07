"use client";

import { usePathname } from "next/navigation";
import { use } from "react";
import Stepper from "@/components/ui/Stepper";
import { isValidLocale, type Locale } from "@/i18n/config";

// We need dict for stepper labels - pass via a simple mapping since this is a client component
const STEP_LABELS: Record<Locale, { vehicle: string; driver: string; results: string; contact: string; ariaLabel: string }> = {
  de: { vehicle: "Fahrzeug", driver: "Fahrer", results: "Ergebnis", contact: "Kontakt", ariaLabel: "Fortschritt" },
  tr: { vehicle: "Araç", driver: "Sürücü", results: "Sonuç", contact: "İletişim", ariaLabel: "İlerleme" },
  en: { vehicle: "Vehicle", driver: "Driver", results: "Results", contact: "Contact", ariaLabel: "Progress" },
};

function getCurrentStep(pathname: string): number {
  if (pathname.includes("/kontakt")) return 4;
  if (pathname.includes("/ergebnis")) return 3;
  if (pathname.includes("/fahrer")) return 2;
  return 1;
}

export default function RechnerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const pathname = usePathname();
  const currentStep = getCurrentStep(pathname);
  const locale = isValidLocale(lang) ? lang : "de";
  const labels = STEP_LABELS[locale];

  const steps = [
    { number: 1, label: labels.vehicle, href: `/${lang}/fahrzeug` },
    { number: 2, label: labels.driver, href: `/${lang}/fahrer` },
    { number: 3, label: labels.results, href: `/${lang}/ergebnis` },
    { number: 4, label: labels.contact, href: `/${lang}/kontakt` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Stepper steps={steps} currentStep={currentStep} ariaLabel={labels.ariaLabel} />
      </div>
      {children}
    </div>
  );
}

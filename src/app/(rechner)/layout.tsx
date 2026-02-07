"use client";

import { usePathname } from "next/navigation";
import Stepper from "@/components/ui/Stepper";

const STEPS = [
  { number: 1, label: "Fahrzeug", href: "/fahrzeug" },
  { number: 2, label: "Fahrer", href: "/fahrer" },
  { number: 3, label: "Ergebnis", href: "/ergebnis" },
  { number: 4, label: "Kontakt", href: "/kontakt" },
];

function getCurrentStep(pathname: string): number {
  if (pathname.includes("/kontakt")) return 4;
  if (pathname.includes("/ergebnis")) return 3;
  if (pathname.includes("/fahrer")) return 2;
  return 1;
}

export default function RechnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = getCurrentStep(pathname);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>
      {children}
    </div>
  );
}

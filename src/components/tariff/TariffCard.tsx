"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPriceShort } from "@/lib/utils";

interface TariffCardProps {
  id: string;
  provider: string;
  productName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  coverage: Record<string, boolean>;
  rating: number | null;
}

const COVERAGE_LABELS: Record<string, string> = {
  haftpflicht: "Haftpflicht",
  teilkasko: "Teilkasko",
  vollkasko: "Vollkasko",
  schutzbrief: "Schutzbrief",
  mallorca_police: "Mallorca-Police",
  rabattschutz: "Rabattschutz",
  werkstattbindung: "Werkstattbindung",
  gapDeckung: "GAP-Deckung",
};

export default function TariffCard({
  id,
  provider,
  productName,
  monthlyPrice,
  yearlyPrice,
  coverage,
  rating,
}: TariffCardProps) {
  return (
    <div className="border-4 border-black bg-white hover:border-accent transition-colors">
      {/* Header */}
      <div className="border-b-4 border-black p-4 flex items-center justify-between">
        <div>
          <p className="font-black uppercase text-sm tracking-wider">
            {provider}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{productName}</p>
        </div>
        {rating && (
          <div className="text-right">
            <p className="text-2xl font-black">{rating.toFixed(1)}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Rating
            </p>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="p-4 bg-black text-white">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-accent">
              {formatPriceShort(monthlyPrice)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              pro Monat
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{formatPriceShort(yearlyPrice)}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              pro Jahr
            </p>
          </div>
        </div>
      </div>

      {/* Coverage */}
      <div className="p-4 border-b-4 border-black">
        <p className="text-[10px] uppercase tracking-wider font-bold mb-2">
          Leistungen
        </p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(coverage).map(([key, value]) =>
            value ? (
              <Badge key={key} variant="accent">
                {COVERAGE_LABELS[key] || key}
              </Badge>
            ) : null
          )}
        </div>
      </div>

      {/* Action */}
      <div className="p-4">
        <Link href={`/kontakt?tariffId=${id}`} className="block">
          <Button variant="accent" className="w-full">
            Auswählen
          </Button>
        </Link>
      </div>
    </div>
  );
}

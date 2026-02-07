"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPriceShort } from "@/lib/utils";
import type { Dictionary } from "@/i18n";

interface TariffCardProps {
  id: string;
  provider: string;
  productName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  coverage: Record<string, boolean>;
  rating: number | null;
  lang: string;
  dict: Dictionary;
}

export default function TariffCard({
  id,
  provider,
  productName,
  monthlyPrice,
  yearlyPrice,
  coverage,
  rating,
  lang,
  dict,
}: TariffCardProps) {
  const t = dict.tariff;

  const COVERAGE_LABELS: Record<string, string> = {
    haftpflicht: t.coverageHaftpflicht,
    teilkasko: t.coverageTeilkasko,
    vollkasko: t.coverageVollkasko,
    schutzbrief: t.coverageSchutzbrief,
    mallorca_police: t.coverageMallorca,
    rabattschutz: t.coverageRabattschutz,
    werkstattbindung: t.coverageWerkstatt,
    gapDeckung: t.coverageGap,
  };

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
              {t.rating}
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
              {t.perMonth}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{formatPriceShort(yearlyPrice)}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              {t.perYear}
            </p>
          </div>
        </div>
      </div>

      {/* Coverage */}
      <div className="p-4 border-b-4 border-black">
        <p className="text-[10px] uppercase tracking-wider font-bold mb-2">
          {t.coverage}
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
        <Link href={`/${lang}/kontakt?tariffId=${id}`} className="block">
          <Button variant="accent" className="w-full">
            {t.select}
          </Button>
        </Link>
      </div>
    </div>
  );
}

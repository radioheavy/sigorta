"use client";

import TariffCard from "./TariffCard";
import type { Dictionary } from "@/i18n";

interface TariffResult {
  id: string;
  provider: string;
  productName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  coverage: Record<string, boolean>;
  rating: number | null;
}

interface TariffListProps {
  results: TariffResult[];
  lang: string;
  dict: Dictionary;
}

export default function TariffList({ results, lang, dict }: TariffListProps) {
  const t = dict.tariff;

  if (results.length === 0) {
    return (
      <div className="border-4 border-black p-8 text-center">
        <p className="font-bold uppercase text-sm">
          {t.noResults}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {t.noResultsHint}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={result.id} className="relative">
          {index === 0 && (
            <div className="absolute -top-3 left-4 bg-accent px-3 py-0.5 border-2 border-black z-10">
              <span className="text-[10px] font-black uppercase tracking-wider">
                {t.cheapest}
              </span>
            </div>
          )}
          <TariffCard {...result} lang={lang} dict={dict} />
        </div>
      ))}
    </div>
  );
}

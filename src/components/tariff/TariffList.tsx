"use client";

import TariffCard from "./TariffCard";

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
}

export default function TariffList({ results }: TariffListProps) {
  if (results.length === 0) {
    return (
      <div className="border-4 border-black p-8 text-center">
        <p className="font-bold uppercase text-sm">
          Keine Tarife gefunden
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Bitte passen Sie Ihre Filter an.
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
                Günstigster
              </span>
            </div>
          )}
          <TariffCard {...result} />
        </div>
      ))}
    </div>
  );
}

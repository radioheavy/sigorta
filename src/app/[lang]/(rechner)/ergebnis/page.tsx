"use client";

import { useEffect, useState, use } from "react";
import TariffList from "@/components/tariff/TariffList";
import TariffFilters from "@/components/tariff/TariffFilters";
import TariffSkeleton from "@/components/tariff/TariffSkeleton";
import { isValidLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

export interface TariffResultData {
  id: string;
  provider: string;
  productName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  coverage: Record<string, boolean>;
  rating: number | null;
  sourceAdapter: string;
}

// Since this is a client component, we load the dict client-side
function useDictionary(lang: Locale): Dictionary | null {
  const [dict, setDict] = useState<Dictionary | null>(null);
  useEffect(() => {
    import(`@/i18n/dictionaries/${lang}.json`).then((m) => setDict(m.default));
  }, [lang]);
  return dict;
}

export default function ErgebnisPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = use(params);
  const lang = isValidLocale(rawLang) ? rawLang : "de";
  const dict = useDictionary(lang as Locale);

  const [results, setResults] = useState<TariffResultData[]>([]);
  const [filtered, setFiltered] = useState<TariffResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    maxPrice: 500,
    provider: "",
    sortBy: "price_asc" as "price_asc" | "price_desc" | "rating",
  });

  useEffect(() => {
    async function fetchTariffs() {
      try {
        const res = await fetch("/api/tariff/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromSession: true }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || (dict?.results.errorLoading ?? "Error"));
        }
        const data = await res.json();
        setResults(data.results);
        setFiltered(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : (dict?.results.unknownError ?? "Error"));
      } finally {
        setLoading(false);
      }
    }
    fetchTariffs();
  }, [dict]);

  useEffect(() => {
    let list = [...results];

    if (filters.maxPrice) {
      list = list.filter((t) => t.monthlyPrice <= filters.maxPrice);
    }
    if (filters.provider) {
      list = list.filter((t) => t.provider === filters.provider);
    }

    switch (filters.sortBy) {
      case "price_asc":
        list.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
        break;
      case "price_desc":
        list.sort((a, b) => b.monthlyPrice - a.monthlyPrice);
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFiltered(list);
  }, [filters, results]);

  if (!dict) return <TariffSkeleton />;

  const providers = [...new Set(results.map((r) => r.provider))];

  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          {dict.results.title}
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          {dict.results.stepInfo} — {loading ? dict.results.loading : `${filtered.length} ${dict.results.found}`}
        </p>
      </div>

      {loading ? (
        <TariffSkeleton />
      ) : error ? (
        <div className="border-4 border-red-600 p-6 bg-red-50">
          <p className="font-bold text-red-600 uppercase text-sm">{error}</p>
          <p className="text-xs mt-2 text-gray-600">
            {dict.results.errorGoBack}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TariffFilters
              filters={filters}
              onFilterChange={setFilters}
              providers={providers}
              dict={dict}
            />
          </div>
          <div className="lg:col-span-3">
            <TariffList results={filtered} lang={lang} dict={dict} />
          </div>
        </div>
      )}
    </div>
  );
}

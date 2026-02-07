"use client";

import { useEffect, useState } from "react";
import TariffList from "@/components/tariff/TariffList";
import TariffFilters from "@/components/tariff/TariffFilters";
import TariffSkeleton from "@/components/tariff/TariffSkeleton";

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

export default function ErgebnisPage() {
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
          throw new Error(data.error || "Fehler beim Laden der Tarife");
        }
        const data = await res.json();
        setResults(data.results);
        setFiltered(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchTariffs();
  }, []);

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

  const providers = [...new Set(results.map((r) => r.provider))];

  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          Tarifergebnisse
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          Schritt 3 von 4 — {loading ? "Laden..." : `${filtered.length} Tarife gefunden`}
        </p>
      </div>

      {loading ? (
        <TariffSkeleton />
      ) : error ? (
        <div className="border-4 border-red-600 p-6 bg-red-50">
          <p className="font-bold text-red-600 uppercase text-sm">{error}</p>
          <p className="text-xs mt-2 text-gray-600">
            Bitte gehen Sie zurück und überprüfen Sie Ihre Eingaben.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TariffFilters
              filters={filters}
              onFilterChange={setFilters}
              providers={providers}
            />
          </div>
          <div className="lg:col-span-3">
            <TariffList results={filtered} />
          </div>
        </div>
      )}
    </div>
  );
}

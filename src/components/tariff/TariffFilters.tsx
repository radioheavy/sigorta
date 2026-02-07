"use client";

import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

interface Filters {
  maxPrice: number;
  provider: string;
  sortBy: "price_asc" | "price_desc" | "rating";
}

interface TariffFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  providers: string[];
}

export default function TariffFilters({
  filters,
  onFilterChange,
  providers,
}: TariffFiltersProps) {
  return (
    <div className="border-4 border-black p-4 space-y-4 sticky top-4">
      <h3 className="font-bold uppercase text-xs tracking-wider border-b-2 border-black pb-2">
        Filter
      </h3>

      <Select
        label="Sortierung"
        value={filters.sortBy}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            sortBy: e.target.value as Filters["sortBy"],
          })
        }
        options={[
          { value: "price_asc", label: "Preis aufsteigend" },
          { value: "price_desc", label: "Preis absteigend" },
          { value: "rating", label: "Bewertung" },
        ]}
      />

      <Input
        label="Max. Preis / Monat (€)"
        type="number"
        value={filters.maxPrice}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            maxPrice: Number(e.target.value) || 500,
          })
        }
        min={10}
        max={2000}
      />

      <Select
        label="Anbieter"
        value={filters.provider}
        onChange={(e) =>
          onFilterChange({ ...filters, provider: e.target.value })
        }
        options={[
          { value: "", label: "Alle Anbieter" },
          ...providers.map((p) => ({ value: p, label: p })),
        ]}
      />
    </div>
  );
}

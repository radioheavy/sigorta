"use client";

import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import type { Dictionary } from "@/i18n";

interface Filters {
  maxPrice: number;
  provider: string;
  sortBy: "price_asc" | "price_desc" | "rating";
}

interface TariffFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  providers: string[];
  dict: Dictionary;
}

export default function TariffFilters({
  filters,
  onFilterChange,
  providers,
  dict,
}: TariffFiltersProps) {
  const t = dict.filters;

  return (
    <div className="border-4 border-black p-4 space-y-4 sticky top-4">
      <h3 className="font-bold uppercase text-xs tracking-wider border-b-2 border-black pb-2">
        {t.title}
      </h3>

      <Select
        label={t.sort}
        value={filters.sortBy}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            sortBy: e.target.value as Filters["sortBy"],
          })
        }
        options={[
          { value: "price_asc", label: t.priceAsc },
          { value: "price_desc", label: t.priceDesc },
          { value: "rating", label: t.byRating },
        ]}
      />

      <Input
        label={t.maxPrice}
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
        label={t.provider}
        value={filters.provider}
        onChange={(e) =>
          onFilterChange({ ...filters, provider: e.target.value })
        }
        options={[
          { value: "", label: t.allProviders },
          ...providers.map((p) => ({ value: p, label: p })),
        ]}
      />
    </div>
  );
}

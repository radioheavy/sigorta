import { TariffResponse } from "./adapter";

export type SortOption = "price_asc" | "price_desc" | "rating";

export interface FilterOptions {
  maxPrice?: number;
  provider?: string;
  minRating?: number;
}

export function sortTariffs(
  results: TariffResponse[],
  sortBy: SortOption = "price_asc"
): TariffResponse[] {
  const sorted = [...results];

  switch (sortBy) {
    case "price_asc":
      sorted.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.monthlyPrice - a.monthlyPrice);
      break;
    case "rating":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }

  return sorted;
}

export function filterTariffs(
  results: TariffResponse[],
  filters: FilterOptions
): TariffResponse[] {
  return results.filter((r) => {
    if (filters.maxPrice && r.monthlyPrice > filters.maxPrice) return false;
    if (filters.provider && r.provider !== filters.provider) return false;
    if (filters.minRating && (r.rating || 0) < filters.minRating) return false;
    return true;
  });
}

"use client";

import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n";

interface InsuranceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  dict: Dictionary;
}

export default function InsuranceTypeSelector({
  value,
  onChange,
  error,
  dict,
}: InsuranceTypeSelectorProps) {
  const t = dict.insurance;
  const v = dict.vehicle;

  const INSURANCE_TYPES = [
    {
      value: "HAFTPFLICHT",
      label: t.haftpflicht,
      description: t.haftpflichtDesc,
    },
    {
      value: "TEILKASKO",
      label: t.teilkasko,
      description: t.teilkaskoDesc,
    },
    {
      value: "VOLLKASKO",
      label: t.vollkasko,
      description: t.vollkaskoDesc,
    },
  ];

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2">
        {v.insuranceType}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
        {INSURANCE_TYPES.map((type, index) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "border-4 border-black p-4 text-left transition-all cursor-pointer",
              index < INSURANCE_TYPES.length - 1 && "sm:border-r-0",
              value === type.value
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-50"
            )}
          >
            <p className="font-bold uppercase text-sm tracking-wider">
              {type.label}
            </p>
            <p
              className={cn(
                "text-xs mt-1",
                value === type.value ? "text-gray-300" : "text-gray-500"
              )}
            >
              {type.description}
            </p>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs font-bold text-red-600 uppercase">{error}</p>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

const INSURANCE_TYPES = [
  {
    value: "HAFTPFLICHT",
    label: "Haftpflicht",
    description: "Gesetzliche Pflichtversicherung",
  },
  {
    value: "TEILKASKO",
    label: "Teilkasko",
    description: "Haftpflicht + Diebstahl, Brand, Glas",
  },
  {
    value: "VOLLKASKO",
    label: "Vollkasko",
    description: "Teilkasko + Eigenschäden, Vandalismus",
  },
];

interface InsuranceTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function InsuranceTypeSelector({
  value,
  onChange,
  error,
}: InsuranceTypeSelectorProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2">
        Versicherungsart
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

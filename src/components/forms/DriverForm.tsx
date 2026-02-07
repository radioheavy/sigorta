"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const SF_KLASSEN = [
  { value: "SF0", label: "SF 0 (Anfänger)" },
  { value: "SF1/2", label: "SF ½" },
  ...Array.from({ length: 36 }, (_, i) => ({
    value: `SF${i + 1}`,
    label: `SF ${i + 1}`,
  })),
];

export default function DriverForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    age: "",
    experienceYears: "",
    sfKlasse: "",
  });

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const age = Number(formData.age);
    const exp = Number(formData.experienceYears);

    if (!formData.age || age < 18 || age > 99)
      newErrors.age = "Alter: 18–99 Jahre";
    if (formData.experienceYears === "" || exp < 0 || exp > 80)
      newErrors.experienceYears = "Erfahrung: 0–80 Jahre";
    if (!formData.sfKlasse)
      newErrors.sfKlasse = "SF-Klasse ist erforderlich";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverData: {
            age: Number(formData.age),
            experienceYears: Number(formData.experienceYears),
            sfKlasse: formData.sfKlasse,
          },
        }),
      });

      if (res.ok) {
        router.push("/ergebnis");
      } else {
        setErrors({ form: "Fehler beim Speichern" });
      }
    } catch {
      setErrors({ form: "Netzwerkfehler" });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-4 border-black p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Alter"
            type="number"
            value={formData.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="25"
            min={18}
            max={99}
            error={errors.age}
          />
          <Input
            label="Fahrerfahrung (Jahre)"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => update("experienceYears", e.target.value)}
            placeholder="5"
            min={0}
            max={80}
            error={errors.experienceYears}
          />
          <Select
            label="SF-Klasse"
            value={formData.sfKlasse}
            onChange={(e) => update("sfKlasse", e.target.value)}
            options={SF_KLASSEN}
            placeholder="Wählen"
            error={errors.sfKlasse}
          />
        </div>
      </div>

      <div className="border-4 border-black p-6 bg-gray-50">
        <p className="text-xs font-bold uppercase tracking-wider mb-2">
          Info: SF-Klasse
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          Die Schadenfreiheitsklasse (SF-Klasse) bestimmt Ihren
          Versicherungsbeitrag. SF0 = Anfänger, SF35 = 35 schadenfreie
          Jahre. Die SF-Klasse finden Sie auf Ihrer aktuellen
          Versicherungspolice.
        </p>
      </div>

      {errors.form && (
        <div className="border-4 border-red-600 p-4 bg-red-50">
          <p className="text-xs font-bold text-red-600 uppercase">
            {errors.form}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/fahrzeug")}
        >
          ← Zurück
        </Button>
        <Button type="submit" variant="accent" size="lg" disabled={loading}>
          {loading ? "Wird gespeichert..." : "Tarife vergleichen →"}
        </Button>
      </div>
    </form>
  );
}

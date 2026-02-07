"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Dictionary } from "@/i18n";

interface DriverFormProps {
  lang: string;
  dict: Dictionary;
}

export default function DriverForm({ lang, dict }: DriverFormProps) {
  const router = useRouter();
  const t = dict.driver;

  const SF_KLASSEN = [
    { value: "SF0", label: t.sfClassBeginner },
    { value: "SF1/2", label: "SF ½" },
    ...Array.from({ length: 36 }, (_, i) => ({
      value: `SF${i + 1}`,
      label: `SF ${i + 1}`,
    })),
  ];

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
      newErrors.age = t.errorAge;
    if (formData.experienceYears === "" || exp < 0 || exp > 80)
      newErrors.experienceYears = t.errorExperience;
    if (!formData.sfKlasse)
      newErrors.sfKlasse = t.errorSfClass;

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
        router.push(`/${lang}/ergebnis`);
      } else {
        setErrors({ form: t.errorSave });
      }
    } catch {
      setErrors({ form: t.errorNetwork });
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
            label={t.age}
            type="number"
            value={formData.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="25"
            min={18}
            max={99}
            error={errors.age}
          />
          <Input
            label={t.experience}
            type="number"
            value={formData.experienceYears}
            onChange={(e) => update("experienceYears", e.target.value)}
            placeholder="5"
            min={0}
            max={80}
            error={errors.experienceYears}
          />
          <Select
            label={t.sfClass}
            value={formData.sfKlasse}
            onChange={(e) => update("sfKlasse", e.target.value)}
            options={SF_KLASSEN}
            placeholder={dict.common.select}
            error={errors.sfKlasse}
          />
        </div>
      </div>

      <div className="border-4 border-black p-6 bg-gray-50">
        <p className="text-xs font-bold uppercase tracking-wider mb-2">
          {t.sfInfoTitle}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {t.sfInfoText}
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
          onClick={() => router.push(`/${lang}/fahrzeug`)}
        >
          {t.back}
        </Button>
        <Button type="submit" variant="accent" size="lg" disabled={loading}>
          {loading ? dict.common.saving : t.submit}
        </Button>
      </div>
    </form>
  );
}

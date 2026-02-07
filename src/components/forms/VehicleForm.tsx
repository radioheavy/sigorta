"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import InsuranceTypeSelector from "./InsuranceTypeSelector";

interface Make {
  id: string;
  name: string;
}

interface Model {
  id: string;
  name: string;
  hsn: string | null;
  tsn: string | null;
}

const ENGINE_TYPES = [
  { value: "BENZIN", label: "Benzin" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELEKTRO", label: "Elektro" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "PLUGIN_HYBRID", label: "Plug-in Hybrid" },
  { value: "LPG", label: "LPG" },
  { value: "CNG", label: "CNG" },
];

const DEDUCTIBLE_OPTIONS = [
  { value: "0", label: "0 €" },
  { value: "150", label: "150 €" },
  { value: "300", label: "300 €" },
  { value: "500", label: "500 €" },
  { value: "1000", label: "1.000 €" },
  { value: "2500", label: "2.500 €" },
];

const YEARS = Array.from({ length: 36 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: String(year), label: String(year) };
});

export default function VehicleForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"manual" | "hsn">("manual");
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    makeId: "",
    modelId: "",
    year: "",
    engineType: "",
    registrationDate: "",
    insuranceType: "",
    deductible: "150",
    hsn: "",
    tsn: "",
  });

  useEffect(() => {
    fetch("/api/vehicle/makes")
      .then((res) => res.json())
      .then((data) => setMakes(data.makes || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!formData.makeId) {
      setModels([]);
      return;
    }
    fetch(`/api/vehicle/models?makeId=${formData.makeId}`)
      .then((res) => res.json())
      .then((data) => setModels(data.models || []))
      .catch(() => {});
  }, [formData.makeId]);

  const handleHSNLookup = async () => {
    if (formData.hsn.length < 4 || formData.tsn.length < 3) {
      setErrors({ hsn: "HSN (4 Stellen) und TSN (3 Stellen) eingeben" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/vehicle/lookup?hsn=${formData.hsn}&tsn=${formData.tsn}`
      );
      const data = await res.json();
      if (data.vehicle) {
        setFormData((prev) => ({
          ...prev,
          makeId: data.vehicle.makeId,
          modelId: data.vehicle.id,
        }));
        setErrors({});
      } else {
        setErrors({ hsn: "Fahrzeug nicht gefunden" });
      }
    } catch {
      setErrors({ hsn: "Fehler bei der Suche" });
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.makeId) newErrors.makeId = "Marke ist erforderlich";
    if (!formData.modelId) newErrors.modelId = "Modell ist erforderlich";
    if (!formData.year) newErrors.year = "Baujahr ist erforderlich";
    if (!formData.engineType)
      newErrors.engineType = "Antriebsart ist erforderlich";
    if (!formData.registrationDate)
      newErrors.registrationDate = "Erstzulassung ist erforderlich";
    if (!formData.insuranceType)
      newErrors.insuranceType = "Versicherungsart ist erforderlich";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const selectedMake = makes.find((m) => m.id === formData.makeId);
      const selectedModel = models.find((m) => m.id === formData.modelId);

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleData: {
            makeId: formData.makeId,
            makeName: selectedMake?.name,
            modelId: formData.modelId,
            modelName: selectedModel?.name,
            hsn: formData.hsn || selectedModel?.hsn,
            tsn: formData.tsn || selectedModel?.tsn,
            year: Number(formData.year),
            engineType: formData.engineType,
            registrationDate: formData.registrationDate,
            deductible: Number(formData.deductible),
          },
          insuranceType: formData.insuranceType,
        }),
      });

      if (res.ok) {
        router.push("/fahrer");
      } else {
        setErrors({ form: "Fehler beim Speichern. Bitte versuchen Sie es erneut." });
      }
    } catch {
      setErrors({ form: "Netzwerkfehler. Bitte versuchen Sie es erneut." });
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
      {/* Mode toggle */}
      <div className="flex gap-0">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`flex-1 border-4 border-black px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
            mode === "manual" ? "bg-black text-white" : "bg-white"
          }`}
        >
          Manuelle Eingabe
        </button>
        <button
          type="button"
          onClick={() => setMode("hsn")}
          className={`flex-1 border-4 border-l-0 border-black px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
            mode === "hsn" ? "bg-black text-white" : "bg-white"
          }`}
        >
          HSN / TSN
        </button>
      </div>

      {mode === "hsn" && (
        <div className="border-4 border-black p-6 space-y-4">
          <p className="text-xs text-gray-600 uppercase tracking-wider">
            Die HSN/TSN finden Sie in Ihrem Fahrzeugschein (Zulassungsbescheinigung Teil I).
          </p>
          <div className="flex gap-4">
            <Input
              label="HSN (4-stellig)"
              value={formData.hsn}
              onChange={(e) => update("hsn", e.target.value.toUpperCase())}
              maxLength={4}
              placeholder="0005"
              error={errors.hsn}
            />
            <Input
              label="TSN (3-stellig)"
              value={formData.tsn}
              onChange={(e) => update("tsn", e.target.value.toUpperCase())}
              maxLength={3}
              placeholder="AHK"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleHSNLookup}
            disabled={loading}
          >
            {loading ? "Suche..." : "Fahrzeug suchen"}
          </Button>
        </div>
      )}

      {/* Manual fields */}
      <div className="border-4 border-black p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Marke"
            value={formData.makeId}
            onChange={(e) => {
              update("makeId", e.target.value);
              update("modelId", "");
            }}
            options={makes.map((m) => ({ value: m.id, label: m.name }))}
            placeholder="Marke wählen"
            error={errors.makeId}
          />
          <Select
            label="Modell"
            value={formData.modelId}
            onChange={(e) => update("modelId", e.target.value)}
            options={models.map((m) => ({ value: m.id, label: m.name }))}
            placeholder="Modell wählen"
            disabled={!formData.makeId}
            error={errors.modelId}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Baujahr"
            value={formData.year}
            onChange={(e) => update("year", e.target.value)}
            options={YEARS}
            placeholder="Wählen"
            error={errors.year}
          />
          <Select
            label="Antriebsart"
            value={formData.engineType}
            onChange={(e) => update("engineType", e.target.value)}
            options={ENGINE_TYPES}
            placeholder="Wählen"
            error={errors.engineType}
          />
          <Input
            label="Erstzulassung"
            type="month"
            value={formData.registrationDate}
            onChange={(e) => update("registrationDate", e.target.value)}
            error={errors.registrationDate}
          />
        </div>
      </div>

      {/* Insurance type */}
      <InsuranceTypeSelector
        value={formData.insuranceType}
        onChange={(v) => update("insuranceType", v)}
        error={errors.insuranceType}
      />

      {/* Deductible */}
      {formData.insuranceType &&
        formData.insuranceType !== "HAFTPFLICHT" && (
          <Select
            label="Selbstbeteiligung"
            value={formData.deductible}
            onChange={(e) => update("deductible", e.target.value)}
            options={DEDUCTIBLE_OPTIONS}
          />
        )}

      {errors.form && (
        <div className="border-4 border-red-600 p-4 bg-red-50">
          <p className="text-xs font-bold text-red-600 uppercase">
            {errors.form}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="accent" size="lg" disabled={loading}>
          {loading ? "Wird gespeichert..." : "Weiter →"}
        </Button>
      </div>
    </form>
  );
}

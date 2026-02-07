import { TariffAdapter, TariffRequest, TariffResponse } from "./adapter";

function seedRandom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function calculateBasePrice(req: TariffRequest): number {
  let base = 45;

  // Insurance type multiplier
  if (req.insurance.insuranceType === "TEILKASKO") base *= 1.4;
  if (req.insurance.insuranceType === "VOLLKASKO") base *= 2.1;

  // Age factor
  if (req.driver.age < 25) base *= 1.8;
  else if (req.driver.age < 30) base *= 1.3;
  else if (req.driver.age > 65) base *= 1.2;

  // SF-Klasse factor
  const sfMatch = req.driver.sfKlasse.match(/\d+/);
  const sfNum = sfMatch ? parseInt(sfMatch[0]) : 0;
  if (sfNum === 0) base *= 2.3;
  else if (sfNum <= 3) base *= 1.5;
  else if (sfNum <= 10) base *= 0.8;
  else base *= 0.6;

  // Vehicle age factor
  const vehicleAge = new Date().getFullYear() - req.vehicle.year;
  if (vehicleAge > 10) base *= 0.8;
  else if (vehicleAge < 2) base *= 1.2;

  // Deductible discount
  if (req.insurance.deductible >= 500) base *= 0.85;
  else if (req.insurance.deductible >= 300) base *= 0.9;

  return base;
}

export class BlaudirektAdapter implements TariffAdapter {
  name = "blaudirekt";

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async fetchTariffs(req: TariffRequest): Promise<TariffResponse[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

    const basePrice = calculateBasePrice(req);
    const seed = seedRandom(
      `${req.vehicle.modelId}-${req.driver.sfKlasse}-${req.insurance.insuranceType}`
    );

    const products = [
      {
        name: "Allianz KFZ Basis",
        provider: "Allianz",
        factor: 1.0 + (seed % 20) / 100,
        rating: 4.2,
      },
      {
        name: "HUK-COBURG Klassik",
        provider: "HUK-COBURG",
        factor: 0.85 + (seed % 15) / 100,
        rating: 4.5,
      },
      {
        name: "DEVK Komfort",
        provider: "DEVK",
        factor: 0.95 + (seed % 18) / 100,
        rating: 3.8,
      },
      {
        name: "AXA Easy",
        provider: "AXA",
        factor: 1.05 + (seed % 12) / 100,
        rating: 4.0,
      },
      {
        name: "VHV Kompakt",
        provider: "VHV",
        factor: 0.78 + (seed % 22) / 100,
        rating: 3.5,
      },
    ];

    const isVollkasko = req.insurance.insuranceType === "VOLLKASKO";
    const isTeilkasko =
      req.insurance.insuranceType === "TEILKASKO" ||
      req.insurance.insuranceType === "VOLLKASKO";

    return products.map((p) => {
      const monthly = Math.round(basePrice * p.factor * 100) / 100;
      return {
        provider: p.provider,
        productName: p.name,
        monthlyPrice: monthly,
        yearlyPrice: Math.round(monthly * 11.4 * 100) / 100,
        coverage: {
          haftpflicht: true,
          teilkasko: isTeilkasko,
          vollkasko: isVollkasko,
          schutzbrief: p.factor > 0.95,
          mallorca_police: p.factor > 1.0,
          rabattschutz: p.factor > 1.05,
          werkstattbindung: p.factor < 0.9,
          gapDeckung: isVollkasko && p.factor > 0.9,
        },
        rating: p.rating,
        sourceAdapter: this.name,
      };
    });
  }
}

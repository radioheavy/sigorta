import { TariffAdapter, TariffRequest, TariffResponse } from "./adapter";

function calculateBasePrice(req: TariffRequest): number {
  let base = 42;

  if (req.insurance.insuranceType === "TEILKASKO") base *= 1.45;
  if (req.insurance.insuranceType === "VOLLKASKO") base *= 2.2;

  if (req.driver.age < 25) base *= 1.9;
  else if (req.driver.age < 30) base *= 1.35;
  else if (req.driver.age > 65) base *= 1.15;

  const sfMatch = req.driver.sfKlasse.match(/\d+/);
  const sfNum = sfMatch ? parseInt(sfMatch[0]) : 0;
  if (sfNum === 0) base *= 2.4;
  else if (sfNum <= 3) base *= 1.6;
  else if (sfNum <= 10) base *= 0.75;
  else base *= 0.55;

  const vehicleAge = new Date().getFullYear() - req.vehicle.year;
  if (vehicleAge > 10) base *= 0.75;
  else if (vehicleAge < 2) base *= 1.25;

  if (req.insurance.deductible >= 500) base *= 0.82;
  else if (req.insurance.deductible >= 300) base *= 0.88;

  // Engine type factor
  if (req.vehicle.engineType === "ELEKTRO") base *= 0.9;
  if (req.vehicle.engineType === "DIESEL") base *= 1.05;

  return base;
}

export class FondsnetAdapter implements TariffAdapter {
  name = "fondsnet";

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async fetchTariffs(req: TariffRequest): Promise<TariffResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));

    const basePrice = calculateBasePrice(req);

    const isVollkasko = req.insurance.insuranceType === "VOLLKASKO";
    const isTeilkasko =
      req.insurance.insuranceType === "TEILKASKO" ||
      req.insurance.insuranceType === "VOLLKASKO";

    const products = [
      {
        name: "ERGO Direkt",
        provider: "ERGO",
        factor: 0.92,
        rating: 3.9,
      },
      {
        name: "Württembergische Premium",
        provider: "Württembergische",
        factor: 1.08,
        rating: 4.3,
      },
      {
        name: "CosmosDirekt Smart",
        provider: "CosmosDirekt",
        factor: 0.75,
        rating: 4.1,
      },
      {
        name: "HDI Standard",
        provider: "HDI",
        factor: 0.98,
        rating: 3.7,
      },
    ];

    return products.map((p) => {
      const monthly = Math.round(basePrice * p.factor * 100) / 100;
      return {
        provider: p.provider,
        productName: p.name,
        monthlyPrice: monthly,
        yearlyPrice: Math.round(monthly * 11.5 * 100) / 100,
        coverage: {
          haftpflicht: true,
          teilkasko: isTeilkasko,
          vollkasko: isVollkasko,
          schutzbrief: p.factor > 0.9,
          mallorca_police: p.factor > 1.0,
          rabattschutz: false,
          werkstattbindung: p.factor < 0.85,
          gapDeckung: isVollkasko,
        },
        rating: p.rating,
        sourceAdapter: this.name,
      };
    });
  }
}

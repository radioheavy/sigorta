export interface TariffRequest {
  vehicle: {
    makeId: string;
    makeName: string;
    modelId: string;
    modelName: string;
    year: number;
    engineType: string;
    registrationDate: string;
  };
  driver: {
    age: number;
    experienceYears: number;
    sfKlasse: string;
  };
  insurance: {
    insuranceType: "HAFTPFLICHT" | "TEILKASKO" | "VOLLKASKO";
    deductible: number;
  };
}

export interface TariffResponse {
  provider: string;
  productName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  coverage: Record<string, boolean>;
  rating: number | null;
  sourceAdapter: string;
}

export interface TariffAdapter {
  name: string;
  fetchTariffs(req: TariffRequest): Promise<TariffResponse[]>;
  isAvailable(): Promise<boolean>;
}

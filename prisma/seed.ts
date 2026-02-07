import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const VEHICLE_DATA: Record<string, { models: { name: string; hsn: string; tsn: string }[] }> = {
  "Volkswagen": {
    models: [
      { name: "Golf", hsn: "0603", tsn: "AHK" },
      { name: "Polo", hsn: "0603", tsn: "AHL" },
      { name: "Passat", hsn: "0603", tsn: "AHM" },
      { name: "Tiguan", hsn: "0603", tsn: "AHN" },
      { name: "T-Roc", hsn: "0603", tsn: "AHP" },
      { name: "ID.3", hsn: "0603", tsn: "AHQ" },
      { name: "ID.4", hsn: "0603", tsn: "AHR" },
      { name: "Arteon", hsn: "0603", tsn: "AHS" },
    ],
  },
  "BMW": {
    models: [
      { name: "3er", hsn: "0005", tsn: "AHK" },
      { name: "5er", hsn: "0005", tsn: "AHL" },
      { name: "1er", hsn: "0005", tsn: "AHM" },
      { name: "X1", hsn: "0005", tsn: "AHN" },
      { name: "X3", hsn: "0005", tsn: "AHP" },
      { name: "X5", hsn: "0005", tsn: "AHQ" },
      { name: "i4", hsn: "0005", tsn: "AHR" },
    ],
  },
  "Mercedes-Benz": {
    models: [
      { name: "C-Klasse", hsn: "0710", tsn: "AHK" },
      { name: "E-Klasse", hsn: "0710", tsn: "AHL" },
      { name: "A-Klasse", hsn: "0710", tsn: "AHM" },
      { name: "GLC", hsn: "0710", tsn: "AHN" },
      { name: "GLE", hsn: "0710", tsn: "AHP" },
      { name: "CLA", hsn: "0710", tsn: "AHQ" },
      { name: "EQC", hsn: "0710", tsn: "AHR" },
    ],
  },
  "Audi": {
    models: [
      { name: "A3", hsn: "0588", tsn: "AHK" },
      { name: "A4", hsn: "0588", tsn: "AHL" },
      { name: "A6", hsn: "0588", tsn: "AHM" },
      { name: "Q3", hsn: "0588", tsn: "AHN" },
      { name: "Q5", hsn: "0588", tsn: "AHP" },
      { name: "Q7", hsn: "0588", tsn: "AHQ" },
      { name: "e-tron", hsn: "0588", tsn: "AHR" },
    ],
  },
  "Opel": {
    models: [
      { name: "Corsa", hsn: "0035", tsn: "AHK" },
      { name: "Astra", hsn: "0035", tsn: "AHL" },
      { name: "Mokka", hsn: "0035", tsn: "AHM" },
      { name: "Grandland", hsn: "0035", tsn: "AHN" },
      { name: "Insignia", hsn: "0035", tsn: "AHP" },
    ],
  },
  "Ford": {
    models: [
      { name: "Focus", hsn: "8566", tsn: "AHK" },
      { name: "Fiesta", hsn: "8566", tsn: "AHL" },
      { name: "Kuga", hsn: "8566", tsn: "AHM" },
      { name: "Puma", hsn: "8566", tsn: "AHN" },
      { name: "Mustang Mach-E", hsn: "8566", tsn: "AHP" },
    ],
  },
  "Toyota": {
    models: [
      { name: "Corolla", hsn: "2108", tsn: "AHK" },
      { name: "Yaris", hsn: "2108", tsn: "AHL" },
      { name: "RAV4", hsn: "2108", tsn: "AHM" },
      { name: "C-HR", hsn: "2108", tsn: "AHN" },
      { name: "Camry", hsn: "2108", tsn: "AHP" },
    ],
  },
  "Hyundai": {
    models: [
      { name: "i20", hsn: "6811", tsn: "AHK" },
      { name: "i30", hsn: "6811", tsn: "AHL" },
      { name: "Tucson", hsn: "6811", tsn: "AHM" },
      { name: "Kona", hsn: "6811", tsn: "AHN" },
      { name: "IONIQ 5", hsn: "6811", tsn: "AHP" },
    ],
  },
  "Skoda": {
    models: [
      { name: "Octavia", hsn: "8004", tsn: "AHK" },
      { name: "Fabia", hsn: "8004", tsn: "AHL" },
      { name: "Superb", hsn: "8004", tsn: "AHM" },
      { name: "Karoq", hsn: "8004", tsn: "AHN" },
      { name: "Kodiaq", hsn: "8004", tsn: "AHP" },
    ],
  },
  "Renault": {
    models: [
      { name: "Clio", hsn: "3333", tsn: "AHK" },
      { name: "Megane", hsn: "3333", tsn: "AHL" },
      { name: "Captur", hsn: "3333", tsn: "AHM" },
      { name: "Kadjar", hsn: "3333", tsn: "AHN" },
    ],
  },
  "Seat": {
    models: [
      { name: "Leon", hsn: "7593", tsn: "AHK" },
      { name: "Ibiza", hsn: "7593", tsn: "AHL" },
      { name: "Ateca", hsn: "7593", tsn: "AHM" },
      { name: "Arona", hsn: "7593", tsn: "AHN" },
    ],
  },
  "Peugeot": {
    models: [
      { name: "208", hsn: "3003", tsn: "AHK" },
      { name: "308", hsn: "3003", tsn: "AHL" },
      { name: "2008", hsn: "3003", tsn: "AHM" },
      { name: "3008", hsn: "3003", tsn: "AHN" },
    ],
  },
  "Fiat": {
    models: [
      { name: "500", hsn: "3011", tsn: "AHK" },
      { name: "Panda", hsn: "3011", tsn: "AHL" },
      { name: "Tipo", hsn: "3011", tsn: "AHM" },
    ],
  },
  "Mazda": {
    models: [
      { name: "CX-5", hsn: "7014", tsn: "AHK" },
      { name: "Mazda3", hsn: "7014", tsn: "AHL" },
      { name: "MX-5", hsn: "7014", tsn: "AHM" },
      { name: "CX-30", hsn: "7014", tsn: "AHN" },
    ],
  },
  "Kia": {
    models: [
      { name: "Ceed", hsn: "6812", tsn: "AHK" },
      { name: "Sportage", hsn: "6812", tsn: "AHL" },
      { name: "Niro", hsn: "6812", tsn: "AHM" },
      { name: "EV6", hsn: "6812", tsn: "AHN" },
    ],
  },
  "Nissan": {
    models: [
      { name: "Qashqai", hsn: "4065", tsn: "AHK" },
      { name: "Juke", hsn: "4065", tsn: "AHL" },
      { name: "Leaf", hsn: "4065", tsn: "AHM" },
    ],
  },
  "Honda": {
    models: [
      { name: "Civic", hsn: "2404", tsn: "AHK" },
      { name: "CR-V", hsn: "2404", tsn: "AHL" },
      { name: "Jazz", hsn: "2404", tsn: "AHM" },
    ],
  },
  "Volvo": {
    models: [
      { name: "XC40", hsn: "1420", tsn: "AHK" },
      { name: "XC60", hsn: "1420", tsn: "AHL" },
      { name: "V60", hsn: "1420", tsn: "AHM" },
    ],
  },
  "Tesla": {
    models: [
      { name: "Model 3", hsn: "1210", tsn: "AHK" },
      { name: "Model Y", hsn: "1210", tsn: "AHL" },
      { name: "Model S", hsn: "1210", tsn: "AHM" },
    ],
  },
  "Porsche": {
    models: [
      { name: "Cayenne", hsn: "0583", tsn: "AHK" },
      { name: "Macan", hsn: "0583", tsn: "AHL" },
      { name: "Taycan", hsn: "0583", tsn: "AHM" },
    ],
  },
};

async function main() {
  console.log("Seeding vehicle data...");

  for (const [makeName, data] of Object.entries(VEHICLE_DATA)) {
    const make = await prisma.vehicleMake.upsert({
      where: { name: makeName },
      update: {},
      create: { name: makeName },
    });

    for (const model of data.models) {
      await prisma.vehicleModel.upsert({
        where: { hsn_tsn: { hsn: model.hsn, tsn: model.tsn } },
        update: {},
        create: {
          name: model.name,
          hsn: model.hsn,
          tsn: model.tsn,
          makeId: make.id,
          yearFrom: 2015,
          yearTo: 2025,
        },
      });
    }

    console.log(`  ✓ ${makeName}: ${data.models.length} models`);
  }

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

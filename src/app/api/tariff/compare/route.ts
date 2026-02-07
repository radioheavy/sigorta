import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { getCached, setCache } from "@/lib/redis";
import { generateCacheKey, hashIP } from "@/lib/utils";
import { TariffRequest, TariffResponse } from "@/services/tariff/adapter";
import { BlaudirektAdapter } from "@/services/tariff/blaudirekt.adapter";
import { FondsnetAdapter } from "@/services/tariff/fondsnet.adapter";
import { sortTariffs } from "@/services/tariff/comparator";

const adapters = [new BlaudirektAdapter(), new FondsnetAdapter()];

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    let tariffReq: TariffRequest;

    if (body.fromSession) {
      // Build request from session data
      if (!session.vehicleData || !session.driverData || !session.insuranceType) {
        return NextResponse.json(
          { error: "Bitte füllen Sie zuerst Fahrzeug- und Fahrerdaten aus" },
          { status: 400 }
        );
      }
      tariffReq = {
        vehicle: {
          makeId: session.vehicleData.makeId || "",
          makeName: session.vehicleData.makeName || "",
          modelId: session.vehicleData.modelId || "",
          modelName: session.vehicleData.modelName || "",
          year: session.vehicleData.year || new Date().getFullYear(),
          engineType: session.vehicleData.engineType || "BENZIN",
          registrationDate: session.vehicleData.registrationDate || "",
        },
        driver: {
          age: session.driverData.age || 30,
          experienceYears: session.driverData.experienceYears || 5,
          sfKlasse: session.driverData.sfKlasse || "SF5",
        },
        insurance: {
          insuranceType: session.insuranceType as "HAFTPFLICHT" | "TEILKASKO" | "VOLLKASKO",
          deductible: session.vehicleData.deductible || 150,
        },
      };
    } else {
      tariffReq = body;
    }

    // Check cache
    const cacheKey = `tariff:${generateCacheKey(tariffReq as never)}`;
    const cached = await getCached<TariffResponse[]>(cacheKey);

    let results: TariffResponse[];

    if (cached) {
      results = cached;
    } else {
      // Fetch from all adapters in parallel
      const settled = await Promise.allSettled(
        adapters.map(async (adapter) => {
          const available = await adapter.isAvailable();
          if (!available) return [];
          return adapter.fetchTariffs(tariffReq);
        })
      );

      results = settled.flatMap((s) =>
        s.status === "fulfilled" ? s.value : []
      );

      // Cache results
      await setCache(cacheKey, results, 3600);
    }

    // Sort by price ascending
    results = sortTariffs(results, "price_asc");

    // Save to database
    if (session.sessionDbId) {
      try {
        const ipHash = hashIP(
          req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
        );

        const query = await prisma.tariffQuery.create({
          data: {
            sessionId: session.sessionDbId,
            vehicleData: tariffReq.vehicle as never,
            driverData: tariffReq.driver as never,
            insuranceType: tariffReq.insurance.insuranceType,
            deductible: tariffReq.insurance.deductible,
            cacheKey,
            results: {
              create: results.map((r) => ({
                provider: r.provider,
                productName: r.productName,
                monthlyPrice: r.monthlyPrice,
                yearlyPrice: r.yearlyPrice,
                coverage: r.coverage as never,
                rating: r.rating,
                sourceAdapter: r.sourceAdapter,
              })),
            },
          },
          include: { results: true },
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            trackingId: session.trackingId!,
            sessionId: session.sessionDbId,
            action: "TARIFF_COMPARE",
            details: {
              insuranceType: tariffReq.insurance.insuranceType,
              resultCount: results.length,
              cached: !!cached,
            },
            ipHash,
          },
        });

        // Return results with DB IDs
        return NextResponse.json({
          results: query.results.map((r) => ({
            id: r.id,
            provider: r.provider,
            productName: r.productName,
            monthlyPrice: r.monthlyPrice,
            yearlyPrice: r.yearlyPrice,
            coverage: r.coverage,
            rating: r.rating,
            sourceAdapter: r.sourceAdapter,
          })),
          queryId: query.id,
          cached: !!cached,
        });
      } catch (dbError) {
        console.error("DB save error:", dbError);
      }
    }

    // Fallback: return results without DB IDs
    return NextResponse.json({
      results: results.map((r, i) => ({
        id: `temp_${i}`,
        ...r,
      })),
      cached: !!cached,
    });
  } catch (err) {
    console.error("Tariff compare error:", err);
    return NextResponse.json(
      { error: "Fehler beim Tarifvergleich" },
      { status: 500 }
    );
  }
}

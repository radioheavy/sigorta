-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('HAFTPFLICHT', 'TEILKASKO', 'VOLLKASKO');

-- CreateEnum
CREATE TYPE "EngineType" AS ENUM ('BENZIN', 'DIESEL', 'ELEKTRO', 'HYBRID', 'PLUGIN_HYBRID', 'LPG', 'CNG');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('WHATSAPP', 'TELEGRAM', 'WEB_MESSENGER', 'EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "vehicle_makes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_makes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hsn" TEXT,
    "tsn" TEXT,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "makeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "vehicleData" JSONB,
    "driverData" JSONB,
    "insuranceType" "InsuranceType",
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_queries" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "vehicleData" JSONB NOT NULL,
    "driverData" JSONB NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "deductible" INTEGER NOT NULL DEFAULT 0,
    "cacheKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tariff_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_results" (
    "id" TEXT NOT NULL,
    "queryId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "monthlyPrice" DOUBLE PRECISION NOT NULL,
    "yearlyPrice" DOUBLE PRECISION NOT NULL,
    "coverage" JSONB NOT NULL,
    "rating" DOUBLE PRECISION,
    "sourceAdapter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tariff_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tariffId" TEXT,
    "channel" "ContactChannel" NOT NULL,
    "message" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'PENDING',
    "webhookSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "sessionId" TEXT,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "necessary" BOOLEAN NOT NULL DEFAULT true,
    "functional" BOOLEAN NOT NULL DEFAULT false,
    "analytics" BOOLEAN NOT NULL DEFAULT false,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_makes_name_key" ON "vehicle_makes"("name");

-- CreateIndex
CREATE INDEX "vehicle_models_makeId_idx" ON "vehicle_models"("makeId");

-- CreateIndex
CREATE INDEX "vehicle_models_hsn_tsn_idx" ON "vehicle_models"("hsn", "tsn");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_models_hsn_tsn_key" ON "vehicle_models"("hsn", "tsn");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_trackingId_key" ON "sessions"("trackingId");

-- CreateIndex
CREATE INDEX "sessions_trackingId_idx" ON "sessions"("trackingId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "tariff_queries_sessionId_idx" ON "tariff_queries"("sessionId");

-- CreateIndex
CREATE INDEX "tariff_queries_cacheKey_idx" ON "tariff_queries"("cacheKey");

-- CreateIndex
CREATE INDEX "tariff_results_queryId_idx" ON "tariff_results"("queryId");

-- CreateIndex
CREATE INDEX "contact_requests_sessionId_idx" ON "contact_requests"("sessionId");

-- CreateIndex
CREATE INDEX "messages_sessionId_idx" ON "messages"("sessionId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_trackingId_idx" ON "audit_logs"("trackingId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "consent_records_trackingId_idx" ON "consent_records"("trackingId");

-- AddForeignKey
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "vehicle_makes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_queries" ADD CONSTRAINT "tariff_queries_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_results" ADD CONSTRAINT "tariff_results_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "tariff_queries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "tariff_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

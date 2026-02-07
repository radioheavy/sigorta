"use client";

import { useEffect, useState } from "react";
import WhatsAppButton from "./WhatsAppButton";
import TelegramButton from "./TelegramButton";
import WebMessenger from "./WebMessenger";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatPriceShort } from "@/lib/utils";
import {
  buildContactMessage,
  buildWhatsAppURL,
  buildTelegramURL,
} from "@/services/contact/message-builder";
import type { Dictionary } from "@/i18n";

interface TariffInfo {
  id: string;
  provider: string;
  productName: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

interface SessionInfo {
  trackingId: string;
  vehicleData?: {
    makeName?: string;
    modelName?: string;
  };
  insuranceType?: string;
}

interface ContactPanelProps {
  tariffId: string;
  dict: Dictionary;
}

export default function ContactPanel({ tariffId, dict }: ContactPanelProps) {
  const [tariff, setTariff] = useState<TariffInfo | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [activeTab, setActiveTab] = useState<"channels" | "messenger">("channels");
  const t = dict.contact;
  const mb = dict.messageBuilder;

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setSessionInfo(data))
      .catch(() => {});
  }, []);

  const message = sessionInfo
    ? buildContactMessage(
        {
          trackingId: sessionInfo.trackingId || "N/A",
          vehicleName: sessionInfo.vehicleData
            ? `${sessionInfo.vehicleData.makeName} ${sessionInfo.vehicleData.modelName}`
            : undefined,
          insuranceType: sessionInfo.insuranceType,
          provider: tariff?.provider,
          productName: tariff?.productName,
          monthlyPrice: tariff?.monthlyPrice,
        },
        mb
      )
    : "";

  const whatsappUrl = buildWhatsAppURL(
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "+4915123456789",
    message
  );
  const telegramUrl = buildTelegramURL(
    process.env.NEXT_PUBLIC_TELEGRAM_BOT || "sigortabot",
    message
  );

  const logContact = async (channel: string) => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tariffId: tariffId || "unknown",
          channel,
        }),
      });
    } catch {
      // non-critical
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Selected tariff summary */}
      <div className="lg:col-span-1">
        <Card accent className="p-6">
          <h3 className="font-bold uppercase text-xs tracking-wider mb-4 border-b-2 border-black pb-2">
            {t.selectedTariff}
          </h3>
          {tariff ? (
            <>
              <p className="font-black text-sm">{tariff.provider}</p>
              <p className="text-xs text-gray-500">{tariff.productName}</p>
              <p className="text-2xl font-black mt-2 text-accent">
                {formatPriceShort(tariff.monthlyPrice)}
              </p>
              <p className="text-[10px] text-gray-400 uppercase">{dict.tariff.perMonth}</p>
            </>
          ) : (
            <p className="text-xs text-gray-500">
              {t.noTariff}
            </p>
          )}

          {sessionInfo && (
            <div className="mt-4 pt-4 border-t-2 border-black">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                {t.sessionInfo}
              </p>
              <Badge variant="default">{sessionInfo.trackingId}</Badge>
              {sessionInfo.insuranceType && (
                <Badge variant="accent" className="ml-1">
                  {sessionInfo.insuranceType}
                </Badge>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Contact options */}
      <div className="lg:col-span-2">
        {/* Tab toggle */}
        <div className="flex gap-0 mb-4">
          <button
            onClick={() => setActiveTab("channels")}
            className={`flex-1 border-4 border-black px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === "channels"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {t.channelsTab}
          </button>
          <button
            onClick={() => setActiveTab("messenger")}
            className={`flex-1 border-4 border-l-0 border-black px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === "messenger"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            {t.messengerTab}
          </button>
        </div>

        {activeTab === "channels" ? (
          <div className="space-y-4">
            <div className="border-4 border-black p-6">
              <h3 className="font-bold uppercase text-xs tracking-wider mb-4">
                {t.chooseChannel}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WhatsAppButton
                  url={whatsappUrl}
                  onClick={() => logContact("WHATSAPP")}
                />
                <TelegramButton
                  url={telegramUrl}
                  onClick={() => logContact("TELEGRAM")}
                />
              </div>
            </div>

            <div className="border-4 border-black p-6 bg-gray-50">
              <h3 className="font-bold uppercase text-xs tracking-wider mb-2">
                {t.prefilledMessage}
              </h3>
              <pre className="text-xs whitespace-pre-wrap text-gray-600 bg-white border-2 border-black p-4">
                {message || t.loadingMessage}
              </pre>
            </div>
          </div>
        ) : (
          <WebMessenger dict={dict} />
        )}
      </div>
    </div>
  );
}

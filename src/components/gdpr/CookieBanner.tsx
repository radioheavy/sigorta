"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface ConsentState {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    // Check if consent was already given
    fetch("/api/consent")
      .then((res) => res.json())
      .then((data) => {
        if (!data.consent) {
          setVisible(true);
        }
      })
      .catch(() => setVisible(true));
  }, []);

  const saveConsent = async (consentData: ConsentState) => {
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consentData),
      });
    } catch {
      // non-critical
    }
    setVisible(false);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, functional: true, analytics: true });
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, functional: false, analytics: false });
  };

  const confirmSelection = () => {
    saveConsent(consent);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-4 border-black bg-black text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="font-bold uppercase text-xs tracking-wider mb-2">
              Cookie-Einstellungen
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu
              bieten. Technisch notwendige Cookies sind immer aktiv.
            </p>
          </div>

          {!showDetails ? (
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-white border-white hover:border-accent"
                onClick={() => setShowDetails(true)}
              >
                Einstellungen
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={rejectAll}
              >
                Alle ablehnen
              </Button>
              <Button variant="accent" size="sm" onClick={acceptAll}>
                Alle akzeptieren
              </Button>
            </div>
          ) : (
            <div className="w-full sm:w-auto">
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="accent-accent"
                  />
                  <span className="uppercase tracking-wider font-bold">
                    Notwendig
                  </span>
                  <span className="text-gray-400">(Immer aktiv)</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.functional}
                    onChange={(e) =>
                      setConsent((prev) => ({
                        ...prev,
                        functional: e.target.checked,
                      }))
                    }
                    className="accent-accent"
                  />
                  <span className="uppercase tracking-wider font-bold">
                    Funktional
                  </span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent.analytics}
                    onChange={(e) =>
                      setConsent((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="accent-accent"
                  />
                  <span className="uppercase tracking-wider font-bold">
                    Analyse
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-black"
                  onClick={rejectAll}
                >
                  Alle ablehnen
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={confirmSelection}
                >
                  Auswahl bestätigen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

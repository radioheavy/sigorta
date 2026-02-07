"use client";

import { useSearchParams, useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ContactPanel from "@/components/contact/ContactPanel";
import { isValidLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

function useDictionary(lang: Locale): Dictionary | null {
  const [dict, setDict] = useState<Dictionary | null>(null);
  useEffect(() => {
    import(`@/i18n/dictionaries/${lang}.json`).then((m) => setDict(m.default));
  }, [lang]);
  return dict;
}

function KontaktContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const rawLang = params.lang as string;
  const lang = isValidLocale(rawLang) ? rawLang : "de";
  const dict = useDictionary(lang as Locale);
  const tariffId = searchParams.get("tariffId") || "";

  if (!dict) return <div className="p-8 text-center">...</div>;

  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          {dict.contact.title}
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          {dict.contact.stepInfo}
        </p>
      </div>
      <ContactPanel tariffId={tariffId} dict={dict} />
    </div>
  );
}

export default function KontaktPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">...</div>}>
      <KontaktContent />
    </Suspense>
  );
}

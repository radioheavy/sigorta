import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const t = dict.legal.datenschutz;

  const sections = [
    { title: t.s1Title, text: t.s1Text },
    { title: t.s2Title, text: t.s2Text },
    { title: t.s3Title, text: t.s3Text },
    { title: t.s4Title, text: t.s4Text },
    { title: t.s5Title, text: t.s5Text },
    { title: t.s6Title, text: t.s6Text },
    { title: t.s7Title, text: t.s7Text },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-4 border-black p-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">
          {t.title}
        </h1>
        <div className="space-y-6 text-sm leading-relaxed">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
                {s.title}
              </h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

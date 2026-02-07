import DriverForm from "@/components/forms/DriverForm";
import { getDictionary } from "@/i18n";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function FahrerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <div className="border-b-4 border-black pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          {dict.driver.title}
        </h1>
        <p className="text-xs text-gray-600 mt-2 uppercase tracking-wider">
          {dict.driver.stepInfo}
        </p>
      </div>
      <DriverForm lang={lang} dict={dict} />
    </div>
  );
}

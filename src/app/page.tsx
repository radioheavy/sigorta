import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero */}
      <section className="py-16 sm:py-24">
        <div className="border-4 border-black p-8 sm:p-12 bg-white">
          <div className="border-b-4 border-black pb-8 mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase leading-tight tracking-tighter">
              KFZ VERSICHERUNG
              <br />
              <span className="bg-accent px-2">VERGLEICHEN</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
            Vergleichen Sie KFZ-Versicherungen anonym und kostenlos. Keine
            Registrierung erforderlich. Erhalten Sie sofort Angebote von
            mehreren Versicherern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/fahrzeug">
              <Button size="lg" variant="accent">
                Jetzt Vergleichen →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          <div className="border-4 border-black p-6 sm:border-r-0">
            <div className="w-12 h-12 bg-black text-accent flex items-center justify-center text-2xl font-black mb-4">
              1
            </div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-2">
              Fahrzeug eingeben
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Geben Sie Ihre Fahrzeugdaten per HSN/TSN oder manuell ein.
            </p>
          </div>
          <div className="border-4 border-black p-6 sm:border-r-0">
            <div className="w-12 h-12 bg-black text-accent flex items-center justify-center text-2xl font-black mb-4">
              2
            </div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-2">
              Tarife vergleichen
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Erhalten Sie sofort Angebote von mehreren Versicherern.
            </p>
          </div>
          <div className="border-4 border-black p-6">
            <div className="w-12 h-12 bg-black text-accent flex items-center justify-center text-2xl font-black mb-4">
              3
            </div>
            <h3 className="font-bold uppercase text-sm tracking-wider mb-2">
              Berater kontaktieren
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Kontaktieren Sie unsere Berater per WhatsApp, Telegram oder Chat.
            </p>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="pb-16">
        <div className="border-4 border-black bg-black text-white p-8 flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="text-center">
            <p className="text-3xl font-black text-accent">100%</p>
            <p className="text-xs uppercase tracking-wider mt-1">Anonym</p>
          </div>
          <div className="w-px h-12 bg-gray-600 hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-black text-accent">DSGVO</p>
            <p className="text-xs uppercase tracking-wider mt-1">Konform</p>
          </div>
          <div className="w-px h-12 bg-gray-600 hidden sm:block" />
          <div className="text-center">
            <p className="text-3xl font-black text-accent">Sofort</p>
            <p className="text-xs uppercase tracking-wider mt-1">Ergebnisse</p>
          </div>
        </div>
      </section>
    </div>
  );
}

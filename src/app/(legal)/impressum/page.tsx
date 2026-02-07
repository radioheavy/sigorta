export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-4 border-black p-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">
          Impressum
        </h1>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              KFZ Vergleich GmbH
              <br />
              Musterstraße 1<br />
              10115 Berlin
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              Kontakt
            </h2>
            <p>
              Telefon: +49 (0) 30 123456789
              <br />
              E-Mail: info@kfz-vergleich.de
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              Handelsregister
            </h2>
            <p>
              Registergericht: Amtsgericht Berlin-Charlottenburg
              <br />
              Registernummer: HRB 123456
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a
              Umsatzsteuergesetz: DE123456789
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Max Mustermann
              <br />
              Musterstraße 1<br />
              10115 Berlin
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              Haftungsausschluss
            </h2>
            <p>
              Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
              sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

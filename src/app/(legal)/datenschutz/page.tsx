export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="border-4 border-black p-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black pb-4 mb-6">
          Datenschutzerklärung
        </h1>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO)
              ist der Betreiber dieser Webseite. Kontaktdaten finden Sie im
              Impressum.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              2. Erhebung und Verarbeitung personenbezogener Daten
            </h2>
            <p>
              Wir verarbeiten personenbezogene Daten nur, soweit dies zur
              Bereitstellung einer funktionsfähigen Website sowie unserer
              Inhalte und Leistungen erforderlich ist. Die Verarbeitung
              personenbezogener Daten erfolgt nur nach Einwilligung des Nutzers
              (Art. 6 Abs. 1 lit. a DSGVO) oder wenn die Verarbeitung zur
              Erfüllung eines Vertrags erforderlich ist (Art. 6 Abs. 1 lit. b
              DSGVO).
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              3. Anonyme Nutzung
            </h2>
            <p>
              Unser Versicherungsvergleich kann vollständig anonym genutzt
              werden. Es werden keine personenbezogenen Daten erhoben, bis Sie
              aktiv Kontakt mit einem Berater aufnehmen. Die eingegebenen
              Fahrzeug- und Fahrerinformationen werden nur in einer anonymen
              Session gespeichert, die nach 24 Stunden automatisch gelöscht
              wird.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              4. Cookies
            </h2>
            <p>
              Wir verwenden technisch notwendige Cookies für die
              Session-Verwaltung. Funktionale und analytische Cookies werden nur
              nach ausdrücklicher Einwilligung gesetzt. Sie können Ihre
              Einwilligung jederzeit über die Cookie-Einstellungen im Footer
              widerrufen.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              5. IP-Adressen
            </h2>
            <p>
              IP-Adressen werden ausschließlich in gehashter Form gespeichert.
              Ein täglicher Salt verhindert die Rückverfolgung. Die gehashten
              IP-Adressen dienen ausschließlich dem Schutz vor Missbrauch (Rate
              Limiting).
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              6. Ihre Rechte
            </h2>
            <p>
              Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung
              (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der
              Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20
              DSGVO) und Widerspruch (Art. 21 DSGVO). Zur Ausübung Ihrer Rechte
              können Sie sich jederzeit an uns wenden.
            </p>
          </section>

          <section>
            <h2 className="font-bold uppercase tracking-wider text-sm mb-2">
              7. Kontakt
            </h2>
            <p>
              Bei Fragen zum Datenschutz wenden Sie sich bitte an den
              Datenschutzbeauftragten unter den im Impressum genannten
              Kontaktdaten.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

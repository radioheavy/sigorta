import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-4 border-black bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <span className="text-accent font-bold text-lg">K</span>
          </div>
          <span className="font-bold text-sm uppercase tracking-wider group-hover:text-accent transition-colors">
            KFZ Vergleich
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors"
          >
            Startseite
          </Link>
          <Link
            href="/fahrzeug"
            className="text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors"
          >
            Vergleichen
          </Link>
        </nav>
      </div>
    </header>
  );
}

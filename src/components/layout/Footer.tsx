import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-black text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">
            &copy; {new Date().getFullYear()} KFZ Vergleich
          </p>
          <nav className="flex items-center gap-4">
            <Link
              href="/impressum"
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-accent transition-colors"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-accent transition-colors"
            >
              Datenschutz
            </Link>
            <Link
              href="/agb"
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-accent transition-colors"
            >
              AGB
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

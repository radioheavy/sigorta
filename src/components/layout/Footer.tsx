import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="border-t-4 border-black bg-black text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-wider text-gray-400">
            &copy; {new Date().getFullYear()} {dict.footer.copyright}
          </p>
          <nav className="flex items-center gap-4">
            <Link
              href={`/${lang}/impressum`}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-accent transition-colors"
            >
              {dict.footer.imprint}
            </Link>
            <Link
              href={`/${lang}/datenschutz`}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-accent transition-colors"
            >
              {dict.footer.privacy}
            </Link>
            <Link
              href={`/${lang}/agb`}
              className="text-xs uppercase tracking-wider text-gray-400 hover:text-accent transition-colors"
            >
              {dict.footer.terms}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

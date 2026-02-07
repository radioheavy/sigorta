"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname();

  const switchLangPath = (targetLang: Locale) => {
    // Replace the current locale segment with the target
    const segments = pathname.split("/");
    segments[1] = targetLang;
    return segments.join("/");
  };

  return (
    <header className="border-b-4 border-black bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <span className="text-accent font-bold text-lg">K</span>
          </div>
          <span className="font-bold text-sm uppercase tracking-wider group-hover:text-accent transition-colors hidden sm:block">
            {dict.nav.brand}
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href={`/${lang}`}
              className="text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors hidden sm:block"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${lang}/fahrzeug`}
              className="text-xs font-bold uppercase tracking-wider hover:text-accent transition-colors"
            >
              {dict.nav.compare}
            </Link>
          </nav>
          {/* Language Switcher */}
          <div className="flex items-center gap-0 border-2 border-black">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={switchLangPath(locale)}
                className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  locale === lang
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {locale.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

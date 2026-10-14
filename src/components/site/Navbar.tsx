"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, Languages, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { LANGS, useI18n } from "@/lib/i18n";
import { GoldButton, Monogram } from "@/components/site/kit";
import { scrollToSection } from "@/lib/chat-bus";
import { trackCta } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";

const NAV_IDS = ["services", "saas", "pricing", "faq", "about", "contact"] as const;
type NavId = (typeof NAV_IDS)[number];

/* Abonnement factice — lecture d'une valeur « snapshot » uniquement */
const subscribeNoop = () => () => {};

/* ── Marque : monogramme + nom ─────────────────────────────── */
function BrandMark({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-[44px] items-center gap-3">
      <Monogram size={36} />
      <span className="font-serif text-lg tracking-[0.18em] text-ink">{BRAND}</span>
    </button>
  );
}

/* ── Bascule thème : soleil / lune pivotants ───────────────── */
function ThemeToggle() {
  const { t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  /* false pendant le rendu serveur, true une fois monté (sans effet) */
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const isDark = mounted ? resolvedTheme !== "light" : true;
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={t("nav.themeLabel")}
      className="relative flex h-11 w-11 items-center justify-center rounded text-mute transition-colors hover:text-ink"
    >
      <Sun
        size={20}
        strokeWidth={1.25}
        aria-hidden
        className={`absolute inset-0 m-auto transition-all duration-500 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
        }`}
      />
      <Moon
        size={20}
        strokeWidth={1.25}
        aria-hidden
        className={`absolute inset-0 m-auto transition-all duration-500 ${
          isDark ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<NavId | null>(null);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  /* Verre dépoli après 24 px, masquage au défilement vers le bas */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > last && y > 160) setHidden(true);
      else setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Section active via IntersectionObserver sur section-<id> */
  useEffect(() => {
    const els = NAV_IDS.map((id) => document.getElementById(`section-${id}`)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace("section-", "") as NavId);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Fermeture du sélecteur de langue (clic extérieur / Échap) */
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  /* Tiroir mobile : verrouille le défilement + Échap */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (id: NavId, fromDrawer = false) => {
    setActive(id);
    if (fromDrawer) {
      /* petit délai : laisser l'effet rendre le flux avant de défiler */
      setOpen(false);
      window.setTimeout(() => scrollToSection(id), 80);
    } else {
      scrollToSection(id);
    }
  };

  const navCta = () => {
    trackCta("hero", "nav-cta");
    scrollToSection("contact");
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "glass-panel" : "border-b border-transparent"}`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8 lg:px-12">
          <BrandMark onClick={() => scrollToSection("hero")} />

          {/* Liens centraux (≥ lg) */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => goTo(id)}
                aria-current={active === id ? "true" : undefined}
                className={`relative flex min-h-[44px] items-center px-1 text-sm transition-colors ${
                  active === id ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {t(`nav.${id}`)}
                <span
                  aria-hidden
                  className={`absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold transition-opacity duration-300 ${
                    active === id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {/* Cluster droite (≥ lg) : langue, thème, CTA */}
            <div className="hidden items-center gap-1 lg:flex">
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-label={t("nav.langLabel")}
                  className="flex h-11 items-center gap-1.5 rounded px-2 text-sm text-mute transition-colors hover:text-ink"
                >
                  <Languages size={18} strokeWidth={1.25} aria-hidden className="text-gold" />
                  <span className="uppercase">{lang}</span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.25}
                    aria-hidden
                    className={`transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {langOpen && (
                  <ul
                    role="listbox"
                    aria-label={t("nav.langLabel")}
                    className="glass-panel absolute right-0 top-full mt-2 w-44 rounded-lg p-1.5 shadow-2xl"
                  >
                    {LANGS.map((l) => (
                      <li key={l.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={l.code === lang}
                          onClick={() => {
                            setLang(l.code);
                            setLangOpen(false);
                          }}
                          className={`flex min-h-[44px] w-full items-center justify-between rounded-md px-3 text-sm transition-colors ${
                            l.code === lang ? "text-goldtext" : "text-mute hover:bg-surface2 hover:text-ink"
                          }`}
                        >
                          {l.name}
                          {l.code === lang && <Check size={14} strokeWidth={1.25} aria-hidden />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <ThemeToggle />
              <GoldButton onClick={navCta} className="ml-1 px-4">
                {t("nav.cta")}
              </GoldButton>
            </div>

            {/* Cluster mobile : thème + hamburger */}
            <div className="flex items-center gap-1 lg:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? t("nav.menuClose") : t("nav.menuOpen")}
                aria-expanded={open}
                className="flex h-11 w-11 items-center justify-center rounded text-ink"
              >
                {open ? (
                  <X size={22} strokeWidth={1.25} aria-hidden />
                ) : (
                  <Menu size={22} strokeWidth={1.25} aria-hidden />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tiroir plein écran (mobile) */}
      <div
        aria-hidden={!open}
        inert={!open}
        className={`glass-panel fixed inset-0 z-50 flex flex-col transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
          <BrandMark
            onClick={() => {
              setOpen(false);
              window.setTimeout(() => scrollToSection("hero"), 80);
            }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("nav.menuClose")}
            className="flex h-11 w-11 items-center justify-center rounded text-ink"
          >
            <X size={22} strokeWidth={1.25} aria-hidden />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
          {NAV_IDS.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id, true)}
              style={{ transitionDelay: open ? `${140 + i * 70}ms` : "0ms" }}
              className={`min-h-[52px] text-left font-serif text-3xl transition-all duration-700 ${
                active === id ? "text-goldtext" : "text-ink"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
            >
              {t(`nav.${id}`)}
            </button>
          ))}
        </nav>

        <div
          style={{ transitionDelay: open ? "560ms" : "0ms" }}
          className={`border-t border-line px-8 py-6 transition-all duration-700 ${
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <p className="label-caps mb-3">{t("nav.langLabel")}</p>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                aria-pressed={l.code === lang}
                className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                  l.code === lang ? "border-gold text-goldtext" : "border-line text-mute"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <ThemeToggle />
            <GoldButton
              onClick={() => {
                setOpen(false);
                window.setTimeout(navCta, 80);
              }}
            >
              {t("nav.cta")}
            </GoldButton>
          </div>
        </div>
      </div>
    </>
  );
}

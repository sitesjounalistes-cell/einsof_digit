"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Languages,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { EASE, CollapseMotion, PulseGlow } from "@/components/motion";
import { useMotionMode } from "@/components/providers";
import { LANGS, useI18n } from "@/lib/i18n";
import { GoldButton, Monogram } from "@/components/site/kit";
import { trackCta } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import { SAAS_PRODUCTS } from "@/lib/catalog";

/* ── Navigation multi-pages ─────────────────────────────────
   6 liens au ≥ lg, 8 au ≥ xl, tous dans le tiroir mobile.
   Services et Logiciels ouvrent un menu déroulant listant
   chaque pôle / chaque logiciel — l'utilisateur ne se perd
   jamais : depuis une page de détail, tout reste à un clic. */
const NAV_MAIN = ["services", "logiciels", "tarifs", "faq", "a-propos", "contact"] as const;
const NAV_XL = ["realisations", "blog", "podcast"] as const;
const NAV_DRAWER = [
  "services",
  "logiciels",
  "secteurs",
  "methode",
  "tarifs",
  "realisations",
  "blog",
  "podcast",
  "a-propos",
  "faq",
  "contact",
] as const;
type NavId = (typeof NAV_DRAWER)[number];

const ROUTES: Record<NavId, string> = {
  services: "/services",
  logiciels: "/logiciels",
  secteurs: "/secteurs",
  methode: "/methode",
  tarifs: "/tarifs",
  realisations: "/realisations",
  blog: "/blog",
  podcast: "/podcast",
  "a-propos": "/a-propos",
  faq: "/faq",
  contact: "/contact",
};

/* Slugs des pages de détail — même liste que le carrousel Services */
const SERVICE_MENU_KEYS = [
  "web",
  "software",
  "saas",
  "community",
  "acquisition",
  "training",
  "strategy",
] as const;

/* Abonnement factice — lecture d'une valeur « snapshot » uniquement */
const subscribeNoop = () => () => {};

/* ── Marque : logo client (infini doré + EINSOF DIGIT), sans fond ── */
function BrandMark() {
  return (
    <Link href="/" className="group flex min-h-[44px] items-center" aria-label={BRAND}>
      <Image
        src="/logos/einsof-digit-or.png"
        alt={BRAND}
        width={157}
        height={40}
        priority
        className="w-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
    </Link>
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

/* ── Menu déroulant desktop (bande sous le lien) ──────────────
   Ouverture au survol (avec intention) et au clic ; fermeture
   Échap / clic extérieur / navigation. Les éléments arrivent en
   cascade brève (CSS), sans re-rendu par frame. */
function NavDropdown({
  id,
  label,
  active,
  open,
  onOpen,
  onClose,
  footerLabel,
  footerHref,
  items,
  t,
}: {
  id: string;
  label: string;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  footerLabel: string;
  footerHref: string;
  items: { href: string; name: string }[];
  t: (k: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  /* Fermeture au clic extérieur + Échap */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => onClose(), 160);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        onOpen();
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        onClick={() => (open ? onClose() : onOpen())}
        className={`relative flex min-h-[44px] items-center gap-1 px-1 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
          active || open ? "text-ink" : "text-mute hover:text-ink"
        }`}
      >
        <span className="link-gold">{label}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.5}
          aria-hidden
          className={`text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span
          aria-hidden
          className={`absolute bottom-2 left-1 h-1 w-1 rounded-full bg-gold transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>

      {open && (
        <div
          id={`dropdown-${id}`}
          role="menu"
          aria-label={label}
          className="dropdown-panel glass-panel absolute left-1/2 top-full z-50 mt-2 w-[min(92vw,560px)] rounded-xl p-2.5 shadow-2xl"
        >
          <ul className="grid gap-0.5 sm:grid-cols-2">
            {items.map((item, i) => (
              <li key={item.href} style={{ animationDelay: `${0.03 + i * 0.025}s` }}>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={onClose}
                  className="dropdown-item group/item flex min-h-[44px] items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-mute transition-colors duration-200 hover:bg-surface2 hover:text-ink"
                >
                  <span className="truncate">{item.name}</span>
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.5}
                    aria-hidden
                    className="shrink-0 text-gold opacity-0 transition-all duration-200 group-hover/item:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 border-t border-line pt-1.5">
            <Link
              href={footerHref}
              onClick={onClose}
              className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg px-3 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext transition-colors duration-200 hover:bg-surface2"
            >
              {footerLabel}
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const { lightMode } = useMotionMode();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"services" | "logiciels" | null>(null);
  const [openSub, setOpenSub] = useState<"services" | "logiciels" | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  /* Verre dépoli après 24 px ; masquage au défilement vers le bas,
     réapparition dès que la direction s'inverse (framer-motion, sans re-rendu par frame) */
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160);
  });

  /* Synchronisation initiale (rechargement en milieu de page) */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Fermeture des menus ouverts dès qu'on change de page
     (réinitialisation pendant le rendu — pattern React officiel,
     évite les re-rendus en cascade d'un useEffect) */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenMenu(null);
    setOpenSub(null);
    setLangOpen(false);
  }

  /* Lien actif selon la route courante (pathname ou préfixe, ex. /blog/article) */
  const isActive = (id: NavId) => {
    const path = ROUTES[id];
    return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
  };

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

  /* Données des menus déroulants — noms de pôles traduits (i18n),
     noms de logiciels issus du catalogue (dénominations produits) */
  const serviceItems = SERVICE_MENU_KEYS.map((key) => ({
    href: `/services/${key}`,
    name: t(`services.items.${key}.name`),
  }));
  const logicielItems = SAAS_PRODUCTS.map((p) => ({
    href: `/logiciels/${p.slug}`,
    name: p.name,
  }));

  const desktopIds: readonly NavId[] = NAV_MAIN;
  const xlIds: readonly NavId[] = NAV_XL;

  const navLinkCls = (activeFlag: boolean) =>
    `relative flex min-h-[44px] items-center px-1 text-sm transition-all duration-300 hover:-translate-y-0.5 ${
      activeFlag ? "text-ink" : "text-mute hover:text-ink"
    }`;

  const navItems = (ids: readonly NavId[], extraCls = "") =>
    ids.map((id) => {
      /* Services et Logiciels : bande déroulante avec la liste complète */
      if (id === "services" || id === "logiciels") {
        const isServices = id === "services";
        return (
          <NavDropdown
            key={id}
            id={id}
            label={t(`nav.${id}`)}
            active={isActive(id)}
            open={openMenu === id}
            onOpen={() => setOpenMenu(id)}
            onClose={() => setOpenMenu((v) => (v === id ? null : v))}
            footerLabel={isServices ? t("nav.allServices") : t("nav.allLogiciels")}
            footerHref={ROUTES[id]}
            items={isServices ? serviceItems : logicielItems}
            t={t}
          />
        );
      }
      return (
        <Link
          key={id}
          href={ROUTES[id]}
          aria-current={isActive(id) ? "page" : undefined}
          className={`${extraCls} ${navLinkCls(isActive(id))}`}
          onClick={() => setOpen(false)}
        >
          <span className="link-gold">{t(`nav.${id}`)}</span>
          <span
            aria-hidden
            className={`absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold transition-opacity duration-300 ${
              isActive(id) ? "opacity-100" : "opacity-0"
            }`}
          />
        </Link>
      );
    });

  /* ── Contenus partagés (barre + tiroir) ─────────────────── */
  const hideBar = hidden && !open;
  const headerCls = `fixed inset-x-0 top-0 z-40 ${
    scrolled
      ? "glass-panel shadow-[0_12px_40px_-18px_rgba(0,0,0,0.45)]"
      : "border-b border-transparent"
  }`;

  const headerInner = (
    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8 lg:px-12">
      <BrandMark />

      {/* Liens centraux (≥ lg) : soulignement or + micro-lift + menus déroulants */}
      <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
        {navItems(desktopIds)}
        {navItems(xlIds, "hidden xl:flex")}
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
          <PulseGlow duration={4} className="ml-1">
            <GoldButton href="/contact" onClick={() => trackCta("hero", "nav-cta")}>
              {t("nav.cta")}
            </GoldButton>
          </PulseGlow>
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
  );

  const drawerTop = (
    <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
      <Link href="/" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center gap-3" aria-label={BRAND}>
        <Monogram size={36} />
        <span className="font-serif text-lg tracking-[0.18em] text-ink">{BRAND}</span>
      </Link>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label={t("nav.menuClose")}
        className="flex h-11 w-11 items-center justify-center rounded text-ink"
      >
        <X size={22} strokeWidth={1.25} aria-hidden />
      </button>
    </div>
  );

  /* Lien de tiroir, avec sous-menu déroulant pour Services / Logiciels :
     depuis une page de détail, chaque pôle reste accessible en un geste. */
  const drawerLink = (id: NavId, i: number, cascade: (node: React.ReactNode) => React.ReactNode) => {
    const hasSub = id === "services" || id === "logiciels";
    const subItems = id === "services" ? serviceItems : id === "logiciels" ? logicielItems : [];
    const subOpen = openSub === id;
    return cascade(
      <div key={id}>
        <div className="flex items-center justify-between gap-2">
          <Link
            href={ROUTES[id]}
            onClick={() => setOpen(false)}
            className={`block min-h-[48px] flex-1 text-left font-serif text-2xl leading-[48px] ${
              isActive(id) ? "text-goldtext" : "text-ink"
            }`}
          >
            {t(`nav.${id}`)}
          </Link>
          {hasSub && (
            <button
              type="button"
              onClick={() => setOpenSub(subOpen ? null : (id as "services" | "logiciels"))}
              aria-expanded={subOpen}
              aria-controls={`drawer-sub-${id}`}
              aria-label={`${t(`nav.${id}`)} — ${t("nav.submenu")}`}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                subOpen ? "border-gold text-gold" : "border-line text-mute"
              }`}
            >
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                aria-hidden
                className={`transition-transform duration-300 ${subOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        {hasSub && (
          <CollapseMotion open={subOpen} className="overflow-hidden">
            <ul id={`drawer-sub-${id}`} className="ml-1 border-l border-line py-1 pl-4" inert={!subOpen}>
              {subItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-[42px] items-center gap-2 text-[0.9375rem] text-mute transition-colors hover:text-goldtext"
                  >
                    <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold/50 transition-all duration-300 group-hover:w-2.5 group-hover:bg-gold" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES[id]}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[42px] items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-goldtext"
                >
                  <ArrowRight size={13} strokeWidth={1.5} aria-hidden />
                  {id === "services" ? t("nav.allServices") : t("nav.allLogiciels")}
                </Link>
              </li>
            </ul>
          </CollapseMotion>
        )}
      </div>
    );
  };

  const drawerBottomInner = (
    <>
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
          href="/contact"
          onClick={() => {
            setOpen(false);
            trackCta("hero", "nav-cta");
          }}
        >
          {t("nav.cta")}
        </GoldButton>
      </div>
    </>
  );

  /* ── Mode « animations réduites » : rendu statique, aucune animation ── */
  if (lightMode) {
    return (
      <>
        <header
          className={`${headerCls} transition-transform duration-500 ${
            hideBar ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          {headerInner}
        </header>
        {open && (
          <div className="glass-panel fixed inset-0 z-50 flex flex-col lg:hidden">
            {drawerTop}
            <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-8">
              {NAV_DRAWER.map((id) =>
                drawerLink(id, 0, (node) => node)
              )}
            </nav>
            <div className="border-t border-line px-8 py-6">{drawerBottomInner}</div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Barre : entrée glissée au montage, cache/show selon la direction du scroll */}
      <motion.header
        className={headerCls}
        initial={{ y: "-110%" }}
        animate={{ y: hideBar ? "-110%" : "0%" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {headerInner}
      </motion.header>

      {/* Tiroir plein écran (mobile) : ouverture animée + items en cascade */}
      {open && (
        <motion.nav
          key="mobile-menu"
          className="glass-panel fixed inset-0 z-50 flex flex-col lg:hidden"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {drawerTop}

          <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-8">
            {NAV_DRAWER.map((id, i) =>
              drawerLink(
                id,
                i,
                (node) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: EASE }}
                  >
                    {node}
                  </motion.div>
                )
              )
            )}
          </nav>

          <motion.div
            className="border-t border-line px-8 py-6"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + NAV_DRAWER.length * 0.04, duration: 0.5, ease: EASE }}
          >
            {drawerBottomInner}
          </motion.div>
        </motion.nav>
      )}
    </>
  );
}

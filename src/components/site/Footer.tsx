"use client";

import { useState, type FormEvent } from "react";
import { Lock, Waves, Bell } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Container, GoldButton, Monogram } from "@/components/site/kit";
import { useI18n } from "@/lib/i18n";
import { useMotionMode } from "@/components/providers";
import { BRAND } from "@/lib/brand";
import { submitNewsletter } from "@/lib/api-client";
import { subscribePush } from "@/lib/push-client";
import { scrollToSection, toggleAdmin } from "@/lib/chat-bus";

const NAV_IDS = ["services", "saas", "pricing", "faq", "about", "contact"] as const;
const LEGAL_DOCS = ["mentions", "privacy", "terms"] as const;
type LegalDoc = (typeof LEGAL_DOCS)[number];

const inputCls =
  "h-11 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink placeholder:text-mute focus:border-gold focus:outline-none";
const footerLinkCls =
  "inline-flex min-h-[44px] cursor-pointer items-center text-sm text-mute transition-colors hover:text-goldtext link-gold";

export function Footer() {
  const { t, lang } = useI18n();
  const { lightMode, setLightMode: setOverride } = useMotionMode();
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [email, setEmail] = useState("");
  const [newsBusy, setNewsBusy] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);

  async function handleNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newsBusy) return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error(t("footer.newsError"));
      return;
    }
    setNewsBusy(true);
    const res = await submitNewsletter(email.trim(), lang);
    setNewsBusy(false);
    if (res.ok) {
      toast.success(t("footer.newsSuccess"));
      setEmail("");
    } else {
      toast.error(t("footer.newsError"));
    }
  }

  function handleMotionToggle() {
    const next = !lightMode;
    setOverride(next);
    toast(next ? t("footer.rmOn") : t("footer.rmOff"));
  }

  async function handlePush() {
    if (pushBusy) return;
    setPushBusy(true);
    const status = await subscribePush(lang);
    setPushBusy(false);
    if (status === "enabled") toast.success(t("footer.push.enabled"));
    else if (status === "denied") toast.error(t("footer.push.denied"));
    else if (status === "unsupported") toast(t("footer.push.unsupported"));
    else toast.error(t("footer.push.error"));
  }

  return (
    <footer className="relative mt-auto border-t border-line bg-bg">
      {/* Filigrane typographique */}
      <div aria-hidden className="overflow-hidden py-10">
        <h2
          aria-hidden
          className="select-none text-center font-serif leading-none text-transparent text-[13vw]"
          style={{
            WebkitTextStroke: "1px color-mix(in srgb, var(--gold) 18%, transparent)",
          }}
        >
          {BRAND}
        </h2>
      </div>

      <Container className="grid gap-10 py-6 md:grid-cols-2 lg:grid-cols-4">
        {/* 1 — Marque */}
        <div>
          <Monogram />
          <p className="mt-4 text-sm text-mute">{t("footer.tagline")}</p>
        </div>

        {/* 2 — Navigation */}
        <nav aria-label={t("footer.navT")}>
          <h4 className="label-caps">{t("footer.navT")}</h4>
          <ul className="mt-4 space-y-2.5">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <button type="button" className={footerLinkCls} onClick={() => scrollToSection(id)}>
                  {t(`nav.${id}`)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3 — Légal */}
        <div>
          <h4 className="label-caps">{t("footer.legalT")}</h4>
          <ul className="mt-4 space-y-2.5">
            {LEGAL_DOCS.map((doc) => (
              <li key={doc}>
                <button
                  type="button"
                  className={footerLinkCls}
                  onClick={() => setLegalDoc(doc)}
                >
                  {t(`footer.legal.${doc}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 4 — Newsletter */}
        <div>
          <h4 className="label-caps">{t("footer.newsT")}</h4>
          <p className="mt-4 text-sm text-mute">{t("footer.newsText")}</p>
          <form onSubmit={handleNewsletter} className="mt-4 flex gap-2" noValidate>
            <input
              type="email"
              className={`${inputCls} min-w-0 flex-1`}
              placeholder={t("footer.newsPlaceholder")}
              aria-label={t("footer.newsPlaceholder")}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <GoldButton type="submit" disabled={newsBusy}>
              {t("footer.newsSubmit")}
            </GoldButton>
          </form>
        </div>
      </Container>

      {/* Barre inférieure */}
      <div className="border-t border-line py-5">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-mute md:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND}. {t("footer.rights")}
          </p>
          <button
            type="button"
            onClick={handleMotionToggle}
            aria-pressed={lightMode}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 px-1 transition-colors hover:text-goldtext"
          >
            <Waves className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
            {t("footer.rm")}
          </button>
          <button
            type="button"
            onClick={handlePush}
            disabled={pushBusy}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 px-1 transition-colors hover:text-goldtext disabled:opacity-50"
          >
            <Bell className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
            {t("footer.push.enable")}
          </button>
          <button
            type="button"
            onClick={toggleAdmin}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 px-1 transition-colors hover:text-goldtext"
          >
            <Lock className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
            {t("footer.admin")}
          </button>
        </Container>
      </div>

      {/* Dialogues légaux */}
      <Dialog open={legalDoc !== null} onOpenChange={(o) => !o && setLegalDoc(null)}>
        <DialogContent className="max-w-lg border-line bg-surface" aria-describedby={undefined}>
          <DialogTitle className="font-serif text-2xl">
            {legalDoc ? t(`legal.${legalDoc}.t`) : ""}
          </DialogTitle>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            {legalDoc ? t(`legal.${legalDoc}.b`) : ""}
          </p>
          <p className="mt-4 text-xs italic text-mute/70">TODO: validation juridique (H-10)</p>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

export default Footer;

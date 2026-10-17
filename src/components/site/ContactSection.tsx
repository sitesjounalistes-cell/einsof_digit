"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Check,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { SiteSettingsData } from "@/lib/site-settings-defaults";
import {
  DrawRule,
  PopIn,
  Reveal,
  SpotlightCard,
  Stagger,
  StaggerItem,
  Tilt,
} from "@/components/motion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Container, GoldButton, GoldRule, Section, SectionHeading } from "@/components/site/kit";
import { openChat, onOpenForm, consumePendingForm } from "@/lib/chat-bus";
import { submitContact } from "@/lib/api-client";
import { track, trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

const inputCls =
  "h-12 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink placeholder:text-mute focus:border-gold focus:outline-none";
const textareaCls =
  "h-auto w-full rounded-lg border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-mute focus:border-gold focus:outline-none";
const selectTriggerCls =
  "h-12 w-full rounded-lg border border-line bg-surface px-4 text-base focus:border-gold focus:outline-none dark:bg-surface dark:hover:bg-surface2 data-[size=default]:h-12";
const labelCls = "mb-1.5 block text-xs uppercase tracking-wide text-mute";

const SUBJECT_OPTIONS = ["web", "software", "saas", "marketing", "training", "quote", "other"] as const;

/* Icône lucide par plateforme configurée (réglages Site & Contact) —
   repli : Globe pour toute plateforme inconnue / « autre ». */
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  tiktok: Music2,
  youtube: Youtube,
  whatsapp: MessageCircle,
  autre: Globe,
  other: Globe,
};
const socialIcon = (platform: string): LucideIcon => SOCIAL_ICONS[platform] ?? Globe;

interface Fields {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

type ErrorKey = "firstName" | "lastName" | "phone" | "message" | "subject" | "consent";
type Errors = Partial<Record<ErrorKey, string>>;
type Status = "idle" | "submitting" | "success";

const EMPTY_FIELDS: Fields = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export function ContactSection({ heading = true }: { heading?: boolean }) {
  const { t, lang } = useI18n();
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  /* Réglages Site & Contact (API publique) — null tant que non chargé :
     le repli i18n actuel s'affiche (aucune info inventée). */
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  /* Chargement des coordonnées réelles (téléphones, e-mails, réseaux).
     Échec silencieux : le panneau garde ses valeurs par défaut. */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/site-settings", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const json = (await res.json()) as { ok: boolean; data?: SiteSettingsData };
        if (!cancelled && json.ok && json.data) setSettings(json.data);
      })
      .catch(() => {
        /* réseau indisponible — fallback i18n conservé */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (key !== "email" && key !== "company") {
      setErrors((er) => ({ ...er, [key]: undefined }));
    }
  };

  /* Pré-remplissage : (a) depuis le bus (démo / devis lancés depuis
     /contact même) et (b) demande déposée depuis une autre page
     (sessionStorage — voir chat-bus.openForm), consommée au montage. */
  useEffect(() => {
    const apply = (type: string, prefill?: Record<string, string>) => {
      if (type === "demo") {
        setStatus("idle");
        setFields((f) => ({ ...f, subject: "Démo", message: prefill?.message ?? "" }));
        setErrors({});
      } else if (type === "trial") {
        setStatus("idle");
        setFields((f) => ({
          ...f,
          subject: "Essai gratuit",
          message: prefill?.subject ? `Essai gratuit — ${prefill.subject}.` : (prefill?.message ?? ""),
        }));
        setErrors({});
      } else if (type === "quote") {
        setStatus("idle");
        setFields((f) => ({
          ...f,
          subject: t("contact.subjects.quote"),
          message: prefill?.subject ? `${t("contact.subjects.quote")} — ${prefill.subject}.` : "",
        }));
        setErrors({});
      } else {
        return;
      }
      document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => {
        document.getElementById("contact-firstName")?.focus({ preventScroll: true });
      }, 650);
    };

    const pending = consumePendingForm();
    if (pending) apply(pending.type, pending.prefill);

    const off = onOpenForm((type, prefill) => apply(type, prefill));
    return off;
  }, [t]);

  function validate(): Errors {
    const er: Errors = {};
    if (!fields.firstName.trim()) er.firstName = t("common.required");
    if (!fields.lastName.trim()) er.lastName = t("common.required");
    if (fields.phone.replace(/\s+/g, "").length < 8) er.phone = t("common.invalidPhone");
    if (fields.message.trim().length < 10) er.message = t("common.required");
    if (!fields.subject) er.subject = t("common.required");
    if (!consent) er.consent = t("common.required");
    return er;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setStatus("submitting");
    const res = await submitContact({
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      phone: fields.phone.trim(),
      email: fields.email.trim() || undefined,
      company: fields.company.trim() || undefined,
      subject: fields.subject,
      message: fields.message.trim(),
      consent,
      locale: lang,
    });
    if (res.ok) {
      setStatus("success");
      track("form_submit", { form: "contact" });
      trackCta("contact", "submit");
    } else {
      setStatus("idle");
      toast.error(t("contact.error"));
    }
  }

  /* Coordonnées réelles dès qu'elles sont configurées (réglages admin) :
     elles REMPLACENT la ligne générique « réponse sous 24 h » par les
     téléphones + e-mails cliquables. Sinon : affichage actuel (repli). */
  const phones = (settings?.phones ?? []).filter((p) => p.trim());
  const emails = (settings?.emails ?? []).filter((e) => e.trim());
  const socials = (settings?.socials ?? []).filter((s) => s.url.trim());
  const hasDirectContact = phones.length > 0 || emails.length > 0;
  const waSocial = socials.find((s) => s.platform === "whatsapp");

  const sideRows: { Icon: LucideIcon; text: string; href?: string }[] = hasDirectContact
    ? [
        ...phones.map((p) => ({
          Icon: Phone,
          text: p,
          href: `tel:${p.replace(/[^+\d]/g, "")}`,
        })),
        ...emails.map((e) => ({ Icon: Mail, text: e, href: `mailto:${e}` })),
        { Icon: Clock, text: t("contact.hoursT") },
        { Icon: MapPin, text: t("contact.address") },
      ]
    : [
        { Icon: MessageCircle, text: t("contact.responseT") },
        { Icon: Clock, text: t("contact.hoursT") },
        { Icon: MapPin, text: t("contact.address") },
      ];

  return (
    <Section id="contact" tone="surface">
      <Container className="relative">
        {heading && (
          <SectionHeading
            label={t("contact.label")}
            title={t("contact.title")}
            gold={t("contact.tGold")}
            sub={t("contact.sub")}
          />
        )}

        <DrawRule className="w-full" delay={0.15} duration={1.4} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* ── Formulaire ────────────────────────────────── */}
          <div className="rounded-2xl border border-line bg-bg p-6 md:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <PopIn className="gold-fill flex h-14 w-14 items-center justify-center rounded-full">
                  <Check className="h-7 w-7 text-ongold" strokeWidth={1.25} aria-hidden />
                </PopIn>
                <Reveal delay={0.15} y={14}>
                  <p className="font-serif text-xl">{t("contact.success")}</p>
                </Reveal>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <Stagger className="grid gap-5 md:grid-cols-2" step={0.05}>
                  <StaggerItem>
                    <label htmlFor="contact-firstName" className={labelCls}>
                      {t("contact.firstName")}
                    </label>
                    <input
                      id="contact-firstName"
                      className={inputCls}
                      autoComplete="given-name"
                      value={fields.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>
                    )}
                  </StaggerItem>

                  <StaggerItem>
                    <label htmlFor="contact-lastName" className={labelCls}>
                      {t("contact.lastName")}
                    </label>
                    <input
                      id="contact-lastName"
                      className={inputCls}
                      autoComplete="family-name"
                      value={fields.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>
                    )}
                  </StaggerItem>

                  <StaggerItem>
                    <label htmlFor="contact-phone" className={labelCls}>
                      {t("contact.phone")}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className={inputCls}
                      autoComplete="tel"
                      value={fields.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                    )}
                  </StaggerItem>

                  <StaggerItem>
                    <label htmlFor="contact-email" className={labelCls}>
                      {t("contact.email")}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={inputCls}
                      autoComplete="email"
                      value={fields.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </StaggerItem>

                  <StaggerItem className="md:col-span-2">
                    <label htmlFor="contact-company" className={labelCls}>
                      {t("contact.company")}
                    </label>
                    <input
                      id="contact-company"
                      className={inputCls}
                      autoComplete="organization"
                      value={fields.company}
                      onChange={(e) => setField("company", e.target.value)}
                    />
                  </StaggerItem>

                  <StaggerItem className="md:col-span-2">
                    <label htmlFor="contact-subject" className={labelCls}>
                      {t("contact.subject")}
                    </label>
                    <Select onValueChange={(v) => setField("subject", v)}>
                      <SelectTrigger
                        id="contact-subject"
                        className={selectTriggerCls}
                        aria-invalid={!!errors.subject}
                      >
                        {/* Texte affiché manuellement : le sujet peut être
                            prérempli par programme depuis une autre page,
                            même quand l'item correspondant n'est pas monté. */}
                        <span className={fields.subject ? "" : "opacity-50"}>
                          {fields.subject || t("contact.subject")}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {fields.subject === "Démo" && (
                          <SelectItem value="Démo">Démo</SelectItem>
                        )}
                        {fields.subject === "Essai gratuit" && (
                          <SelectItem value="Essai gratuit">Essai gratuit</SelectItem>
                        )}
                        {SUBJECT_OPTIONS.map((opt) => (
                          <SelectItem
                            key={opt}
                            value={t(`contact.subjects.${opt}`)}
                          >
                            {t(`contact.subjects.${opt}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-destructive">{errors.subject}</p>
                    )}
                  </StaggerItem>

                  <StaggerItem className="md:col-span-2">
                    <label htmlFor="contact-message" className={labelCls}>
                      {t("contact.message")}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      className={textareaCls}
                      value={fields.message}
                      onChange={(e) => setField("message", e.target.value)}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                    )}
                  </StaggerItem>
                </Stagger>

                <Reveal delay={0.2} y={14}>
                  <div className="mt-5">
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm text-mute">
                      <Checkbox
                        className="mt-0.5"
                        checked={consent}
                        onCheckedChange={(v) => {
                          setConsent(v === true);
                          setErrors((er) => ({ ...er, consent: undefined }));
                        }}
                      />
                      <span>
                        {t("contact.consent")}
                        {errors.consent && (
                          <span className="mt-1 block text-xs text-destructive">
                            {errors.consent}
                          </span>
                        )}
                      </span>
                    </label>
                  </div>
                </Reveal>

                <Reveal delay={0.3} y={14}>
                  <div className="mt-6">
                    <GoldButton
                      type="submit"
                      magnetic
                      className="w-full md:w-auto"
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          {t("contact.submitting")}
                        </>
                      ) : (
                        t("contact.submit")
                      )}
                    </GoldButton>
                  </div>
                </Reveal>
              </form>
            )}
          </div>

          {/* ── Panneau latéral ───────────────────────────── */}
          <aside className="space-y-8 lg:border-l lg:border-line lg:pl-10">
            <Reveal y={14} duration={0.6}>
              <h3 className="label-caps">{t("contact.sideT")}</h3>
            </Reveal>

            {/* Carte horaires / localisation : tilt léger + halo curseur */}
            <Tilt max={3}>
              <SpotlightCard className="rounded-xl border border-line bg-surface p-5">
                <Stagger className="space-y-5" step={0.08}>
                  {sideRows.map(({ Icon, text, href }, i) => (
                    <StaggerItem key={`${text}-${i}`}>
                      <div className="group flex items-start gap-3 transition-transform duration-300 ease-out hover:translate-x-1">
                        <span className="mt-0.5 inline-flex transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden />
                        </span>
                        {href ? (
                          <a
                            href={href}
                            className="text-sm text-mute transition-colors hover:text-goldtext link-gold"
                          >
                            {text}
                          </a>
                        ) : (
                          <p className="text-sm text-mute">{text}</p>
                        )}
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </SpotlightCard>
            </Tilt>

            {/* Réseaux sociaux configurés — rangée d'icônes cliquables.
                Masquée tant qu'aucun réseau n'est renseigné (réglages). */}
            {socials.length > 0 && (
              <Reveal delay={0.05} y={14}>
                <div>
                  <h3 className="label-caps mb-3">{t("contact.followT")}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {socials.map((s, i) => {
                      const Icon = socialIcon(s.platform);
                      return (
                        <a
                          key={`${s.platform}-${i}`}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label || s.platform}
                          title={s.label || s.platform}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-mute transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-goldtext"
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.25} aria-hidden />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            )}

            {/* WhatsApp : lien réel dès qu'un réseau « whatsapp » est
                configuré, sinon mention « activation en cours » (repli). */}
            <Reveal delay={0.1} y={18}>
              <div>
                <p className="text-sm font-medium text-ink">{t("contact.whatsappT")}</p>
                {waSocial ? (
                  <a
                    href={waSocial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-gold mt-0.5 inline-flex min-h-[44px] items-center text-sm text-mute hover:text-goldtext"
                  >
                    {waSocial.label || t("contact.whatsappT")}
                  </a>
                ) : (
                  <p className="text-sm text-mute">{t("contact.whatsappSoon")}</p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15} y={18}>
              <GoldRule />
            </Reveal>

            <Reveal delay={0.2} y={18}>
              <GoldButton
                variant="ghost"
                magnetic
                onClick={() => {
                  openChat();
                  trackCta("contact", "chat");
                }}
              >
                {t("hero.ctaChat")}
              </GoldButton>
            </Reveal>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

export default ContactSection;

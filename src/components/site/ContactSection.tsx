"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Clock, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container, GoldButton, GoldRule, Section, SectionHeading } from "@/components/site/kit";
import { openChat, onOpenForm } from "@/lib/chat-bus";
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

export function ContactSection() {
  const { t, lang } = useI18n();
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const setField = (key: keyof Fields, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (key !== "email" && key !== "company") {
      setErrors((er) => ({ ...er, [key]: undefined }));
    }
  };

  /* Pré-remplissage depuis le bus (démo / devis) + défilement vers la section */
  useEffect(() => {
    const off = onOpenForm((type, prefill) => {
      if (type === "demo") {
        setStatus("idle");
        setFields((f) => ({ ...f, subject: "Démo", message: prefill?.message ?? "" }));
        setErrors({});
      } else if (type === "quote") {
        setStatus("idle");
        setFields((f) => ({ ...f, subject: t("contact.subjects.quote") }));
        setErrors({});
      } else {
        return;
      }
      document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => {
        document.getElementById("contact-firstName")?.focus({ preventScroll: true });
      }, 650);
    });
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

  return (
    <Section id="contact" tone="surface">
      <Container>
        <SectionHeading
          label={t("contact.label")}
          title={t("contact.title")}
          gold={t("contact.tGold")}
          sub={t("contact.sub")}
        />

        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* ── Formulaire ────────────────────────────────── */}
          <div className="rounded-2xl border border-line bg-bg p-6 md:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span className="gold-fill flex h-14 w-14 items-center justify-center rounded-full">
                  <Check className="h-7 w-7 text-ongold" strokeWidth={1.25} aria-hidden />
                </span>
                <p className="font-serif text-xl">{t("contact.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
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
                  </div>

                  <div>
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
                  </div>

                  <div>
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
                  </div>

                  <div>
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
                  </div>

                  <div className="md:col-span-2">
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
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="contact-subject" className={labelCls}>
                      {t("contact.subject")}
                    </label>
                    <Select
                      value={fields.subject || undefined}
                      onValueChange={(v) => setField("subject", v)}
                    >
                      <SelectTrigger
                        id="contact-subject"
                        className={selectTriggerCls}
                        aria-invalid={!!errors.subject}
                      >
                        <SelectValue placeholder={t("contact.subject")} />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.subject === "Démo" && (
                          <SelectItem value="Démo">Démo</SelectItem>
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
                  </div>

                  <div className="md:col-span-2">
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
                  </div>
                </div>

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

                <div className="mt-6">
                  <GoldButton
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? t("contact.submitting") : t("contact.submit")}
                  </GoldButton>
                </div>
              </form>
            )}
          </div>

          {/* ── Panneau latéral ───────────────────────────── */}
          <aside className="space-y-8 lg:border-l lg:border-line lg:pl-10">
            <h3 className="label-caps">{t("contact.sideT")}</h3>

            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden />
              <p className="text-sm text-mute">{t("contact.responseT")}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden />
              <p className="text-sm text-mute">{t("contact.hoursT")}</p>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} aria-hidden />
              <p className="text-sm text-mute">{t("contact.address")}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-ink">{t("contact.whatsappT")}</p>
              <p className="text-sm text-mute">{t("contact.whatsappSoon")}</p>
            </div>

            <GoldRule />

            <GoldButton
              variant="ghost"
              onClick={() => {
                openChat();
                trackCta("contact", "chat");
              }}
            >
              {t("hero.ctaChat")}
            </GoldButton>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

export default ContactSection;

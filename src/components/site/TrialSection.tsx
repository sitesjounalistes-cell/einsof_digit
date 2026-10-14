"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Container, GoldButton, Section } from "@/components/site/kit";
import { SAAS_PRODUCTS } from "@/lib/catalog";
import { submitTrial } from "@/lib/api-client";
import { track, trackCta } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

const inputCls =
  "h-12 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink placeholder:text-mute focus:border-gold focus:outline-none";
const selectTriggerCls =
  "h-12 w-full rounded-lg border border-line bg-surface px-4 text-base focus:border-gold focus:outline-none dark:bg-surface dark:hover:bg-surface2 data-[size=default]:h-12";

type Status = "idle" | "submitting" | "success";

export function TrialSection() {
  const { t, lang } = useI18n();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saasSlug, setSaasSlug] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const valid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    phone.replace(/\s+/g, "").length >= 8 &&
    saasSlug !== "" &&
    consent;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid || status === "submitting") return;
    setStatus("submitting");
    const res = await submitTrial({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      saasSlug,
      consent: true,
      locale: lang,
    });
    if (res.ok) {
      setStatus("success");
      track("trial_requested", { saas: saasSlug });
      trackCta("trial", "submit");
    } else {
      setStatus("idle");
      toast.error(res.status === 409 ? t("trial.dup") : t("trial.error"));
    }
  }

  return (
    <Section id="trial" tone="deep">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="gold-frame rounded-2xl bg-bg p-6 md:p-12">
            <p className="label-caps">{t("trial.label")}</p>
            <h2 className="display-2 mt-3">
              {t("trial.title")}{" "}
              <em className="gold-text-gradient font-serif italic">{t("trial.tGold")}</em>
            </h2>
            <p className="lead-text mt-4">{t("trial.sub")}</p>

            {status === "success" ? (
              <div className="mt-8 flex flex-col items-center gap-4 text-center">
                <span className="gold-fill flex h-14 w-14 items-center justify-center rounded-full">
                  <Check className="h-7 w-7 text-ongold" strokeWidth={1.25} aria-hidden />
                </span>
                <p className="font-serif text-xl">{t("trial.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mt-8 grid gap-4 md:grid-cols-4">
                  <input
                    className={inputCls}
                    placeholder={t("trial.firstName")}
                    aria-label={t("trial.firstName")}
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    className={inputCls}
                    placeholder={t("trial.lastName")}
                    aria-label={t("trial.lastName")}
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    className={inputCls}
                    type="tel"
                    placeholder={t("trial.phone")}
                    aria-label={t("trial.phone")}
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Select value={saasSlug || undefined} onValueChange={setSaasSlug}>
                    <SelectTrigger className={selectTriggerCls} aria-label={t("trial.saas")}>
                      <SelectValue placeholder={t("trial.saasPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SAAS_PRODUCTS.map((p) => (
                        <SelectItem key={p.slug} value={p.slug}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-mute">
                    <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                    {t("trial.consent")}
                  </label>
                  <p className="mt-1 text-xs text-mute">{t("trial.note")}</p>
                </div>

                <div className="mt-6">
                  <GoldButton type="submit" disabled={!valid || status === "submitting"}>
                    {status === "submitting" ? t("trial.submitting") : t("trial.submit")}
                  </GoldButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default TrialSection;

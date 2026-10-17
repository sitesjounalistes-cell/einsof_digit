"use client";

/**
 * Carte « Créneaux de démonstration » du chat (tâche 6-c).
 * Affiche les créneaux réels renvoyés par l'action suggest_slots et
 * permet de réserver via un mini-formulaire inline → POST /api/demo/book.
 * Style chat : verre noir, filets or, aucun emoji, aucune couleur bleue,
 * cibles tactiles ≥ 44 px, tout texte via t().
 */

import React, { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SAAS_PRODUCTS } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEMO_TZ = "Africa/Conakry";

export interface DemoSlotView {
  id: string;
  startsAt: string;
  remaining: number;
}

/** « mar. 21 oct. · 10:00 » — heure de Conakry, formaté dans la langue de l'interface. */
export function formatDemoSlot(iso: string, lang: string): string {
  try {
    const d = new Date(iso);
    const date = new Intl.DateTimeFormat(lang, {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: DEMO_TZ,
    }).format(d);
    const time = new Intl.DateTimeFormat(lang, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: DEMO_TZ,
    }).format(d);
    return `${date} · ${time}`;
  } catch {
    return iso;
  }
}

interface DemoSlotsCardProps {
  slots: DemoSlotView[];
  onBooked: (startsAt: string) => void;
  onFailure: (reason: string) => void;
}

export function DemoSlotsCard({ slots, onBooked, onFailure }: DemoSlotsCardProps) {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saas, setSaas] = useState("none");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedSlot = slots.find((s) => s.id === selected) ?? null;

  const submit = async () => {
    if (!selectedSlot || submitting) return;
    const digits = (phone.match(/\d/g) ?? []).length;
    if (!firstName.trim() || !lastName.trim() || digits < 7 || phone.trim().length > 20) {
      setError(t("common.invalidPhone"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/demo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          saasSlug: saas !== "none" ? saas : undefined,
          slotId: selectedSlot.id,
          locale: lang,
          consentContact: true,
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        data?: { startsAt?: string };
        error?: { code?: string };
      } | null;
      if (res.ok && json?.ok && json.data?.startsAt) {
        onBooked(json.data.startsAt);
        return;
      }
      const code = String(json?.error?.code ?? "error");
      onFailure(code === "validation" ? "error" : code);
      setSelected(null);
    } catch {
      onFailure("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gold/30 bg-surface/80 p-3.5">
      <p className="flex items-center gap-2 text-sm font-medium text-ink">
        <CalendarClock className="h-4 w-4 shrink-0 text-goldtext" strokeWidth={1.5} />
        {t("chat.demo.title")}
      </p>
      <p className="mt-1 text-[0.8125rem] leading-snug text-mute">{t("chat.demo.intro")}</p>

      {selectedSlot ? (
        <div className="mt-3">
          <p className="text-[0.8125rem] text-goldtext">
            {formatDemoSlot(selectedSlot.startsAt, lang)} ({t("chat.demo.tz")})
          </p>
          <p className="mt-2 text-xs font-medium uppercase tracking-widest text-mute">
            {t("chat.demo.formT")}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("chat.demo.firstName")}
              aria-label={t("chat.demo.firstName")}
              autoComplete="given-name"
              className="h-11 rounded-lg border-line bg-surface text-sm focus-visible:border-gold focus-visible:ring-gold/20"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("chat.demo.lastName")}
              aria-label={t("chat.demo.lastName")}
              autoComplete="family-name"
              className="h-11 rounded-lg border-line bg-surface text-sm focus-visible:border-gold focus-visible:ring-gold/20"
            />
          </div>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("chat.demo.phone")}
            aria-label={t("chat.demo.phone")}
            type="tel"
            autoComplete="tel"
            className="mt-2 h-11 rounded-lg border-line bg-surface text-sm focus-visible:border-gold focus-visible:ring-gold/20"
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("chat.demo.email")}
            aria-label={t("chat.demo.email")}
            type="email"
            autoComplete="email"
            className="mt-2 h-11 rounded-lg border-line bg-surface text-sm focus-visible:border-gold focus-visible:ring-gold/20"
          />
          <Select value={saas} onValueChange={setSaas}>
            <SelectTrigger
              aria-label={t("chat.demo.saas")}
              className="mt-2 h-11 rounded-lg border-line bg-surface text-sm focus:border-gold"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[110]">
              <SelectItem value="none" className="text-sm">
                {t("chat.demo.saasNone")}
              </SelectItem>
              {SAAS_PRODUCTS.map((p) => (
                <SelectItem key={p.slug} value={p.slug} className="text-sm">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-[0.6875rem] leading-snug text-mute">
            {t("chat.demo.consentNote")}
          </p>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void submit()}
              disabled={submitting}
              className="h-11 flex-1 rounded-full border-gold bg-gold text-sm font-medium text-ongold hover:bg-gold/90"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden />
              ) : null}
              {t("chat.demo.submit")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setError(null);
              }}
              disabled={submitting}
              className="h-11 rounded-full px-4 text-sm text-mute hover:text-ink"
            >
              {t("chat.demo.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {slots.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface px-3 py-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] text-ink">
                  {formatDemoSlot(s.startsAt, lang)} ({t("chat.demo.tz")})
                </span>
                <span className="block text-[0.6875rem] text-mute">
                  {t("chat.demo.seats").replace("{n}", String(s.remaining))}
                </span>
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelected(s.id)}
                className="h-[44px] shrink-0 rounded-full border-gold/50 px-4 text-[0.8125rem] text-goldtext hover:border-gold hover:bg-gold hover:text-ongold"
              >
                {t("chat.demo.book")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DemoSlotsCard;

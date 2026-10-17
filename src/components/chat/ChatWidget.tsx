"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  SendHorizontal,
  X,
  Mic,
  UserRound,
  ThumbsUp,
  ThumbsDown,
  CalendarCheck2,
} from "lucide-react";
import { useChat } from "./chat-context";
import { DemoSlotsCard, formatDemoSlot } from "./DemoSlotsCard";
import { useI18n } from "@/lib/i18n";
import { openForm, onChatOpen } from "@/lib/chat-bus";
import { Monogram } from "@/components/site/kit";
import { useMotionMode } from "@/components/providers";

const SUGGESTION_KEYS = ["chat.s1", "chat.s2", "chat.s3"] as const;

export function ChatWidget() {
  const { open, setOpen, setOmnisOpen, messages, streaming, send, sendFeedback, consentNoticeAck, ackConsentNotice, demoBooked, demoFailed } = useChat();
  const { t, lang } = useI18n();
  const { lightMode } = useMotionMode();
  const [showNudge, setShowNudge] = useState(false);
  const [input, setInput] = useState("");
  const [rated, setRated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // open via event bus (hero CTA, nav, cards…)
  useEffect(() => onChatOpen((prefill) => {
    setOpen(true);
    if (prefill) {
      void send(prefill);
    }
  }), [setOpen, send]);

  // soft nudge after 12 s, once per session (spec §22)
  useEffect(() => {
    if (lightMode) return;
    try {
      if (sessionStorage.getItem("eins-chat-nudged")) return;
    } catch { /* ignore */ }
    const timer = setTimeout(() => {
      if (!open) setShowNudge(true);
      try {
        sessionStorage.setItem("eins-chat-nudged", "1");
      } catch { /* ignore */ }
      setTimeout(() => setShowNudge(false), 6000);
    }, 12000);
    return () => clearTimeout(timer);
  }, [open, lightMode]);

  // auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  const submit = () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    void send(text);
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-[76] flex items-center gap-3">
        {showNudge && !open && (
          <div className="glass-panel animate-in fade-in slide-in-from-left-2 rounded-xl px-4 py-2.5 text-sm text-ink shadow-xl duration-300">
            {t("hero.ctaChat")}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={t("chat.title")}
          className={`fab-pulse relative flex h-[60px] w-[60px] items-center justify-center rounded-full gold-fill shadow-[0_8px_30px_rgba(212,175,55,0.35)] transition-transform duration-300 active:scale-95 ${open ? "rotate-0" : "hover:scale-105"}`}
        >
          {open ? (
            <X className="h-6 w-6 text-ongold" strokeWidth={1.5} />
          ) : (
            <MessageCircle className="h-6 w-6 text-ongold" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Window */}
      {open && (
        <div
          role="dialog"
          aria-label={t("chat.title")}
          className="glass-panel animate-in fade-in zoom-in-95 slide-in-from-bottom-3 duration-300 fixed bottom-24 right-5 z-[76] flex h-[600px] max-h-[calc(100svh-7.5rem)] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{ transformOrigin: "bottom right" }}
        >
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line/60 px-4">
            <Monogram size={32} />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-ink">{t("chat.title")}</p>
              <p className="flex items-center gap-1.5 text-[0.6875rem] text-mute">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" style={{ animation: "pulse-dot 2s infinite" }} />
                {t("chat.online")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOmnisOpen(true)}
              title={t("chat.omnis.open")}
              aria-label={t("chat.omnis.open")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-goldtext transition-colors hover:bg-gold hover:text-ongold"
            >
              <Mic className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => { openForm("contact"); setOpen(false); }}
              title={t("chat.team")}
              aria-label={t("chat.team")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-gold hover:text-goldtext"
            >
              <UserRound className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-mute transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((m, i) =>
              m.role === "assistant" && m.kind === "demo-slots" && m.slots ? (
                <DemoSlotsCard key={i} slots={m.slots} onBooked={demoBooked} onFailure={demoFailed} />
              ) : m.role === "assistant" && m.kind === "demo-system" && m.startsAt ? (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-xl border border-gold/40 bg-surface px-3.5 py-3"
                >
                  <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-goldtext" strokeWidth={1.5} />
                  <p className="text-sm leading-relaxed text-ink">
                    {t("chat.demo.confirmed").replace("{date}", formatDemoSlot(m.startsAt, lang))}
                  </p>
                </div>
              ) : m.role === "assistant" ? (
                <div key={i} className="border-l-2 border-gold/50 pl-3">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                    {m.content || (
                      <span className="inline-flex items-center gap-1 py-1.5">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full bg-gold"
                            style={{ animation: `typing 900ms ${d * 180}ms infinite ease-in-out` }}
                          />
                        ))}
                        <style>{`@keyframes typing { 0%,100% { opacity:.25; transform:scale(.85)} 50% { opacity:1; transform:scale(1.1)} }`}</style>
                      </span>
                    )}
                  </p>
                  {m.id && m === lastAssistant && m.content && !streaming && !rated && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label="Utile"
                        onClick={() => { sendFeedback(m.id, 1); setRated(true); }}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-mute transition-colors hover:border-gold hover:text-goldtext"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        aria-label="Peut mieux faire"
                        onClick={() => { sendFeedback(m.id, -1); setRated(true); }}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-mute transition-colors hover:border-gold hover:text-goldtext"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-line bg-surface2 px-4 py-2.5 text-sm text-ink">
                    {m.content}
                  </div>
                </div>
              )
            )}

            {/* Suggestions — visibles tant que le fil est au repos et que le
                dernier message vient de l'assistant : des relances d'action
                toujours à portée de main (tarifs, démo, essai) pour conclure. */}
            {!streaming && messages[messages.length - 1]?.role === "assistant" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTION_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => void send(t(k))}
                    className="rounded-full border border-gold/40 px-3.5 py-2 text-xs text-goldtext transition-colors hover:bg-gold hover:text-ongold"
                  >
                    {t(k)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Consent notice */}
          {!consentNoticeAck && (
            <div className="mx-4 mb-2 flex items-start gap-2 rounded-lg border border-line/60 bg-surface/60 px-3 py-2">
              <p className="flex-1 text-[0.6875rem] leading-snug text-mute">{t("chat.consent")}</p>
              <button
                type="button"
                onClick={ackConsentNotice}
                aria-label={t("common.close")}
                className="text-mute transition-colors hover:text-ink"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex shrink-0 items-center gap-2 border-t border-line/60 p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
              className="h-11 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-ink placeholder:text-mute focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!input.trim() || streaming}
              aria-label={t("chat.send")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gold-fill transition-transform active:scale-95 disabled:opacity-40"
            >
              <SendHorizontal className="h-4 w-4 text-ongold" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Omnis is rendered at page level */}
    </>
  );
}

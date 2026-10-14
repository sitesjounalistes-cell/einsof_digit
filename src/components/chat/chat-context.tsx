"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { useConsent, getVisitorId } from "@/lib/consent";
import { scrollToSection, openForm, type OpenFormType } from "@/lib/chat-bus";
import { track } from "@/lib/analytics";
import { SECTIONS } from "@/lib/sections-registry";

export interface ChatSlotView {
  id: string;
  startsAt: string;
  remaining: number;
}

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  /** server message id (feedback) when persisted */
  id?: number;
  /** carte des créneaux de démo (rendue par DemoSlotsCard) ou confirmation système */
  kind?: "demo-slots" | "demo-system";
  slots?: ChatSlotView[];
  startsAt?: string;
}

interface ChatContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  omnisOpen: boolean;
  setOmnisOpen: (v: boolean) => void;
  messages: ChatMsg[];
  streaming: boolean;
  send: (text: string) => Promise<void>;
  sendFeedback: (id: number | undefined, value: 1 | -1) => void;
  consentNoticeAck: boolean;
  ackConsentNotice: () => void;
  /** Réservation réussie depuis la carte de créneaux → confirmation dans le fil */
  demoBooked: (startsAt: string) => void;
  /** Échec de réservation depuis la carte → message traduit + éventuelle re-proposition */
  demoFailed: (reason: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/** Which section is the visitor currently viewing (for chatbot context). */
export function getCurrentSection(): string {
  if (typeof window === "undefined") return "hero";
  let current = "hero";
  for (const s of SECTIONS) {
    const el = document.getElementById(`section-${s.id}`);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      current = s.id;
    }
  }
  return current;
}

interface SseEvent {
  type: "token" | "action" | "done" | "error" | "lead";
  v?: string;
  tool?: string;
  args?: Record<string, unknown>;
  messageId?: number;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useI18n();
  const { setTheme } = useTheme();
  const { chatStorage } = useConsent();
  const [open, setOpen] = useState(false);
  const [omnisOpen, setOmnisOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [consentNoticeAck, setConsentNoticeAck] = useState(false);
  const sessionRef = useRef<string | null>(null);
  const sessionTried = useRef(false);

  // Welcome message per session
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.welcome") }]);
    }
     
  }, [t]);


  const ensureSession = useCallback(async () => {
    if (sessionTried.current) return;
    sessionTried.current = true;
    try {
      const res = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          locale: lang,
          mode: "text",
          entryPath: "/",
          consentChatStorage: chatStorage,
        }),
      });
      const json = await res.json();
      sessionRef.current = json?.data?.sessionId ?? null;
    } catch {
      sessionRef.current = null;
    }
  }, [lang, chatStorage]);

  /* ── Réservation de démonstration (actions suggest_slots / book_demo) ── */

  const pushDemoSlots = useCallback((slots: ChatSlotView[]) => {
    setMessages((m) => [...m, { role: "assistant", content: "", kind: "demo-slots", slots }]);
  }, []);

  const reSuggestSlots = useCallback(async () => {
    try {
      const res = await fetch("/api/demo/slots", { cache: "no-store" });
      const json = (await res.json()) as { ok?: boolean; data?: ChatSlotView[] };
      const slots = Array.isArray(json?.data) ? json.data : [];
      if (slots.length > 0) pushDemoSlots(slots);
    } catch {
      /* silencieux — le message d'erreur suffit */
    }
  }, [pushDemoSlots]);

  const demoBooked = useCallback((startsAt: string) => {
    setMessages((m) => {
      // retire la carte de créneaux qui vient d'être utilisée, puis confirme
      let idx = -1;
      for (let i = m.length - 1; i >= 0; i--) {
        if (m[i].kind === "demo-slots") {
          idx = i;
          break;
        }
      }
      const withoutCard = idx >= 0 ? [...m.slice(0, idx), ...m.slice(idx + 1)] : [...m];
      return [...withoutCard, { role: "assistant", content: "", kind: "demo-system", startsAt }];
    });
    track("demo_booked", { via: "chat" });
  }, []);

  const demoFailed = useCallback(
    (reason: string) => {
      if (reason === "full") {
        setMessages((m) => [...m, { role: "assistant", content: t("chat.demo.full") }]);
        void reSuggestSlots();
      } else if (reason === "invalid_slot") {
        setMessages((m) => [...m, { role: "assistant", content: t("chat.demo.invalidSlot") }]);
        void reSuggestSlots();
      } else if (reason === "already_booked") {
        setMessages((m) => [...m, { role: "assistant", content: t("chat.demo.already") }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: t("chat.demo.error") }]);
      }
    },
    [t, reSuggestSlots]
  );

  const handleAction = useCallback(
    (tool: string, args: Record<string, unknown>) => {
      switch (tool) {
        case "navigate": {
          const section = String(args.section ?? "");
          scrollToSection(section);
          break;
        }
        case "open_form": {
          const type = String(args.type ?? "contact") as OpenFormType;
          openForm(type, args as Record<string, string>);
          break;
        }
        case "handoff_human": {
          openForm("contact");
          break;
        }
        case "create_lead": {
          if (args._created) track("chat_lead_created", {});
          break;
        }
        case "suggest_slots": {
          const slots = Array.isArray(args.slots)
            ? (args.slots as ChatSlotView[]).filter(
                (s) => s && typeof s.id === "string" && typeof s.startsAt === "string"
              )
            : [];
          if (slots.length > 0) pushDemoSlots(slots);
          break;
        }
        case "book_demo": {
          if (args.ok === true && typeof args.startsAt === "string") {
            demoBooked(String(args.startsAt));
          } else if (args.ok === false) {
            demoFailed(String(args.reason ?? "error"));
          }
          break;
        }
        case "switch_locale": {
          const next = String(args.locale ?? "") as Lang;
          if (LANGS.some((l) => l.code === next) && next !== lang) setLang(next);
          break;
        }
        case "switch_theme": {
          const theme = String(args.theme ?? "");
          if (theme === "dark" || theme === "light") setTheme(theme);
          break;
        }
      }
    },
    [lang, setLang, setTheme, pushDemoSlots, demoBooked, demoFailed]
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      const userMsg: ChatMsg = { role: "user", content: trimmed };
      setMessages((m) => [...m, userMsg]);
      setStreaming(true);
      track("chat_message_sent", { locale: lang });

      await ensureSession();
      const history = [...messages, userMsg]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      // placeholder for the streaming reply
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionRef.current,
            message: trimmed,
            currentSection: getCurrentSection(),
            locale: lang,
            history: sessionRef.current ? undefined : history.slice(0, -1),
          }),
        });
        if (!res.body) throw new Error("no_body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        const pushToken = (v: string) =>
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            if (last?.role === "assistant") {
              copy[copy.length - 1] = { ...last, content: last.content + v };
            }
            return copy;
          });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            try {
              const ev = JSON.parse(line.slice(5)) as SseEvent;
              if (ev.type === "token" && ev.v) pushToken(ev.v);
              else if (ev.type === "action" && ev.tool) handleAction(ev.tool, ev.args ?? {});
              else if (ev.type === "done") {
                if (ev.messageId) {
                  setMessages((m) => {
                    const copy = [...m];
                    const last = copy[copy.length - 1];
                    if (last?.role === "assistant") copy[copy.length - 1] = { ...last, id: ev.messageId };
                    return copy;
                  });
                }
              } else if (ev.type === "error") {
                setMessages((m) => {
                  const copy = [...m];
                  const last = copy[copy.length - 1];
                  if (last?.role === "assistant" && !last.content) {
                    copy[copy.length - 1] = { ...last, content: t("chat.error") };
                  }
                  return copy;
                });
              }
            } catch {
              /* skip malformed chunk */
            }
          }
        }
      } catch {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant" && !last.content) {
            copy[copy.length - 1] = { ...last, content: t("chat.error") };
          }
          return copy;
        });
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, ensureSession, handleAction, lang, t]
  );

  const sendFeedback = useCallback((id: number | undefined, value: 1 | -1) => {
    if (!id) return;
    fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId: id, value }),
    }).catch(() => {});
  }, []);

  // Opening Omnis closes the text window, and vice versa
  const setOpenSafe = useCallback((v: boolean) => {
    setOpen(v);
    if (v) {
      setOmnisOpen(false);
      track("chat_opened", { locale: lang });
    }
  }, [lang]);

  const setOmnisOpenSafe = useCallback((v: boolean) => {
    setOmnisOpen(v);
    if (v) {
      setOpen(false);
      track("omnis_started", { locale: lang });
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      open,
      setOpen: setOpenSafe,
      omnisOpen,
      setOmnisOpen: setOmnisOpenSafe,
      messages,
      streaming,
      send,
      sendFeedback,
      consentNoticeAck,
      ackConsentNotice: () => setConsentNoticeAck(true),
      demoBooked,
      demoFailed,
    }),
    [open, omnisOpen, messages, streaming, send, sendFeedback, consentNoticeAck, setOpenSafe, setOmnisOpenSafe, demoBooked, demoFailed]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

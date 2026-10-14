"use client";

/** Typed fetch helpers for the public API. */

export interface TrialPayload {
  firstName: string;
  lastName: string;
  phone: string;
  saasSlug: string;
  consent: boolean;
  locale: string;
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  company?: string;
  subject: string;
  message: string;
  consent: boolean;
  locale: string;
}

async function post<T>(url: string, body: unknown): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, status: res.status, error: json?.error ?? "error" };
    return { ok: true, status: res.status, data: json?.data };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

export const submitTrial = (p: TrialPayload) => post("/api/trial", p);
export const submitContact = (p: ContactPayload) => post("/api/contact", p);
export const submitNewsletter = (email: string, locale: string) =>
  post("/api/newsletter", { email, locale });

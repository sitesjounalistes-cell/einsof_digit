/**
 * Adaptateur e-mail transactionnel (spec §25 / §21).
 * - Si RESEND_API_KEY est défini → envoi réel via l'API Resend (fetch, pas de SDK).
 * - Sinon → mode simulé : l'e-mail est journalisé en base (EmailLog, status "mock")
 *   et consultable dans l'Espace équipe. Aucune dépendance au SDK.
 * Chaque envoi (réel, simulé ou en erreur) est tracé dans email_logs.
 */
import { db } from "@/lib/db";
import { BRAND } from "@/lib/brand";

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  /** contact_ack | trial_ack | custom */
  template: string;
  leadId?: string;
}

export type EmailStatus = "sent" | "mock" | "error";

export async function sendEmail(input: SendEmailInput): Promise<EmailStatus> {
  const key = process.env.RESEND_API_KEY?.trim();
  let status: EmailStatus = "mock";
  let provider = "mock";
  let error: string | null = null;

  if (key) {
    provider = "resend";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM?.trim() || `${BRAND} <onboarding@resend.dev>`,
          to: [input.to],
          subject: input.subject,
          text: input.text,
        }),
      });
      if (res.ok) {
        status = "sent";
      } else {
        status = "error";
        error = `resend:${res.status}`;
      }
    } catch (e) {
      status = "error";
      error = e instanceof Error ? e.message : "network";
    }
  }

  try {
    await db.emailLog.create({
      data: {
        toEmail: input.to,
        subject: input.subject,
        template: input.template,
        status,
        provider,
        error,
        leadId: input.leadId ?? null,
      },
    });
  } catch (e) {
    console.error("[email] log", e);
  }

  return status;
}

/* ── Templates (français — la langue source du site) ─────────── */

export function sendContactAck(email: string, firstName: string, leadId: string) {
  const subject = `Nous avons bien reçu votre message — ${BRAND}`;
  const text = [
    `Bonjour ${firstName},`,
    ``,
    `Nous avons bien reçu votre message envoyé depuis notre site.`,
    `Notre équipe vous répond sous 24 heures ouvrées.`,
    ``,
    `En attendant, l'assistant de notre site peut déjà répondre à vos questions sur nos services, nos logiciels et nos tarifs.`,
    ``,
    `— L'équipe ${BRAND}`,
  ].join("\n");
  return sendEmail({ to: email, subject, text, template: "contact_ack", leadId });
}

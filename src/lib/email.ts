import escapeHtml from "escape-html";
import { Resend } from "resend";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.FROM_EMAIL;
const TO_EMAIL = import.meta.env.TO_EMAIL;

function getResendClient(): Resend {
  if (!RESEND_API_KEY || !FROM_EMAIL || !TO_EMAIL) {
    throw new Error("Missing required email configuration: RESEND_API_KEY, FROM_EMAIL, or TO_EMAIL");
  }
  return new Resend(RESEND_API_KEY);
}

function formatValue(value: string): string {
  if (value === "true") return "✅ Sim";
  if (value === "false") return "❌ Não";
  return escapeHtml(value) || "—";
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EnrollmentEmailData {
  fields: Record<string, string>;
  fieldLabels: Record<string, string>;
}

export async function sendContactEmail(data: ContactEmailData) {
  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: data.email,
    subject: `[Contato] ${data.subject} — ${data.name}`,
    html: `
      <h2 style="font-family:sans-serif;color:#1a1a1a;">Novo contato pelo site</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px;font-weight:bold;width:120px;">Nome</td><td style="padding:8px;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">E-mail</td><td style="padding:8px;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Assunto</td><td style="padding:8px;">${escapeHtml(data.subject)}</td></tr>
      </table>
      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e5e5;" />
      <h3 style="font-family:sans-serif;color:#1a1a1a;">Mensagem</h3>
      <p style="font-family:sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
    `,
  });
}

export async function sendEnrollmentEmail({ fields, fieldLabels }: EnrollmentEmailData) {
  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr>
          <td style="padding:8px;font-weight:bold;width:180px;vertical-align:top;">${escapeHtml(fieldLabels[key] ?? key)}</td>
          <td style="padding:8px;">${formatValue(value)}</td>
        </tr>`,
    )
    .join("");

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[Pré-inscrição] Nova solicitação de inscrição nas oficinas`,
    html: `
      <h2 style="font-family:sans-serif;color:#1a1a1a;">Nova pré-inscrição nas oficinas de música</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;">
        ${rows}
      </table>
    `,
  });
}

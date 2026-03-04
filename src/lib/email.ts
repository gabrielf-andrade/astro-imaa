import escapeHtml from "escape-html";
import { Resend } from "resend";
import { LOGO_BASE64 } from "./server/email-logo.generated";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.FROM_EMAIL;
const TO_EMAIL = import.meta.env.TO_EMAIL;

// ─── Paleta de cores da marca ─────────────────────────────────────────────────────
const COLORS = {
  primaryDark: "#05210e",
  primary: "#00561c",
  secondary: "#d4c028",
  accent: "#c45920",
  cream: "#e9f4ed",
  white: "#ffffff",
  textDark: "#1a1a0f",
  textMuted: "#4a5a4e",
  border: "#c8d8c0",
};

function getResendClient(): Resend {
  if (!RESEND_API_KEY || !FROM_EMAIL || !TO_EMAIL) {
    throw new Error("Missing required email configuration: RESEND_API_KEY, FROM_EMAIL, or TO_EMAIL");
  }
  return new Resend(RESEND_API_KEY);
}

function formatValue(value: string): string {
  if (value === "true") return "✅ Sim";
  if (value === "false") return "❌ Não";
  return value || "—";
}

// ─── Layout base do e-mail ────────────────────────────────────────────────────────
function buildEmailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Bloco Chora Bananeira</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="min-height:100vh;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.15);">

          <!-- Header -->
          <tr>
            <td align="center"
              style="background-color:${COLORS.primaryDark};background:linear-gradient(135deg,${COLORS.primaryDark} 0%,${COLORS.primary} 60%,#1a5c30 100%);padding:32px 24px 24px;">
              <img src="${LOGO_BASE64}" width="120" height="120" alt="Bloco Chora Bananeira"
                style="display:block;margin:0 auto;">
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="background:${COLORS.white};padding:32px 32px 24px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
              style="background:${COLORS.cream};padding:16px 24px;border-top:1px solid ${COLORS.border};">
              <p style="margin:0 0 4px;font-size:12px;color:${COLORS.textMuted};">
                Este e-mail foi gerado automaticamente pelo formulário do site.
              </p>
              <p style="margin:0;font-size:11px;color:${COLORS.textMuted};">
                © Bloco Chora Bananeira — Responda a este e-mail para entrar em contato com o remetente.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Linha de campo (tabela de dados) ────────────────────────────────────────────
function buildFieldRow(label: string, value: string, isLast = false): string {
  const borderBottom = isLast ? "none" : `1px solid ${COLORS.border}`;
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);
  return `
  <tr>
    <td style="padding:10px 12px;width:130px;vertical-align:top;font-size:13px;
      font-weight:700;color:${COLORS.primary};background:${COLORS.cream};
      border-bottom:${borderBottom};">
      ${safeLabel}
    </td>
    <td style="padding:10px 12px;vertical-align:top;font-size:14px;
      color:${COLORS.textDark};background:${COLORS.white};
      border-bottom:${borderBottom};">
      ${safeValue}
    </td>
  </tr>`;
}

// ─── Tipos públicos ───────────────────────────────────────────────────────────────
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

// ─── E-mail de contato ────────────────────────────────────────────────────────────
export async function sendContactEmail(data: ContactEmailData) {
  const content = `
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;
      text-transform:uppercase;color:${COLORS.accent};">Nova mensagem recebida</p>
    <h2 style="margin:0 0 24px;font-size:20px;font-weight:700;color:${COLORS.primaryDark};">
      Contato pelo site
    </h2>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border-radius:8px;overflow:hidden;border:1px solid ${COLORS.border};margin-bottom:24px;">
      ${buildFieldRow("Nome", data.name)}
      ${buildFieldRow("E-mail", data.email)}
      ${buildFieldRow("Assunto", data.subject, true)}
    </table>

    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;
      text-transform:uppercase;color:${COLORS.textMuted};">Mensagem</p>
    <div style="background:${COLORS.cream};border-left:4px solid ${COLORS.primary};
      border-radius:0 8px 8px 0;padding:16px 20px;">
      <p style="margin:0;font-size:14px;line-height:1.7;color:${COLORS.textDark};
        white-space:pre-wrap;">${escapeHtml(data.message)}</p>
    </div>

  `;

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: data.email,
    subject: `[Contato] ${data.subject} — ${data.name}`,
    html: buildEmailWrapper(content),
  });
}

// ─── E-mail de pré-inscrição ──────────────────────────────────────────────────────
export async function sendEnrollmentEmail({ fields, fieldLabels }: EnrollmentEmailData) {
  const entries = Object.entries(fields);
  const rows = entries
    .map(([key, value], i) => buildFieldRow(fieldLabels[key] ?? key, formatValue(value), i === entries.length - 1))
    .join("");

  const content = `
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;
      text-transform:uppercase;color:${COLORS.accent};">Nova inscrição recebida</p>
    <h2 style="margin:0 0 24px;font-size:20px;font-weight:700;color:${COLORS.primaryDark};">
      🎵 Pré-inscrição nas Oficinas de Música
    </h2>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border-radius:8px;overflow:hidden;border:1px solid ${COLORS.border};">
      ${rows}
    </table>
  `;

  const emailField = Object.entries(fieldLabels).find(([, label]) => /e.?mail/i.test(label))?.[0];
  const rawEmail = emailField ? fields[emailField] : undefined;
  const replyTo = rawEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : undefined;

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    ...(replyTo ? { replyTo } : {}),
    subject: `[Pré-inscrição] Nova solicitação de inscrição nas oficinas`,
    html: buildEmailWrapper(content),
  });
}

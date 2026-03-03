export const prerender = false;

import { sendContactEmail } from "@/lib/email";
import { verifyTurnstile } from "@/lib/utils/form-utils";
import type { APIRoute } from "astro";
import { z } from "zod/v3";

const ContactSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100),
  email: z.string().email("E-mail inválido"),
  subject: z.string().min(2, "Assunto muito curto").max(200),
  message: z.string().min(10, "Mensagem muito curta").max(3000),
  _honey: z.literal(""),
  _turnstile: z.string().min(1),
});

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  if (raw._honey) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }

  const isHuman = await verifyTurnstile(parsed.data._turnstile);
  if (!isHuman) {
    return new Response(JSON.stringify({ success: false, error: "Verificação de segurança falhou." }), {
      status: 400,
    });
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await sendContactEmail({ name, email, subject, message });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};

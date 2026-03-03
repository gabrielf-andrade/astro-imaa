export const prerender = false;

import { sendEnrollmentEmail } from "@/lib/email";
import { verifyTurnstile } from "@/lib/utils/form-utils";
import type { APIRoute } from "astro";
import { z } from "zod";

// Limites seguros
const MAX_FIELDS = 30;
const MAX_KEY_LENGTH = 100;
const MAX_VALUE_LENGTH = 3000;

// Schema principal
const dynamicFormSchema = z
  .record(
    z.string().max(MAX_KEY_LENGTH, "Nome do campo muito longo"),
    z.string().max(MAX_VALUE_LENGTH, "Valor excede o limite permitido"),
  )
  .refine((data) => Object.keys(data).length <= MAX_FIELDS, {
    message: "Número máximo de campos excedido",
  });

// Schema das labels COM OS LIMITES (Fix final do CodeRabbit)
const fieldLabelsSchema = z
  .record(z.string().max(MAX_KEY_LENGTH), z.string().max(MAX_VALUE_LENGTH))
  .refine((data) => Object.keys(data).length <= MAX_FIELDS, {
    message: "Número máximo de labels excedido",
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const raw: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      raw[key] = String(value);
    }

    const parsedData = dynamicFormSchema.parse(raw);
    if (parsedData._honey) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const isHuman = await verifyTurnstile(parsedData._turnstile ?? "");
    if (!isHuman) {
      return new Response(JSON.stringify({ success: false, error: "Verificação de segurança falhou." }), {
        status: 400,
      });
    }

    const { _honey, _fieldLabels, _turnstile, ...fields } = parsedData;

    let fieldLabels: Record<string, string> = {};
    try {
      // Usando a variável trimada
      const trimmedLabels = _fieldLabels?.trim();
      if (trimmedLabels) {
        const parsedJson = JSON.parse(trimmedLabels);
        fieldLabels = fieldLabelsSchema.parse(parsedJson);
      }
    } catch {
      console.warn("Aviso: _fieldLabels ignorado devido a formato inválido.");
    }

    await sendEnrollmentEmail({ fields, fieldLabels });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to process enrollment:", error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ success: false, error: "Dados inválidos enviados no formulário." }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};

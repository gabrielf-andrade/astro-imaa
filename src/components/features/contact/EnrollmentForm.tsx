import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { SUBMIT_ERROR_MESSAGE } from "@/lib/constants";
import { buildFormSchema, type SanityFormField } from "@/lib/utils/form-utils";
import { cn } from "@/lib/utils/ui-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { AlertCircleIcon, CheckCircle, Music } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";
import { DynamicField } from "./DynamicField";

interface EnrollmentFormProps {
  fields: SanityFormField[];
  isActive: boolean;
}

export default function EnrollmentForm({ fields, isActive }: Readonly<EnrollmentFormProps>) {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [shouldRenderTurnstile, setShouldRenderTurnstile] = useState(false);

  // Só permite criar o widget quando ficar ativo pela primeira vez
  useEffect(() => {
    if (isActive && !shouldRenderTurnstile) {
      setShouldRenderTurnstile(true);
    }
  }, [isActive, shouldRenderTurnstile]);

  const schema = useMemo(() => buildFormSchema(fields), [fields]);
  type FormValues = z.infer<typeof schema>;

  // defaultValues keyed by field._key — estável e único
  const defaultValues = useMemo(
    () =>
      fields.reduce<Record<string, string | boolean>>((acc, field) => {
        acc[field._key] = field.fieldType === "checkbox" ? false : "";
        return acc;
      }, {}),
    [fields],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    if (!turnstileToken) {
      setSubmitError("Por favor, confirme que você não é um robô.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("_turnstile", turnstileToken);
    formData.append("_honey", "");

    // _fieldLabels: { [field._key]: label amigável }
    // Chaves são os _key do Sanity — únicos, estáveis, sem risco de colisão
    const fieldLabels = fields.reduce<Record<string, string>>((acc, f) => {
      acc[f._key] = f.label;
      return acc;
    }, {});
    formData.append("_fieldLabels", JSON.stringify(fieldLabels));

    for (const [key, value] of Object.entries(values)) {
      const fieldDef = fields.find((f) => f._key === key);
      if (fieldDef?.fieldType === "checkbox") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, String(value ?? ""));
      }
    }

    try {
      const res = await fetch("/api/enrollment", { method: "POST", body: formData });

      if (!res.ok) {
        setSubmitError(SUBMIT_ERROR_MESSAGE);
        return;
      }
      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setSubmitError(SUBMIT_ERROR_MESSAGE);
      }
    } catch {
      setSubmitError(SUBMIT_ERROR_MESSAGE);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
        <h3 className="heading-3 mb-2">Pré-inscrição realizada!</h3>
        <p className="body-text max-w-sm mx-auto">
          Recebemos sua solicitação. Nossa equipe entrará em contato em breve para confirmar sua vaga.
        </p>
      </div>
    );
  }

  if (!fields.length) {
    return <p className="body-text text-center py-8">Formulário de inscrição em breve.</p>;
  }

  const rows: SanityFormField[][] = [];
  let i = 0;
  while (i < fields.length) {
    const current = fields[i];
    const next = fields[i + 1];
    if (current.width === "half" && next?.width === "half") {
      rows.push([current, next]);
      i += 2;
    } else {
      rows.push([current]);
      i += 1;
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <FieldGroup className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.map((f) => f._key).join("-")}
            className={cn("grid gap-5", row.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}
          >
            {row.map((fieldDef) => (
              <DynamicField key={fieldDef._key} fieldDef={fieldDef} form={form} />
            ))}
          </div>
        ))}

        <p className="caption-text">* Campos obrigatórios.</p>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Erro ao enviar formulário</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {shouldRenderTurnstile && (
          <div style={{ display: isActive ? "block" : "none" }}>
            <Turnstile
              ref={turnstileRef}
              siteKey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken(null)}
              onError={() => {
                setTurnstileToken(null);
                turnstileRef.current?.reset();
              }}
              options={{ language: "pt-br" }}
            />
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full bg-accent hover:bg-accent/90"
          disabled={isSubmitting || !turnstileToken}
        >
          <Music className="w-4 h-4" />
          {isSubmitting ? "Enviando..." : "Enviar Pré-inscrição"}
        </Button>
      </FieldGroup>
    </form>
  );
}

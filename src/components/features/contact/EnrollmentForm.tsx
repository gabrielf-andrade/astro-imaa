import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUBMIT_ERROR_MESSAGE } from "@/lib/constants";
import { labelToCamelCase } from "@/lib/utils/string-utils";
import { cn } from "@/lib/utils/ui-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckCircle, Music } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v3";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldOption {
  _key: string;
  label: string;
}

export interface SanityFormField {
  _key: string;
  fieldType: "input" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder?: string | null;
  inputType?: "text" | "email" | "tel" | "number" | null;
  required?: boolean | null;
  width?: "half" | "full" | null;
  options?: FieldOption[] | null;
}

interface EnrollmentFormProps {
  fields: SanityFormField[];
}

// ─── Dynamic schema builder ───────────────────────────────────────────────────

function buildSchema(fields: SanityFormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const key = labelToCamelCase(field.label);

    if (field.fieldType === "checkbox") {
      shape[key] = field.required
        ? z.boolean().refine((v) => v === true, { message: `${field.label} é obrigatório` })
        : z.boolean().optional();
    } else if (field.inputType === "email") {
      shape[key] = field.required
        ? z
            .string()
            .min(1, `${field.label} é obrigatório`)
            .email(`${field.label} inválido`)
            .max(200, "E-mail muito longo")
        : z.string().email(`${field.label} inválido`).max(200, "E-mail muito longo").or(z.literal(""));
    } else if (field.inputType === "number") {
      shape[key] = field.required
        ? z
            .string()
            .min(1, `${field.label} é obrigatório`)
            .max(50, "Número muito longo")
            .regex(/^\d+([.,]\d+)?$/, `${field.label} deve ser um número`)
        : z
            .string()
            .max(50, "Número muito longo")
            .regex(/^\d+([.,]\d+)?$/, `${field.label} deve ser um número`)
            .or(z.literal(""));
    } else {
      const maxLen = field.fieldType === "textarea" ? 3000 : 200;
      const baseSchema = z.string().max(maxLen, `${field.label} deve ter no máximo ${maxLen} caracteres`);

      shape[key] = field.required ? baseSchema.min(1, `${field.label} é obrigatório`) : baseSchema.or(z.literal(""));
    }
  }

  return z.object(shape);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EnrollmentForm({ fields }: Readonly<EnrollmentFormProps>) {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = buildSchema(fields);
  type FormValues = z.infer<typeof schema>;

  const defaultValues = fields.reduce<Record<string, string | boolean>>((acc, field) => {
    const key = field._key;
    acc[key] = field.fieldType === "checkbox" ? false : "";
    return acc;
  }, {});

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("_honey", "");

    const fieldLabels = fields.reduce<Record<string, string>>((acc, f) => {
      acc[f._key] = f.label;
      return acc;
    }, {});
    formData.append("_fieldLabels", JSON.stringify(fieldLabels));

    for (const [key, value] of Object.entries(values)) {
      formData.append(key, String(value ?? ""));
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

        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
          <Music className="w-4 h-4" />
          {isSubmitting ? "Enviando..." : "Enviar Pré-inscrição"}
        </Button>
      </FieldGroup>
    </form>
  );
}

// ─── DynamicField ─────────────────────────────────────────────────────────────

interface DynamicFieldProps {
  fieldDef: SanityFormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: ReturnType<typeof useForm<any>>;
}

function DynamicField({ fieldDef, form }: Readonly<DynamicFieldProps>) {
  const fieldKey = labelToCamelCase(fieldDef.label);
  const inputId = `enrollment-${fieldDef._key}`;
  const requiredLabel = fieldDef.required ? " *" : "";

  return (
    <Controller
      name={fieldKey}
      control={form.control}
      render={({ field, fieldState }) => {
        switch (fieldDef.fieldType) {
          case "input":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId}>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <Input
                  {...field}
                  id={inputId}
                  type={fieldDef.inputType ?? "text"}
                  placeholder={fieldDef.placeholder ?? undefined}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "textarea":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId}>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <Textarea
                  {...field}
                  id={inputId}
                  placeholder={fieldDef.placeholder ?? undefined}
                  rows={3}
                  maxLength={3000}
                  className="resize-none"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "select":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={inputId}>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={inputId} ref={field.ref} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder={fieldDef.placeholder ?? "Selecione..."} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {(fieldDef.options ?? []).map((opt) => (
                      <SelectItem key={opt._key} value={labelToCamelCase(opt.label)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "checkbox":
            return (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  id={inputId}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor={inputId} className="font-normal cursor-pointer">
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          case "radio":
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  {fieldDef.label}
                  {requiredLabel}
                </FieldLabel>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  ref={field.ref}
                  className="space-y-2 mt-1"
                >
                  {(fieldDef.options ?? []).map((opt) => {
                    const optValue = labelToCamelCase(opt.label);
                    return (
                      <div key={opt._key} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={optValue}
                          id={`${inputId}-${optValue}`}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldLabel htmlFor={`${inputId}-${optValue}`} className="font-normal cursor-pointer">
                          {opt.label}
                        </FieldLabel>
                      </div>
                    );
                  })}
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            );

          default:
            return <></>;
        }
      }}
    />
  );
}

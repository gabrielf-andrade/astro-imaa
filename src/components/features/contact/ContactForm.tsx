import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, CheckCircle, Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v3";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SUBMIT_ERROR_MESSAGE } from "@/lib/constants";

const ContactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  subject: z.string().min(2, "Informe o assunto"),
  message: z.string().min(10, "Mensagem muito curta (mínimo 10 caracteres)"),
  _honey: z.literal("").optional(),
});

type ContactValues = z.infer<typeof ContactSchema>;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", _honey: "" },
  });

  async function onSubmit(values: ContactValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });

    try {
      const res = await fetch("/api/contact", { method: "POST", body: formData });

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
        <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
        <h3 className="heading-3 mb-2">Mensagem enviada!</h3>
        <p className="body-text">Obrigado pelo contato. Responderemos o mais breve possível.</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <input
        type="text"
        {...form.register("_honey")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <FieldGroup className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-name">Nome completo *</FieldLabel>
                <Input {...field} id="contact-name" placeholder="Seu nome" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-email">E-mail *</FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  placeholder="seu@email.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-subject">Assunto *</FieldLabel>
              <Input
                {...field}
                id="contact-subject"
                placeholder="Sobre o que você gostaria de falar?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-message">Mensagem *</FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                placeholder="Digite sua mensagem aqui..."
                rows={5}
                className="resize-none"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {submitError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Erro ao enviar formulário</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          <Send className="w-4 h-4" />
          {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
        </Button>
      </FieldGroup>
    </form>
  );
}

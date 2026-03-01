import { buildUrlFromSlug } from "@/lib/utils/string-utils";

const SAFE_SCHEMES = ["https://", "mailto:", "tel:", "#", "./", "../"];

/**
 * Validates and sanitizes a raw href string.
 * Returns the trimmed href if safe, "" if unsafe (to trigger UI warning), or null if empty.
 */
export function resolveSafeHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const isSafe =
    SAFE_SCHEMES.some((s) => lower.startsWith(s)) || (trimmed.startsWith("/") && !trimmed.startsWith("//"));
  return isSafe ? trimmed : "";
}

interface CtaData {
  label?: string | null;
  linkType?: string | null;
  slug?: string | null;
  externalUrl?: string | null;
  openInNewTab?: boolean | null;
}

interface ResolvedCta {
  href: string;
  isExternal: boolean;
  openInNewTab: boolean;
}

/**
 * Resolves a CTA object into a normalized href + link behavior.
 * Returns null if the CTA has no valid destination.
 */
export function resolveCta(cta: CtaData): ResolvedCta | null {
  if (cta.linkType === "external") {
    if (!cta.externalUrl) return null;
    const safe = resolveSafeHref(cta.externalUrl);
    if (!safe) return null;
    return { href: safe, isExternal: true, openInNewTab: cta.openInNewTab ?? true };
  }

  const slug = cta.slug;
  if (!slug) return null;
  return { href: buildUrlFromSlug(slug), isExternal: false, openInNewTab: false };
}

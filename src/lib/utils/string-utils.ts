export function buildUrlFromSlug(slug: string | null | undefined): string {
  if (!slug) return "/";
  if (slug === "home") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function truncateExcerpt(text: string | null | undefined, maxLength = 160): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s\S*$/, "") + "…";
}

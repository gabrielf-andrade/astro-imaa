import { cn } from "@/lib/utils/ui-utils";

export function isActiveLink(currentPath: string, href: string) {
  if (currentPath === href) return true;
  if (
    href !== "/" &&
    currentPath.startsWith(href) &&
    (currentPath.length === href.length || currentPath[href.length] === "/")
  )
    return true;
  return false;
}

export const linkClass = cn(
  "relative px-3 pt-2 pb-1.5 text-sm text-primary font-bold tracking-wide font-sans rounded-sm whitespace-nowrap",
);

export const mobileUnderlineClass = cn(
  "relative inline-block",
  "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full",
  "after:bg-linear-to-r after:from-primary after:via-secondary after:to-accent",
  "after:transition-transform after:duration-200 after:origin-left",
);

export const linkContentUnderlineClass = cn(
  "relative inline-flex items-center gap-1 pb-1",
  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-sm",
  "after:bg-linear-to-r after:from-primary after:via-secondary after:to-accent",
  "after:transition-transform after:duration-200 after:origin-left",
);

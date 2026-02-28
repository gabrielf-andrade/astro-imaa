import { mobileUnderlineClass } from "@/lib/utils/navbar-utils";
import { cn } from "@/lib/utils/ui-utils";

interface Props {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}

export default function MobileNavLink({ href, label, active, className }: Readonly<Props>) {
  return (
    <a
      href={href}
      className={cn("px-4 py-3 text-sm text-primary font-bold tracking-wide font-sans", className)}
      aria-current={active ? "page" : undefined}
    >
      <span className={cn(mobileUnderlineClass, active ? "after:scale-x-100" : "after:scale-x-0")}>{label}</span>
    </a>
  );
}

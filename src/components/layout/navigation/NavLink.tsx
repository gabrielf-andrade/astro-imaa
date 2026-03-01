import { linkClass } from "@/lib/utils/navbar-utils";
import { cn } from "@/lib/utils/ui-utils";

interface Props {
  href: string;
  label: string;
  active: boolean;
}

export default function NavLink({ href, label, active }: Readonly<Props>) {
  return (
    <a
      href={href}
      className={cn(linkClass, active ? "after:hidden" : "after:scale-x-0 hover:after:scale-x-100")}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 h-0.5 w-full gradient-colors rounded-sm" />}
    </a>
  );
}

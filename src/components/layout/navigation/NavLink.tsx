import { linkClass, linkContentUnderlineClass } from "@/lib/utils/navbar-utils";
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
      className={cn(linkClass, "group")}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          linkContentUnderlineClass,
          active ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100",
        )}
      >
        {label}
      </span>
    </a>
  );
}

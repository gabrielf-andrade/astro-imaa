import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { QueryMenuItem } from "@/lib/sanity-derived-types";
import { isActiveLink, linkClass, linkContentUnderlineClass } from "@/lib/utils/navbar-utils";
import { buildUrlFromSlug } from "@/lib/utils/string-utils";
import { cn } from "@/lib/utils/ui-utils";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Props {
  item: QueryMenuItem;
  currentPath: string;
}

export default function DesktopDropdown({ item, currentPath }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const active = item.slug ? isActiveLink(currentPath, buildUrlFromSlug(item.slug)) : false;
  const anyChildActive =
    item.submenu?.some((child) => isActiveLink(currentPath, buildUrlFromSlug(child.slug))) ?? false;
  const showUnderline = active || anyChildActive || open;

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          linkClass,
          "group outline-none",
        )}
      >
        <span
          className={cn(
            linkContentUnderlineClass,
            showUnderline ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100",
          )}
        >
          {item.label}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {item.submenu?.map((child) => {
          const childActive = isActiveLink(currentPath, buildUrlFromSlug(child.slug));
          return (
            <DropdownMenuItem key={child._key} asChild>
              <a
                href={buildUrlFromSlug(child.slug)}
                className={cn("text-sm text-primary font-medium font-sans cursor-pointer", childActive && "bg-muted")}
              >
                {child.label}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

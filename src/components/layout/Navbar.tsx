import logoPlaceholder from "@/assets/bloco.jpg";
import SocialLinks from "@/components/common/SocialLinks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { QueryMenuItem, QuerySocialLink } from "@/lib/sanity-derived-types";
import { buildUrlFromSlug } from "@/lib/utils/string-utils";
import { cn } from "@/lib/utils/ui-utils";
import { ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface NavbarProps {
  currentPath: string;
  menuItems: QueryMenuItem[];
  socialLinks: QuerySocialLink[];
}

function isActiveLink(currentPath: string, href: string) {
  if (currentPath === href) return true;
  if (href !== "/" && currentPath.startsWith(href)) return true;
  return false;
}

const linkClass = cn(
  "relative px-3 py-2 text-sm text-primary font-bold tracking-wide font-sans rounded-sm whitespace-nowrap",
  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full",
  "after:bg-linear-to-r after:from-primary after:via-secondary after:via-50% after:to-accent",
  "after:transition-transform after:duration-200 after:origin-left",
);

// ---- Dropdown desktop ----
function DesktopDropdown({ item, currentPath }: Readonly<{ item: QueryMenuItem; currentPath: string }>) {
  const [open, setOpen] = useState(false);
  const active = item.slug ? isActiveLink(currentPath, buildUrlFromSlug(item.slug)) : false;
  const anyChildActive = item.submenu?.some((child) => currentPath === buildUrlFromSlug(child.slug)) ?? false;
  const showUnderline = active || anyChildActive || open;

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          linkClass,
          "flex items-center gap-1 outline-none",
          showUnderline ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
        )}
      >
        {item.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {item.submenu?.map((child) => {
          const childActive = currentPath === buildUrlFromSlug(child.slug);
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

const mobileUnderlineClass = cn(
  "relative inline-block",
  "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full",
  "after:bg-linear-to-r after:from-primary after:via-secondary after:via-50% after:to-accent",
  "after:transition-transform after:duration-200 after:origin-left",
);

// ---- Componente principal ----
export default function Navbar({ currentPath, menuItems, socialLinks }: Readonly<NavbarProps>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleNavigation = () => setIsOpen(false);
    document.addEventListener("astro:page-load", handleNavigation);
    return () => document.removeEventListener("astro:page-load", handleNavigation);
  }, []);

  return (
    <header className="relative z-50 bg-background/90 backdrop-blur-sm shadow-sm">
      <div className="h-1 w-full bg-linear-to-r from-primary via-secondary via-50% to-accent" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group min-w-48">
            <img
              src={logoPlaceholder.src}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              alt="Logo Instituto Mestre Abiud"
            />
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-wide font-sans">Instituto Mestre</p>
              <p className="text-xl font-bold text-primary font-serif leading-tight">Abiud Almeida</p>
            </div>
          </a>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
            {menuItems.map((item) => {
              if (item.isDropdown && item.submenu?.length) {
                return <DesktopDropdown key={item._key} item={item} currentPath={currentPath} />;
              }

              const href = buildUrlFromSlug(item.slug);
              const active = isActiveLink(currentPath, href);
              return (
                <a
                  key={item._key}
                  href={href}
                  className={cn(linkClass, active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100")}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-primary via-secondary via-50% to-accent"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Redes sociais desktop */}
          <SocialLinks socialLinks={socialLinks} className="hidden lg:flex lg:justify-center xl:justify-end min-w-48" />

          {/* Botão Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-foreground transition-colors ml-auto"
            aria-label="Abrir menu"
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 w-full overflow-hidden bg-background border-t border-b border-border shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col max-w-7xl divide-y divide-border">
              {menuItems.map((item) => {
                if (item.isDropdown && item.submenu?.length) {
                  return (
                    <Accordion key={item._key} type="single" collapsible>
                      <AccordionItem value={item._key} className="border-none">
                        <AccordionTrigger className="relative px-4 py-3 text-sm text-primary font-bold tracking-wide font-sans hover:no-underline [&>svg]:text-primary">
                          {item.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-1">
                          <div className="flex flex-col gap-1 pl-2 border-l-2 border-primary ml-6">
                            {item.submenu.map((child) => {
                              const childHref = buildUrlFromSlug(child.slug);
                              const childActive = currentPath === childHref;
                              return (
                                <a
                                  key={child._key}
                                  href={childHref}
                                  className="pl-2 pr-4 py-2.5 text-sm text-primary font-medium font-sans"
                                  aria-current={childActive ? "page" : undefined}
                                >
                                  <span
                                    className={cn(
                                      mobileUnderlineClass,
                                      childActive ? "after:scale-x-100" : "after:scale-x-0",
                                    )}
                                  >
                                    {child.label}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                }

                const href = buildUrlFromSlug(item.slug);
                const active = isActiveLink(currentPath, href);
                return (
                  <a
                    key={item._key}
                    href={href}
                    className="px-4 py-3 text-sm text-primary font-bold tracking-wide font-sans"
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={cn(mobileUnderlineClass, active ? "after:scale-x-100" : "after:scale-x-0")}>
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Redes sociais mobile */}
            <SocialLinks socialLinks={socialLinks} className="container mx-auto p-4 max-w-7xl border-t border-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

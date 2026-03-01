import SanityImage from "@/components/common/SanityImage";
import SocialLinks from "@/components/common/SocialLinks";
import DesktopDropdown from "@/components/layout/navigation/DesktopDropdown";
import MobileAccordionItem from "@/components/layout/navigation/MobileAccordionItem";
import MobileNavLink from "@/components/layout/navigation/MobileNavLink";
import NavLink from "@/components/layout/navigation/NavLink";
import { Accordion } from "@/components/ui/accordion";
import { CARNIVAL_BLOCK_NAME, INSTITUTE_NAME } from "@/lib/constants";
import type { QueryMenuItem, QuerySocialLink, SanityImageBase } from "@/lib/sanity-derived-types";
import { isActiveLink } from "@/lib/utils/navbar-utils";
import { buildUrlFromSlug } from "@/lib/utils/string-utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface NavbarProps {
  currentPath: string;
  menuItems: QueryMenuItem[];
  socialLinks: QuerySocialLink[];
  logo?: SanityImageBase | null;
}

export default function Navbar({ currentPath, menuItems, socialLinks, logo }: Readonly<NavbarProps>) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleNavigation = () => setIsOpen(false);
    document.addEventListener("astro:page-load", handleNavigation);
    return () => document.removeEventListener("astro:page-load", handleNavigation);
  }, []);

  return (
    <header className="relative z-50 bg-card border-b">
      <div className="h-1 w-full gradient-colors" />

      <div className="px-4 xl:px-8">
        <div className="flex items-center h-16 lg:h-20 gap-4 xl:gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            {logo && (
              <SanityImage
                image={logo}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover"
                loading="eager"
                alt={INSTITUTE_NAME}
              />
            )}
            <div>
              <p className="text-[10px] font-semibold text-accent uppercase font-sans">{INSTITUTE_NAME}</p>
              <p className="text-[17px] font-bold text-primary font-serif">{CARNIVAL_BLOCK_NAME}</p>
            </div>
          </a>

          {/* Nav Desktop */}
          <nav className="hidden lg:flex flex-1 min-w-0 pb-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center gap-1 min-w-max ml-auto">
              {menuItems.map((item) => {
                if (item.isDropdown && item.submenu?.length) {
                  return <DesktopDropdown key={item._key} item={item} currentPath={currentPath} />;
                }
                if (!item.label) return null;
                const href = buildUrlFromSlug(item.slug);
                return (
                  <NavLink key={item._key} href={href} label={item.label} active={isActiveLink(currentPath, href)} />
                );
              })}
            </div>
          </nav>

          {/* Redes sociais desktop */}
          <SocialLinks socialLinks={socialLinks} className="hidden lg:flex ml-auto shrink-0" />

          {/* Botão Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-foreground transition-colors ml-auto"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
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
            id="mobile-menu"
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
                      <MobileAccordionItem item={item} currentPath={currentPath} />
                    </Accordion>
                  );
                }
                if (!item.label) return null;
                const href = buildUrlFromSlug(item.slug);
                return (
                  <MobileNavLink
                    key={item._key}
                    href={href}
                    label={item.label}
                    active={isActiveLink(currentPath, href)}
                  />
                );
              })}
            </nav>

            <SocialLinks socialLinks={socialLinks} className="container mx-auto p-4 max-w-7xl border-t border-border" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import streamers from "@/assets/streamers-colorful.png";
import SanityImage from "@/components/common/SanityImage";
import BlockHighlightSection from "@/components/features/home/BlockHighlightSection";
import { Button } from "@/components/ui/button";
import { CARNIVAL_BLOCK_NAME, DEFAULT_DESCRIPTION, INSTITUTE_NAME } from "@/lib/constants";
import type { HomeBlockHighlightSection, HomePageCta, SanityImageBase } from "@/lib/sanity-derived-types";
import { resolveCta } from "@/lib/utils/link-utils";
import { ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

type HeroCta = HomePageCta | null;

interface HeroSectionProps {
  description?: string | null;
  logo?: SanityImageBase | null;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  blockHighlight?: HomeBlockHighlightSection | null;
}

interface CtaButtonProps {
  cta?: HeroCta;
  variant?: "default" | "outline";
  className?: string;
}

function CtaButton({ cta, variant = "default", className }: Readonly<CtaButtonProps>) {
  if (!cta?.label) return null;
  const resolvedCta = resolveCta(cta);
  if (!resolvedCta) return null;
  return (
    <Button asChild size="lg" variant={variant} className={className}>
      <a
        href={resolvedCta.href}
        target={resolvedCta.openInNewTab ? "_blank" : undefined}
        rel={resolvedCta.openInNewTab ? "noopener noreferrer" : undefined}
      >
        {cta.label}
        {resolvedCta.openInNewTab && <span className="sr-only">(abre em nova aba)</span>}
        {resolvedCta.isExternal ? (
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        ) : (
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        )}
      </a>
    </Button>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

function BlurRevealText({
  text,
  className,
  delay = 0,
}: Readonly<{ text: string; className?: string; delay?: number }>) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {text}
    </motion.span>
  );
}

export default function HeroSection({
  description,
  logo,
  primaryCta,
  secondaryCta,
  blockHighlight,
}: Readonly<HeroSectionProps>) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(to_bottom,rgba(27,122,59,1)_0%,rgba(0,86,28,1)_18%,rgba(5,33,14,1)_60%,rgba(5,33,14,1)_78%)]">
      <img
        src={streamers.src}
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 z-0 w-full h-auto pointer-events-none sm:blur-[1px] brightness-125"
      />

      {/* ── Hero ── */}
      <div className="relative z-10 container mx-auto px-6 md:px-10 lg:px-16 lg:max-w-6xl pt-16 lg:min-h-[calc(100vh-5rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
          {/* Texto */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="order-2 lg:order-1">
            <motion.h1 variants={itemVariants} className="mb-6 leading-tight">
              <span className="block uppercase text-lg md:text-3xl font-sans font-semibold mb-3 text-pretty">
                <BlurRevealText
                  text={INSTITUTE_NAME}
                  className="bg-secondary bg-clip-text text-transparent"
                  delay={0.1}
                />
              </span>
              <span className="block font-serif text-5xl md:text-6xl">
                <BlurRevealText
                  text={CARNIVAL_BLOCK_NAME}
                  delay={0.2}
                  className="bg-primary-foreground bg-clip-text text-transparent"
                />
              </span>
            </motion.h1>

            <motion.div variants={itemVariants} className="h-px w-32 mb-6 gradient-colors" />

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-white/70 mb-10 leading-relaxed font-sans max-w-md"
            >
              {description ?? DEFAULT_DESCRIPTION}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <CtaButton cta={primaryCta} className="bg-accent hover:bg-accent/90 text-white" />
              <CtaButton
                cta={secondaryCta}
                variant="outline"
                className="text-white/80 hover:bg-white/5 bg-transparent"
              />
            </motion.div>
          </motion.div>

          {/* Logo */}
          <motion.div
            className="order-1 lg:order-2 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-md xl:h-112">
              <div className="absolute inset-8 rounded-full blur-2xl opacity-50 bg-secondary" />
              <div className="absolute inset-16 rounded-full blur-3xl opacity-40 bg-accent" />
              {logo && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: [0, -1.5, 1.5, -1, 1, 0] }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <SanityImage
                    image={logo}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                    alt={logo.alt ?? CARNIVAL_BLOCK_NAME}
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-y-8 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1">
          <span className="text-xs text-white/30 uppercase tracking-widest font-sans">Role para ver mais</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-6 h-6 text-white/25" />
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
        className="h-px w-full lg:hidden mx-auto my-12 gradient-colors"
      />

      {/* ── Block Highlight ── */}
      <BlockHighlightSection blockHighlight={blockHighlight} />
    </section>
  );
}

import AnimatedFadeUp from "@/components/features/home/AnimatedFadeUp";
import type { HomeBlockHighlightSection } from "@/lib/sanity-derived-types";

interface BlockHighlightSectionProps {
  blockHighlight?: HomeBlockHighlightSection | null;
}

export default function BlockHighlightSection({ blockHighlight }: Readonly<BlockHighlightSectionProps>) {
  if (!blockHighlight?.heading && !blockHighlight?.body) return null;

  return (
    <div className="relative z-10 container mx-auto px-6 md:px-10 lg:px-16 max-w-6xl lg:pt-16 pb-16 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-24 items-center">
        <AnimatedFadeUp delay={0.1}>
          {blockHighlight.label && <p className="heading-label mb-5">{blockHighlight.label}</p>}
          <div className="flex items-end gap-3 mb-4">
            <span
              className="font-heading font-black leading-none text-transparent bg-clip-text bg-linear-to-br from-secondary to-accent"
              style={{ fontSize: "clamp(4rem, 8vw, 5rem)" }}
            >
              {blockHighlight.milestone ?? "10"}
            </span>
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-3 leading-tight max-w-20">
              {blockHighlight.milestoneLabel ?? "anos de história"}
            </span>
          </div>
          {blockHighlight.heading && (
            <h2 className="heading-2 text-primary-foreground text-balance leading-snug">{blockHighlight.heading}</h2>
          )}
          <div className="mt-5 h-px w-32 gradient-colors" />
        </AnimatedFadeUp>

        <div className="space-y-6">
          {blockHighlight.body && (
            <AnimatedFadeUp delay={0.2}>
              <p className="text-base md:text-lg text-white/70 mb-10 leading-relaxed font-sans text-pretty">
                {blockHighlight.body}
              </p>
            </AnimatedFadeUp>
          )}
          {blockHighlight.footer && (
            <AnimatedFadeUp delay={0.35}>
              <blockquote className="pl-5 border-l-2 border-secondary/60">
                <p className="font-serif text-base md:text-lg text-secondary/85 italic leading-relaxed text-pretty">
                  {blockHighlight.footer}
                </p>
              </blockquote>
            </AnimatedFadeUp>
          )}
        </div>
      </div>
    </div>
  );
}

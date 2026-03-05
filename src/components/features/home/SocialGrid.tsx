import SanityImage from "@/components/common/SanityImage";
import AnimatedFadeUp from "@/components/features/home/AnimatedFadeUp";
import BlueSkyIcon from "@/components/icons/BlueskyIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { XTwitterIcon } from "@/components/icons/XTwitterIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import type { QuerySocialLinkWithImage, SocialMediaPlatforms } from "@/lib/sanity-derived-types";
import { cn } from "@/lib/utils/ui-utils";

interface PlatformConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
}

const platformConfigs: Partial<Record<SocialMediaPlatforms, PlatformConfig>> = {
  instagram: { icon: InstagramIcon, label: "Instagram", color: "#c13584" },
  facebook: { icon: FacebookIcon, label: "Facebook", color: "#0a52cc" },
  youtube: { icon: YouTubeIcon, label: "YouTube", color: "#cc0000" },
  twitter: { icon: XTwitterIcon, label: "X / Twitter", color: "#000000" },
  bluesky: { icon: BlueSkyIcon, label: "Bluesky", color: "#0060c7" },
};

interface SocialGridProps {
  socialLinks: QuerySocialLinkWithImage[];
  className?: string;
}

export default function SocialGrid({ socialLinks, className }: Readonly<SocialGridProps>) {
  const validLinks = socialLinks.filter((s) => s.url && s.platform);

  if (!validLinks.length) return null;

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6", className)}>
      {validLinks.map((social, index) => {
        const config = platformConfigs[social.platform as SocialMediaPlatforms];
        if (!config) return null;

        const { icon: Icon, label: platformName, color } = config;

        return (
          <AnimatedFadeUp key={social.url} delay={0.1 + index * 0.15}>
            <a
              href={social.url!}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label ?? platformName}
              style={{ "--platform-color": color } as React.CSSProperties}
              className={cn(
                "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
                "transition-all duration-200 hover:shadow-lg",
                "hover:bg-(--platform-color) hover:border-(--platform-color)",
                index % 2 === 0 ? "lg:-translate-y-4" : "lg:translate-y-4",
              )}
            >
              {/* Imagem */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                {social.image?.asset?._id ? (
                  <SanityImage
                    image={social.image}
                    width={600}
                    height={600}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-16 h-16 opacity-20 text-(--platform-color)" />
                  </div>
                )}

                {/* Overlay — purely decorative, pointer-events handled by parent <a> */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none bg-(--platform-color)/0 group-hover:bg-(--platform-color)/30 transition-colors duration-300"
                >
                  <Icon className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-white text-sm font-semibold font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver perfil →
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center gap-3 px-4 py-3 min-w-0">
                <Icon className="w-5 h-5 shrink-0 text-(--platform-color) group-hover:text-white transition-colors" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground font-sans uppercase tracking-wide transition-colors group-hover:text-white/70">
                    {platformName}
                  </p>
                  {social.label && (
                    <p className="text-sm font-bold text-foreground font-sans transition-colors group-hover:text-white line-clamp-2 break-all">
                      {social.label}
                    </p>
                  )}
                </div>
              </div>
            </a>
          </AnimatedFadeUp>
        );
      })}
    </div>
  );
}

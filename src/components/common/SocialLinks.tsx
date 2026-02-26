import BlueSkyIcon from "@/components/icons/BlueskyIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { XTwitterIcon } from "@/components/icons/XTwitterIcon";
import YouTubeIcon from "@/components/icons/YouTubeIcon";
import type { QuerySocialLink, SocialMediaPlatforms } from "@/lib/sanity-derived-types";
import { cn } from "@/lib/utils/ui-utils";

const socialIconMap: Partial<Record<SocialMediaPlatforms, React.ComponentType<{ className?: string }>>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  twitter: XTwitterIcon,
  bluesky: BlueSkyIcon,
};

function getSocialIcon(platform: SocialMediaPlatforms | null) {
  if (!platform) return null;
  return socialIconMap[platform] ?? null;
}

interface SocialLinksProps {
  socialLinks: QuerySocialLink[];
  className?: string;
  iconClassName?: string;
  linkClassName?: string;
}

export default function SocialLinks({
  socialLinks,
  className,
  iconClassName,
  linkClassName,
}: Readonly<SocialLinksProps>) {
  return (
    <div className={cn("flex gap-3", className)}>
      {socialLinks.map((social) => {
        const Icon = getSocialIcon(social.platform);
        if (!Icon || !social.url) return null;
        return (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label ?? social.platform ?? undefined}
            className={cn(
              "w-8 h-8 rounded-full bg-primary hover:bg-accent flex items-center justify-center transition-colors",
              linkClassName,
            )}
          >
            <Icon className={cn("w-4 h-4 text-white", iconClassName)} />
          </a>
        );
      })}
    </div>
  );
}

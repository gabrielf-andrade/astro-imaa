import type { PageBuilderBlockOf } from "@/lib/sanity-derived-types";
import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import { GalleryCarousel } from "./GalleryCarousel";
import { GalleryGrid2 } from "./GalleryGrid2";
import { GalleryGrid3 } from "./GalleryGrid3";
import { isValidImage, type ValidGalleryImage } from "./GalleryItem";
import { GalleryMasonry } from "./GalleryMasonry";

type Props = PageBuilderBlockOf<"gallery">;

function buildSlides(images: ValidGalleryImage[]) {
  return images.map((img) => ({
    src: img.asset.url,
    alt: img.alt ?? "",
    width: img.asset.metadata?.dimensions?.width ?? 1200,
    height: img.asset.metadata?.dimensions?.height ?? 800,
    description: img.caption ?? undefined,
  }));
}

export default function Gallery({ heading, images, layout = "grid3", autoplay, autoplayInterval }: Readonly<Props>) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const validImages = useMemo(() => (images ?? []).filter(isValidImage), [images]);

  const slides = useMemo(() => buildSlides(validImages), [validImages]);

  if (!validImages.length) return null;

  return (
    <section className="py-pagebuilder bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {heading && <h2 className="heading-2 mb-8 text-center">{heading}</h2>}

        {layout === "grid2" && <GalleryGrid2 images={validImages} onOpen={setLightboxIndex} />}

        {layout === "grid3" && <GalleryGrid3 images={validImages} onOpen={setLightboxIndex} />}

        {layout === "masonry" && <GalleryMasonry images={validImages} onOpen={setLightboxIndex} />}

        {layout === "carousel" && (
          <GalleryCarousel
            images={validImages}
            onOpen={setLightboxIndex}
            autoplay={autoplay}
            autoplayInterval={autoplayInterval}
          />
        )}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Counter, Captions, Thumbnails]}
        captions={{ showToggle: true }}
      />
    </section>
  );
}

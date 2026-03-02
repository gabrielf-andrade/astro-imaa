import SanityImage from "@/components/common/SanityImage";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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

type Props = PageBuilderBlockOf<"gallery">;
type GalleryImage = NonNullable<Props["images"]>[number];

function buildSlides(images: GalleryImage[]) {
  return images
    .filter((img) => img.asset?._id)
    .map((img) => ({
      src: img.asset!.url ?? "",
      alt: img.alt ?? "",
      width: img.asset?.metadata?.dimensions?.width ?? 1200,
      height: img.asset?.metadata?.dimensions?.height ?? 800,
      description: img.caption ?? undefined,
    }));
}

function GalleryItem({
  image,
  index,
  onClick,
  className,
}: Readonly<{
  image: GalleryImage;
  index: number;
  onClick: (i: number) => void;
  className?: string;
}>) {
  if (!image.asset?._id) return null;
  return (
    <button
      className={`group relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className ?? ""}`}
      onClick={() => onClick(index)}
      aria-label={image.alt ?? `Imagem ${index + 1}`}
    >
      <SanityImage
        image={image}
        width={600}
        height={600}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
        {image.caption && (
          <span className="text-white text-sm font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
            {image.caption}
          </span>
        )}
      </div>
    </button>
  );
}

const MASONRY_COLS = 3;

export default function Gallery({ heading, images, layout = "grid3" }: Readonly<Props>) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const validImages = useMemo(() => (images ?? []).filter((img) => img.asset?._id), [images]);

  const masonryColumns = useMemo(() => {
    if (layout !== "masonry") return [];
    const cols: { image: GalleryImage; globalIndex: number }[][] = Array.from({ length: MASONRY_COLS }, () => []);
    validImages.forEach((img, i) => cols[i % MASONRY_COLS].push({ image: img, globalIndex: i }));
    return cols;
  }, [validImages, layout]);

  const slides = useMemo(() => buildSlides(validImages), [validImages]);

  if (!validImages.length) return null;

  return (
    <section className="py-pagebuilder bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {heading && <h2 className="heading-2 mb-8 text-center">{heading}</h2>}

        {/* Grid 2 */}
        {layout === "grid2" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {validImages.map((image, i) => (
              <div key={image.asset!._id} className="aspect-square">
                <GalleryItem image={image} index={i} onClick={setLightboxIndex} className="w-full h-full" />
              </div>
            ))}
          </div>
        )}

        {/* Grid 3 */}
        {layout === "grid3" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {validImages.map((image, i) => (
              <div key={image.asset!._id} className="aspect-square">
                <GalleryItem image={image} index={i} onClick={setLightboxIndex} className="w-full h-full" />
              </div>
            ))}
          </div>
        )}

        {/* Masonry — 1 col mobile, 2 sm, 3 lg+ */}
        {layout === "masonry" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
            {masonryColumns.map((col, colIndex) => (
              <div key={"masonry-col-" + colIndex} className="grid gap-4 md:gap-6">
                {col.map(({ image, globalIndex }) => {
                  const ratio = image.asset?.metadata?.dimensions?.aspectRatio ?? 1;
                  return (
                    <div key={image.asset!._id} style={{ aspectRatio: ratio }}>
                      <GalleryItem
                        image={image}
                        index={globalIndex}
                        onClick={setLightboxIndex}
                        className="w-full h-full"
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* TODO: Verificar para adicionar opção de autoplay e também botão lateral ao inves de embaixo + loop */}
        {/* Carousel */}
        {layout === "carousel" && (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {validImages.map((image, i) => (
                <CarouselItem key={image.asset!._id} className="pl-4 basis-[80%] sm:basis-1/2 lg:basis-1/3">
                  <div className="aspect-4/3">
                    <GalleryItem image={image} index={i} onClick={setLightboxIndex} className="w-full h-full" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4 mt-6">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
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

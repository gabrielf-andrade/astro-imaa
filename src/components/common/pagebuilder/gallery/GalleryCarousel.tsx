import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

interface GalleryCarouselProps {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
  autoplay?: boolean | null;
  autoplayInterval?: number;
}

export function GalleryCarousel({
  images,
  onOpen,
  autoplay = false,
  autoplayInterval = 4,
}: Readonly<GalleryCarouselProps>) {
  const [api, setApi] = useState<CarouselApi>();
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const autoplayPlugin = useRef(Autoplay({ delay: autoplayInterval * 1000, stopOnInteraction: true }));

  const plugins = useMemo(() => (autoplay ? [autoplayPlugin.current] : []), [autoplay]);

  useEffect(() => {
    if (!api) return;

    function setupSnaps(api: CarouselApi) {
      if (!api) return;
      setScrollSnaps(api.scrollSnapList());
      setSelectedSnap(api.selectedScrollSnap());
    }

    function onSelect(api: CarouselApi) {
      if (!api) return;
      setSelectedSnap(api.selectedScrollSnap());
    }

    setupSnaps(api);
    api.on("reInit", setupSnaps);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", setupSnaps);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ align: "start", loop: true }} plugins={plugins} className="w-full">
      <CarouselContent className="-ml-4">
        {images.map((image, i) => (
          <CarouselItem key={image.asset._id} className="pl-4 basis-[80%] sm:basis-1/2 lg:basis-1/3">
            <div className="aspect-4/3">
              <GalleryItem image={image} index={i} onItemClick={onOpen} className="w-full h-full" loading="eager" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>

        <div className="flex items-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={"scroll-snap-" + i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedSnap ? "w-6 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>
      </div>
    </Carousel>
  );
}

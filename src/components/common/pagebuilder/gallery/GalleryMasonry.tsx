import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMemo } from "react";
import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

const MASONRY_COLS = 4;

interface Props {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
}

export function GalleryMasonry({ images, onOpen }: Readonly<Props>) {
  const columns = useMemo(() => {
    const cols: { image: ValidGalleryImage; globalIndex: number }[][] = Array.from({ length: MASONRY_COLS }, () => []);
    images.forEach((img, i) => cols[i % MASONRY_COLS].push({ image: img, globalIndex: i }));
    return cols;
  }, [images]);

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6 overflow-hidden">
      {columns.map((col, colIndex) => (
        <div key={"masonry-col-" + colIndex} className="grid gap-4 md:gap-6">
          {col.map(({ image, globalIndex }) => {
            const ratio = image.asset.metadata?.dimensions?.aspectRatio ?? 1;
            return (
              <AspectRatio key={image.asset._id} ratio={ratio} className="overflow-hidden rounded-xl">
                <GalleryItem
                  image={image}
                  index={globalIndex}
                  onClick={onOpen}
                  className="w-full h-full rounded-none!"
                />
              </AspectRatio>
            );
          })}
        </div>
      ))}
    </div>
  );
}

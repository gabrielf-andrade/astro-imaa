import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

interface GalleryGrid2Props {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
}

export function GalleryGrid2({ images, onOpen }: Readonly<GalleryGrid2Props>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((image, i) => (
        <div key={image.asset._id} className="aspect-square">
          <GalleryItem image={image} index={i} onItemClick={onOpen} className="w-full h-full" loading="eager" />
        </div>
      ))}
    </div>
  );
}

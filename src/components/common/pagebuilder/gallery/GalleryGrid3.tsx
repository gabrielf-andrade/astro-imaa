import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

interface GalleryGrid3Props {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
}

export function GalleryGrid3({ images, onOpen }: Readonly<GalleryGrid3Props>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, i) => (
        <div key={image.asset._id} className="aspect-square">
          <GalleryItem image={image} index={i} onItemClick={onOpen} className="w-full h-full" loading="eager" />
        </div>
      ))}
    </div>
  );
}

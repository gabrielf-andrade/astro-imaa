import type { ValidGalleryImage } from "./GalleryItem";
import { GalleryItem } from "./GalleryItem";

interface Props {
  images: ValidGalleryImage[];
  onOpen: (index: number) => void;
}

export function GalleryGrid2({ images, onOpen }: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((image, i) => (
        <div key={image.asset._id} className="aspect-square">
          <GalleryItem image={image} index={i} onClick={onOpen} className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}

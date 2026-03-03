import SanityImage from "@/components/common/SanityImage";
import type { PageBuilderBlockOf } from "@/lib/sanity-derived-types";

type GalleryImage = NonNullable<PageBuilderBlockOf<"gallery">["images"]>[number];

export type ValidGalleryImage = GalleryImage & {
  asset: NonNullable<GalleryImage["asset"]> & { url: string };
};

export function isValidImage(img: GalleryImage): img is ValidGalleryImage {
  return !!(img.asset?._id && img.asset?.url);
}

export function GalleryItem({
  image,
  index,
  onClick,
  className,
}: Readonly<{
  image: ValidGalleryImage;
  index: number;
  onClick: (i: number) => void;
  className?: string;
}>) {
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

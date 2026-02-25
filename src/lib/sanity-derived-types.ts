// ============================================================================
// Image Types - Base types (manual, since structure is consistent across all image types)
// ============================================================================
//TODO: trocar imports pelos gerados no typegen
import type { SanityImageCrop, SanityImageHotspot } from "@sanity/image-url";

/** Sanity asset with projected metadata from GROQ queries */
export interface ProjectedSanityAsset {
  _id: string;
  url: string | null;
  altText?: string | null;
  metadata: {
    lqip: string | null;
    dimensions: {
      width: number | null;
      height: number | null;
      aspectRatio: number | null;
    } | null;
  } | null;
}

/** Base image type with projected asset - generic for any Sanity image */
export interface SanityImageBase {
  asset?: ProjectedSanityAsset | null;
  alt?: string | null;
  caption?: string | null;
  media?: unknown;
  hotspot?: SanityImageHotspot | null;
  crop?: SanityImageCrop | null;
}

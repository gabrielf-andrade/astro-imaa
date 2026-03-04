// ============================================================================
// Image Types - Base types (manual, since structure is consistent across all image types)
// ============================================================================

import type {
  ALL_PAGES_QUERY_RESULT,
  ALL_TRANSPARENCY_SECTIONS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/lib/sanity.types";

/** Sanity asset with projected metadata from GROQ queries */
export interface ProjectedSanityAsset {
  _id: string;
  url: string | null;
  altText?: string | null;
  metadata: {
    lqip?: string | null;
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
  hotspot?: {
    x?: number | null;
    y?: number | null;
    width?: number | null;
    height?: number | null;
    _type?: string | null;
  } | null;
  crop?: {
    top?: number | null;
    bottom?: number | null;
    left?: number | null;
    right?: number | null;
    _type?: string | null;
  } | null;
}

// ============================================================================
// Page Builder derived types
// ============================================================================

export type PageBuilder = NonNullable<ALL_PAGES_QUERY_RESULT>[number]["pageBuilder"];
export type PageBuilderBlock = NonNullable<PageBuilder>[number];
export type PageBuilderBlockType = PageBuilderBlock["_type"];

export type PageBuilderBlockOf<T extends PageBuilderBlockType> = Extract<PageBuilderBlock, { _type: T }>;

// ============================================================================
// Menu Types - derived from TypeGen query results
// ============================================================================

/** Menu item from mainMenu or footerMenu queries */
export type QueryMenuItem = NonNullable<NonNullable<SITE_SETTINGS_QUERY_RESULT>["mainMenu"]["items"]>[number];

// ============================================================================
// Social & Contact Types - derived from TypeGen
// ============================================================================

/** Social link from site settings */
export type QuerySocialLink = NonNullable<NonNullable<SITE_SETTINGS_QUERY_RESULT>["socialLinks"]>[number];

/** Available social platforms */
export type SocialMediaPlatforms = NonNullable<QuerySocialLink["platform"]>;

/** Social link with optional cover image (used in SocialGrid on home page) */
export type QuerySocialLinkWithImage = QuerySocialLink & {
  image?: SanityImageBase | null;
};

/** Contact info from site settings */
export type QueryContactInfo = NonNullable<SITE_SETTINGS_QUERY_RESULT>["contactInfo"];

/** Individual phone item from contact info */
export type QueryPhoneItem = NonNullable<NonNullable<QueryContactInfo>["phones"]>[number];

/** Individual email item from contact info */
export type QueryEmailItem = NonNullable<NonNullable<QueryContactInfo>["emails"]>[number];

/** Keys of contact info */
export type QueryContactInfoKeys = keyof NonNullable<QueryContactInfo>;

/** Data type for each contact info key */
export type ContactInfoValue = NonNullable<QueryContactInfo>[QueryContactInfoKeys];

// ============================================================================
// Transparency Types - derived from TypeGen
// ============================================================================
export type TransparencyProjectStatus = NonNullable<
  NonNullable<ALL_TRANSPARENCY_SECTIONS_QUERY_RESULT>[number]["projects"]
>[number]["status"];

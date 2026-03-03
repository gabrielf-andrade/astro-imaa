export const IMAGE_FRAGMENT = `
  hotspot,
  crop,  
  alt,    
  caption, 
  asset-> {
    _id,
    url, 
    altText,
    metadata {
      lqip, 
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  }
`;

export const HERO_FRAGMENT = `
  hero {
    heading,
    tagline,
  }
`;

export const SLUG_FRAGMENT = `
  "slug": slug.current
`;

const PAGE_REFERENCE_SLUG = `select(
  pageReference->_type == "homePage" => "inicio",
  pageReference->_type == "contactPage" => "contato",
  pageReference->slug.current
)`;

export const MENU_ITEM_FRAGMENT = `
  _key,
  "label": coalesce(label, pageReference->title),
  "slug": select(
    pageReference->_type == "homePage" => "inicio",
    pageReference->_type == "contactPage" => "contato",
    pageReference->slug.current
  ),
  "isDropdown": count(submenu) > 0,
  submenu[] {
    _key,
    "label": coalesce(label, pageReference->title),
    "slug": ${PAGE_REFERENCE_SLUG},
  }
`;

const VIDEO_FILE_FRAGMENT = `
  ...,
  "file": {
    "url": file.asset->url,
    "mimeType": file.asset->mimeType
  },
  "posterImage": posterImage { ${IMAGE_FRAGMENT} }
`;

const YOUTUBE_EMBED_FRAGMENT = `
  ...,
  url,
  caption
`;

const DOWNLOADABLE_FILE_FRAGMENT = `
  ...,
  "url": asset->url
`;

export const CTA_FRAGMENT = `
  label,
  linkType,
  "slug": ${PAGE_REFERENCE_SLUG},
  externalUrl,
  openInNewTab
`;

export const PORTABLE_TEXT_FRAGMENT = `
  ...,
  _type == "image" => { ${IMAGE_FRAGMENT} },
  _type == "videoFile" => { ${VIDEO_FILE_FRAGMENT} },
  _type == "youtubeEmbed" => { ${YOUTUBE_EMBED_FRAGMENT} },
  _type == "downloadableFile" => { ${DOWNLOADABLE_FILE_FRAGMENT} },
`;

export const BASE_PAGE_FRAGMENT = `
  _id,
  title,
  excerpt,
  ${SLUG_FRAGMENT}
`;

export const PAGE_BUILDER_FRAGMENT = `
  _key,
  _type,
  _type == "ctaSection" => {
    ...,
    "primaryCta": primaryCta { ${CTA_FRAGMENT} },
    "secondaryCta": secondaryCta { ${CTA_FRAGMENT} }
  },
  _type == "textWithIllustration" => {
    ...,
    "image": image { ${IMAGE_FRAGMENT} },
    "cta": cta { ${CTA_FRAGMENT} }
  },
  _type == "gallery" => {
    ...,
    "images": images[] { ${IMAGE_FRAGMENT} },
    autoplay,
    "autoplayInterval": coalesce(autoplayInterval, 4)
  },
  _type == "videoFile" => { ${VIDEO_FILE_FRAGMENT} },
  _type == "youtubeEmbed" => { ${YOUTUBE_EMBED_FRAGMENT} },
  _type == "horizontalRule" => {
    ...
  },
  _type == "richText" => {
    ...,
    content[] { ${PORTABLE_TEXT_FRAGMENT} },
    background,
  },
`;

export const DETAILED_BASE_PAGE_FRAGMENT = `
  ${BASE_PAGE_FRAGMENT},
  ${HERO_FRAGMENT},
  "featuredImage": featuredImage { ${IMAGE_FRAGMENT}, showInPage },
  "pageBuilder": pageBuilder[] { ${PAGE_BUILDER_FRAGMENT} }
`;

import { defineQuery } from "groq";
import { DETAILED_BASE_PAGE_FRAGMENT, HERO_FRAGMENT, PORTABLE_TEXT_FRAGMENT, SLUG_FRAGMENT } from "./fragments";

const DOWNLOADABLE_FILE_FRAGMENT = `
  _key,
  title,
  label,
  "fileUrl": asset->url,
  "fileName": asset->originalFilename,
`;

const TRANSPARENCY_PROJECT_FRAGMENT = `
  _key,
  title,
  origin,
  value,
  status,
  documents[] { ${DOWNLOADABLE_FILE_FRAGMENT} },
`;

// Dados da página portal (/transparencia) — document page com slug "transparencia"
export const TRANSPARENCY_INDEX_PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == "transparencia"][0] {
    ${DETAILED_BASE_PAGE_FRAGMENT}
  }
`);

// Query completa — usada tanto para getStaticPaths quanto para as props da página
export const ALL_TRANSPARENCY_SECTIONS_QUERY = defineQuery(`
  *[_type == "transparencySection"] | order(order asc) {
    _id,
    title,
    ${SLUG_FRAGMENT},
    ${HERO_FRAGMENT},
    partner,
    excerpt,
    "autoExcerpt": array::join(string::split(pt::text(description), "")[0...200], ""),
    description[] { ${PORTABLE_TEXT_FRAGMENT} },
    projects[] { ${TRANSPARENCY_PROJECT_FRAGMENT} },
    documents[] { ${DOWNLOADABLE_FILE_FRAGMENT} },
  }
`);

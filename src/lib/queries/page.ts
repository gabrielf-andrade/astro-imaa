import { defineQuery } from "groq";
import { DETAILED_BASE_PAGE_FRAGMENT } from "./fragments";

export const ALL_PAGES_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_createdAt desc) {
    ${DETAILED_BASE_PAGE_FRAGMENT}
  }
`);

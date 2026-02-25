import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

// Validate required environment variables
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || projectId.trim() === "") {
  throw new Error("Missing or empty PUBLIC_SANITY_PROJECT_ID environment variable. Please set this in your .env file.");
}

if (!dataset || dataset.trim() === "") {
  throw new Error("Missing or empty PUBLIC_SANITY_DATASET environment variable. Please set this in your .env file.");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: "2026-02-10",
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

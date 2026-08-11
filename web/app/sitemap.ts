import type { MetadataRoute } from "next";
import { RELATED_ORDER, SITE } from "@/content/site";

/* The sitemap is a route handler, and export mode needs to be told it has no dynamic
   behaviour to preserve. */
export const dynamic = "force-static";

/* Same URL set and ordering the generator emitted, so the file diffs cleanly against
   the one in site/. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.origin}/`,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...RELATED_ORDER.map((slug) => ({
      url: `${SITE.origin}/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

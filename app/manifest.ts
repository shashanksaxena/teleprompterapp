import type { MetadataRoute } from "next";

import { getSiteUrl, siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: siteConfig.title,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    categories: ["productivity", "video", "business"],
    icons: [
      {
        src: `${siteUrl}/icon?size=192`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: `${siteUrl}/icon?size=512`,
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: `${siteUrl}/apple-icon`,
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}

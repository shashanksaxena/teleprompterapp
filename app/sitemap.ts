import type { MetadataRoute } from "next";

import { completeArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const pageLastModified = new Date("2026-09-08");
const policyLastModified = new Date("2026-09-08");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
      lastModified: pageLastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/free-online-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/free-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/ai-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/teleprompter-app`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/video-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/teleprompter-for-webcam`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/teleprompter-for-video-recording`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/teleprompter-for-presentations`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${siteUrl}/teleprompter-for-phone`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/browser-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/automatic-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/how-to-use`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/about`,
      lastModified: policyLastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: policyLastModified,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: policyLastModified,
      changeFrequency: "yearly",
      priority: 0.4
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: policyLastModified,
      changeFrequency: "yearly",
      priority: 0.4
    },
    {
      url: `${siteUrl}/teleprompter-for-instagram-reels`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/teleprompter-for-reels`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/teleprompter-for-youtube`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/teleprompter-for-online-teaching`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/mirror-mode-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/voice-scroll-teleprompter`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/teleprompter-tips`,
      lastModified: pageLastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: pageLastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...completeArticles.map((article) => ({
      url: `${siteUrl}/articles/${article.slug}`,
      lastModified: new Date(article.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];
}

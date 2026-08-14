import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About the online teleprompter tool",
  description:
    "Learn why FreeTeleprompter.in exists, who maintains it, and how the browser teleprompter helps creators, educators, founders, coaches, and marketers record smoother videos.",
  path: "/about",
  keywords: ["about freeteleprompter", "online teleprompter tool", "browser teleprompter", "teleprompter for creators"]
});

export default function AboutPage() {
  return (
    <ContentPage
      kicker="About"
      title="About FreeTeleprompter.in"
      intro="FreeTeleprompter.in is a browser-based teleprompter built for creators, educators, founders, coaches, teachers, and marketers who want a simple tool for writing, practicing, and recording videos without getting lost in heavy software."
      sections={[
        {
          heading: "Why this site exists",
          paragraphs: [
            "A lot of people know what they want to say on camera, but they struggle to stay on track once recording starts. This tool was created to remove that friction by combining script input, teleprompter controls, and recording support in one place.",
            "The goal is practical value: help users prepare scripts, maintain eye-line, record cleaner takes, and reduce retakes for reels, YouTube videos, lessons, product demos, and presentations."
          ]
        },
        {
          heading: "What the tool includes",
          paragraphs: [
            "The teleprompter supports adjustable speed, text sizing, mirror mode, voice-assisted pacing, Google sign-in, account-based saved scripts, and a mobile-friendly recording stage.",
            "We continue improving the product to make it useful for repeat workflows rather than treating it like a one-page gimmick."
          ]
        },
        {
          heading: "Who it helps",
          paragraphs: [
            "The product is especially useful for young content creators, solo founders, educators, coaches, marketers, and small teams that need a clean prompting workflow without installing dedicated desktop software.",
            `If your work depends on speaking clearly on camera, the site is designed to save time and reduce recording stress. It is independently built and maintained by ${siteConfig.author}, and developed with love in ${siteConfig.country}.`
          ]
        }
      ]}
    />
  );
}

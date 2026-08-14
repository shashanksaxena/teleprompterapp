import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Teleprompter for YouTube videos and creator recording",
  description:
    "Learn how to use a teleprompter for YouTube videos, tutorials, founder updates, and educational content with better pacing, cleaner intros, and smoother delivery.",
  path: "/teleprompter-for-youtube",
  keywords: [
    "teleprompter for youtube",
    "free teleprompter for youtube videos",
    "youtube teleprompter",
    "teleprompter for video recording",
    "online teleprompter with recording"
  ]
});

export default function TeleprompterForYoutubePage() {
  return (
    <ContentPage
      kicker="YouTube workflow"
      title="Teleprompter for YouTube videos: a practical setup guide"
      intro="YouTube creators need more than a scrolling script. They need a workflow that supports intros, teaching, demos, and speaking confidence. This guide shows how to use FreeTeleprompter.in as a YouTube teleprompter."
      sections={[
        {
          heading: "Why YouTube creators use teleprompters",
          paragraphs: [
            "For YouTube, consistency matters. Even experienced speakers benefit from prompts when recording course lessons, founder updates, product demos, tutorials, list videos, and educational explainers.",
            "A teleprompter helps maintain pacing, reduces filler, and keeps the message aligned with the structure you planned."
          ]
        },
        {
          heading: "How to structure a YouTube script",
          paragraphs: [
            "Start with a clear intro, then break the rest of the video into distinct sections with natural pauses. Avoid giant walls of text. Shorter blocks are easier to read and sound better on camera.",
            "Use saved scripts to keep recurring sections consistent, such as your intro, value proposition, outro, or CTA language."
          ]
        },
        {
          heading: "Using the tool during recording",
          paragraphs: [
            "With FreeTeleprompter.in, you can tune speed, font size, mirror mode, and camera mirror before opening the recording stage. This helps when your camera setup or reading distance changes.",
            "For educational content, voice-assisted pacing can also help maintain a comfortable delivery instead of forcing you to match a rigid speed."
          ]
        }
      ]}
      useCases={[
        "Tutorial videos",
        "Educational explainers",
        "Founder updates",
        "Product demos",
        "Course lessons"
      ]}
      faqs={[
        {
          question: "Should YouTube scripts be written word for word?",
          answer:
            "Usually the best results come from structured talking points written in short speaking blocks, not long essay-style paragraphs."
        },
        {
          question: "Can a teleprompter make YouTube videos sound more natural?",
          answer:
            "Yes, if the script is written conversationally and the scrolling speed matches your delivery. The goal is support, not robotic reading."
        }
      ]}
      relatedLinks={[
        { href: "/teleprompter-for-instagram-reels", label: "Teleprompter for Instagram reels" },
        { href: "/video-teleprompter", label: "Video teleprompter" },
        { href: "/teleprompter-tips", label: "Teleprompter speaking tips" }
      ]}
    />
  );
}

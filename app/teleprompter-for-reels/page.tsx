import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Teleprompter for reels and short videos",
  description:
    "Learn how to use a teleprompter for reels, short videos, hooks, creator scripts, vertical recordings, and repeatable talking-head workflows.",
  path: "/teleprompter-for-reels",
  keywords: ["teleprompter for reels", "reel teleprompter", "short video teleprompter", "teleprompter for creators"]
});

export default function TeleprompterForReelsPage() {
  return (
    <ContentPage
      kicker="Creator guide"
      title="How to use a teleprompter for Instagram reels and short videos"
      intro="Creators often need to speak naturally on camera while staying on-script. This page explains how to use FreeTeleprompter.in for Instagram reels, short educational videos, talking-head content, and creator workflows."
      sections={[
        {
          heading: "Why reels benefit from a teleprompter",
          paragraphs: [
            "Short-form video looks casual, but most strong reels still rely on structure. Hooks, transitions, call-to-actions, and concise explanations are easier to deliver when the speaker can glance naturally at a script instead of trying to memorize everything.",
            "A browser-based teleprompter helps creators reduce retakes, maintain flow, and keep messaging sharper during fast recording sessions."
          ]
        },
        {
          heading: "Best setup for short videos",
          paragraphs: [
            "For short videos, keep your script broken into shorter lines and use a slightly slower speed than you think you need. This helps you sound conversational instead of rushed.",
            "If you are recording vertically, write shorter paragraphs, test your framing, and use the recording stage to rehearse your delivery before doing the final take."
          ]
        },
        {
          heading: "Using FreeTeleprompter.in for reels",
          paragraphs: [
            "Paste your hook, body, and CTA into the script editor, adjust the speed, and open the camera stage. If you prefer a more natural rhythm, turn on voice scroll and let the prompt follow your speaking pace.",
            "Saved scripts are useful for repeated reel formats such as product intros, educational explainers, offer announcements, and recurring series."
          ]
        }
      ]}
    />
  );
}

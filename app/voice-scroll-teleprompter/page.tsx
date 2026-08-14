import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Voice scroll teleprompter guide",
  description:
    "Learn how voice-assisted teleprompter scrolling works, when to use it, and how to combine voice scroll with saved scripts and video recording.",
  path: "/voice-scroll-teleprompter",
  keywords: ["voice scroll teleprompter", "voice controlled teleprompter", "speech teleprompter", "voice assisted scrolling"]
});

export default function VoiceScrollTeleprompterPage() {
  return (
    <ContentPage
      kicker="Feature guide"
      title="Voice scroll teleprompter: how it works"
      intro="Voice-assisted scrolling can make a teleprompter feel more natural because the script advances with your speaking rhythm instead of forcing you to follow a fixed pace. This guide explains how that works in FreeTeleprompter.in."
      sections={[
        {
          heading: "Why voice scroll matters",
          paragraphs: [
            "Traditional teleprompters rely on static speed settings. That works for some speakers, but many people speed up, slow down, pause for emphasis, or restart lines while recording.",
            "Voice-assisted pacing can make delivery feel less robotic because the teleprompter reacts to your speech instead of locking you into one exact motion."
          ]
        },
        {
          heading: "When to use it",
          paragraphs: [
            "Voice scroll is helpful for conversational content, lessons, coaching videos, and founder-style updates where delivery is not perfectly linear.",
            "If your script is highly rehearsed and short, a fixed speed may still be enough. Voice support becomes more useful when you want flexibility."
          ]
        },
        {
          heading: "Practical tips",
          paragraphs: [
            "Use a clean microphone environment, speak clearly, and keep your script organized into readable blocks. This gives the browser better signals and makes the overall prompting experience smoother.",
            "You can still combine voice scroll with saved scripts and recording preview for a repeatable workflow."
          ]
        }
      ]}
    />
  );
}

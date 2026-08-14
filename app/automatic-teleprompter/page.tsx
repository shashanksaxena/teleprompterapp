import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Automatic teleprompter with hands-free scrolling",
  description:
    "Learn how an automatic teleprompter works, when hands-free scrolling helps, and how FreeTeleprompter.in supports fixed-speed and voice-aware prompting.",
  path: "/automatic-teleprompter",
  keywords: ["automatic teleprompter", "hands free teleprompter", "auto scroll teleprompter", "voice aware teleprompter"]
});

export default function AutomaticTeleprompterPage() {
  return (
    <ContentPage
      kicker="Automation keyword"
      title="Automatic teleprompter with voice-aware pacing and hands-free reading"
      intro="An automatic teleprompter is useful when you do not want to keep adjusting the scroll manually during recording. This page explains how automatic prompting works and why voice-aware pacing is valuable."
      sections={[
        {
          heading: "What automatic teleprompter means",
          paragraphs: [
            "Some users mean a teleprompter that scrolls on its own at a chosen speed. Others mean a tool that reacts to their actual speaking rhythm. Both reduce the need for manual control while recording.",
            "Automatic prompting helps speakers stay focused on delivery instead of constantly managing the screen."
          ]
        },
        {
          heading: "Where automatic prompting helps most",
          paragraphs: [
            "It works especially well for solo creators, educational videos, personal brand content, and repeatable scripts where you want a smooth, consistent pace.",
            "It can also help nervous speakers feel less overwhelmed because the tool carries part of the flow."
          ]
        },
        {
          heading: "How FreeTeleprompter.in supports this",
          paragraphs: [
            "FreeTeleprompter.in combines adjustable scrolling with voice-friendly prompting, which is a stronger automatic experience than a fixed-speed teleprompter alone.",
            "That makes it useful for creators who want both control and natural pacing."
          ]
        }
      ]}
    />
  );
}

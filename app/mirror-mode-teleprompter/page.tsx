import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Mirror mode teleprompter setup guide",
  description:
    "Learn what mirror mode does, when to flip teleprompter text, and how to use camera mirror and script mirror settings for teleprompter glass rigs.",
  path: "/mirror-mode-teleprompter",
  keywords: ["mirror mode teleprompter", "teleprompter glass", "flip teleprompter text", "camera mirror teleprompter"]
});

export default function MirrorModeTeleprompterPage() {
  return (
    <ContentPage
      kicker="Feature guide"
      title="Mirror mode teleprompter explained"
      intro="Mirror mode is one of the most important teleprompter features for camera-rig users. This page explains what mirror mode does, why it matters, and how FreeTeleprompter.in supports it."
      sections={[
        {
          heading: "What mirror mode does",
          paragraphs: [
            "Mirror mode flips the script horizontally so it can be reflected correctly on teleprompter glass. Without it, the reflected text may appear reversed and difficult to read during filming.",
            "This matters most for creators who use a glass teleprompter rig in front of the camera lens."
          ]
        },
        {
          heading: "Text mirror vs camera mirror",
          paragraphs: [
            "Text mirror and camera mirror solve different problems. Text mirror is for the script itself, while camera mirror changes how the live preview appears to you on screen.",
            "FreeTeleprompter.in supports both, which makes it easier to adapt the tool to different creator setups and recording styles."
          ]
        },
        {
          heading: "When to turn mirror mode on",
          paragraphs: [
            "Turn on mirror mode only when your physical setup needs it. If you are reading directly from a phone, laptop, or desktop monitor without teleprompter glass, normal text is usually the correct choice.",
            "Testing your setup before a live recording session helps avoid awkward last-minute changes."
          ]
        }
      ]}
    />
  );
}

import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Teleprompter tips for smoother videos",
  description:
    "Practical teleprompter tips for writing conversational scripts, chunking text, choosing scroll speed, practicing with camera setups, and recording smoother videos.",
  path: "/teleprompter-tips",
  keywords: ["teleprompter tips", "how to read a teleprompter", "teleprompter script tips", "video recording tips"]
});

export default function TeleprompterTipsPage() {
  return (
    <ContentPage
      kicker="Creator tips"
      title="Best teleprompter tips for smoother on-camera videos"
      intro="A teleprompter helps, but the quality of your delivery still depends on how you prepare the script and use the tool. These teleprompter tips are designed for creators, educators, founders, coaches, and marketers recording real content."
      sections={[
        {
          heading: "Write for speech, not for reading",
          paragraphs: [
            "Many scripts sound fine on paper but awkward on camera. The easiest fix is to write more like you speak. Use shorter sentences, stronger verbs, and natural pauses.",
            "If a sentence feels hard to say out loud, it will usually feel hard to read smoothly on a teleprompter too."
          ]
        },
        {
          heading: "Break the script into visual chunks",
          paragraphs: [
            "Chunking improves readability. Separate ideas into short paragraphs so your eyes can track the text without getting lost.",
            "This also helps with pacing because you can treat each block like a mini-thought instead of one long uninterrupted paragraph."
          ]
        },
        {
          heading: "Use slower settings than you expect",
          paragraphs: [
            "Most people choose a speed that is too fast at first. A slightly slower prompt usually looks more natural on camera because it gives you space to breathe and emphasize key lines.",
            "Do a short test recording first, then adjust the speed only after hearing yourself back."
          ]
        },
        {
          heading: "Practice with the same setup you record with",
          paragraphs: [
            "If you will record on a phone or in a glass rig, practice on that setup. Distance, font size, framing, and eye-line all affect readability.",
            "A teleprompter workflow becomes much more effective when the rehearsal environment matches the real recording environment."
          ]
        }
      ]}
    />
  );
}

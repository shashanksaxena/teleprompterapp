import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Video teleprompter for browser recording",
  description:
    "Use a video teleprompter for browser-based recording, smoother delivery, mirror controls, mobile prompting, and creator-style talking-head videos.",
  path: "/video-teleprompter",
  keywords: ["video teleprompter", "teleprompter with video recording", "browser video teleprompter", "record with teleprompter"]
});

export default function VideoTeleprompterPage() {
  return (
    <ContentPage
      kicker="Video workflow"
      title="Video teleprompter for browser-based recording and smoother delivery"
      intro="A video teleprompter helps you speak clearly while recording without losing eye contact or forgetting your structure. This page focuses on using FreeTeleprompter.in as a video teleprompter for creator-style shoots."
      sections={[
        {
          heading: "Why video creators rely on teleprompters",
          paragraphs: [
            "Recording on camera is different from writing. Even confident speakers can lose flow once the camera is live, especially during intros, calls to action, and structured teaching content.",
            "A teleprompter reduces that friction by keeping your next line visible while you maintain momentum."
          ]
        },
        {
          heading: "What matters in a video teleprompter",
          paragraphs: [
            "You want large readable text, controllable pace, camera-friendly positioning, and a distraction-free recording stage. Mirror options can also help depending on your shooting setup.",
            "For mobile users, it is especially important that the teleprompter remains smooth and easy to control during recording."
          ]
        },
        {
          heading: "Who this workflow helps",
          paragraphs: [
            "A video teleprompter is useful for creators filming reels, teachers recording lessons, founders making updates, sales professionals delivering short pitches, and marketers producing promotional content.",
            "FreeTeleprompter.in is built for that practical recording workflow rather than just a static demo prompt."
          ]
        }
      ]}
    />
  );
}

import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "How to use the free online teleprompter",
  description:
    "Step-by-step guide for using FreeTeleprompter.in to paste scripts, adjust speed, mirror text, record video, use voice scroll, and save scripts.",
  path: "/how-to-use",
  keywords: ["how to use teleprompter", "online teleprompter guide", "teleprompter setup", "record with teleprompter"]
});

export default function HowToUsePage() {
  return (
    <ContentPage
      kicker="Guide"
      title="How to use FreeTeleprompter.in"
      intro="This guide explains how to use the online teleprompter for writing, reading, and recording your script smoothly on desktop or mobile."
      sections={[
        {
          heading: "Step 1: Paste or write your script",
          paragraphs: [
            "Open the main teleprompter page and paste your script into the editor. Your draft is saved locally so you can leave the page and come back without losing your work.",
            "If you sign in with Google, you can also save scripts to your account and access them later."
          ]
        },
        {
          heading: "Step 2: Adjust your reading settings",
          paragraphs: [
            "Use the prompt controls to change speed, text size, theme, mirror mode, camera mirror, and full-screen behavior. These settings help you tailor the reading experience to your voice, screen size, and filming setup.",
            "Mirror mode is especially useful for teleprompter glass rigs that need reversed text."
          ]
        },
        {
          heading: "Step 3: Start the recording stage",
          paragraphs: [
            "Tap play to enter the camera stage. From there, you can begin the teleprompter, pause it, stop it, or use voice scroll if your browser supports speech-based pacing.",
            "When you stop, the recorded take is shown in the preview panel so you can review it before downloading."
          ]
        },
        {
          heading: "Step 4: Save and improve your workflow",
          paragraphs: [
            "Use saved scripts for repeated content like intros, lessons, presentations, hooks, call-to-actions, and product explainers.",
            "The best results usually come from shorter paragraphs, natural line breaks, and slightly slower scroll speed than you think you need."
          ]
        }
      ]}
    />
  );
}

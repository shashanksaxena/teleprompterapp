import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Browser teleprompter with no download",
  description:
    "Use a browser teleprompter with no download for video recording, mobile prompting, mirror mode, fullscreen reading, and fast creator workflows.",
  path: "/browser-teleprompter",
  keywords: ["browser teleprompter", "no download teleprompter", "web teleprompter", "online teleprompter"]
});

export default function BrowserTeleprompterPage() {
  return (
    <ContentPage
      kicker="Web teleprompter"
      title="Browser teleprompter with no download and mobile-friendly controls"
      intro="A browser teleprompter is ideal when you want a simple recording tool without installing anything. This page explains the advantages of a no-download teleprompter and where FreeTeleprompter.in fits."
      sections={[
        {
          heading: "Why no-download tools convert well",
          paragraphs: [
            "People searching for a quick teleprompter often need it right now for a recording session, class, or meeting. Waiting to install an app adds friction at exactly the wrong time.",
            "A browser teleprompter can open instantly and work across operating systems, which is one reason these tools appeal to creator and business users."
          ]
        },
        {
          heading: "Important browser teleprompter features",
          paragraphs: [
            "Stable scrolling, readable text, dark and light themes, fullscreen reading, and quick script editing are usually more important than flashy UI elements.",
            "For camera setups, mirror controls and easy access to the script during recording make a browser teleprompter much more useful."
          ]
        },
        {
          heading: "When to choose FreeTeleprompter.in",
          paragraphs: [
            "Choose FreeTeleprompter.in when you want a browser-first prompting tool for video work, social content, classes, presentations, or interviews without needing separate software.",
            "It is especially practical for users who record often and want a fast repeatable workflow."
          ]
        }
      ]}
    />
  );
}

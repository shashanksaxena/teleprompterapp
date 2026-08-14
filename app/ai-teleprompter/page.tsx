import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AI teleprompter for creators and educators",
  description:
    "Explore an AI teleprompter workflow with voice-aware pacing, future-ready AI script generation, speaking assistance, and browser-based recording for creators and educators.",
  path: "/ai-teleprompter",
  keywords: [
    "AI teleprompter",
    "AI speaking assistant",
    "AI script generator",
    "AI video script tool",
    "AI content creator tools"
  ]
});

export default function AITeleprompterPage() {
  return (
    <ContentPage
      kicker="AI keyword"
      title="AI teleprompter for creators, educators, and video teams"
      intro="AI teleprompter workflows are growing because creators want more than just scrolling text. They want help with scripting, pacing, confidence, and recording consistency. This page explains how FreeTeleprompter.in fits into that future-facing category."
      sections={[
        {
          heading: "What people mean by AI teleprompter",
          paragraphs: [
            "An AI teleprompter usually means a tool that helps with script generation, pacing, speaking confidence, or adaptive prompting instead of acting as a static text scroller.",
            "That can include features like voice-follow prompting, AI script drafting, speaking feedback, subtitle support, or workflow assistance for content production."
          ]
        },
        {
          heading: "Why this category is growing",
          paragraphs: [
            "Creators increasingly want one tool that helps them think, write, record, and publish faster. AI-assisted creator workflows are expanding quickly, especially for YouTube, reels, personal brands, and educational content.",
            "A teleprompter sits at a useful point in that stack because it is where ideas turn into spoken delivery."
          ]
        },
        {
          heading: "How FreeTeleprompter.in is positioned",
          paragraphs: [
            "FreeTeleprompter.in already supports creator-friendly prompting with voice-aware pacing, browser-based recording, and saved scripts. It is also structured for future AI additions such as script generation, speaking feedback, and creator workflow assistance.",
            "This makes it a practical bridge between a classic online teleprompter and a more advanced AI speaking assistant."
          ]
        }
      ]}
      useCases={[
        "AI-assisted script workflows",
        "Creator productivity",
        "YouTube scripting",
        "Educational recording",
        "Speaking practice"
      ]}
      faqs={[
        {
          question: "What makes an AI teleprompter different from a basic teleprompter?",
          answer:
            "An AI teleprompter goes beyond fixed scrolling text and usually includes features like adaptive pacing, script help, speaking guidance, or workflow assistance."
        },
        {
          question: "Does FreeTeleprompter.in already have AI features?",
          answer:
            "It already supports voice-aware prompting and is structured for future AI additions such as script generation and speaking feedback."
        }
      ]}
      relatedLinks={[
        { href: "/voice-scroll-teleprompter", label: "Voice scroll teleprompter" },
        { href: "/automatic-teleprompter", label: "Automatic teleprompter" },
        { href: "/teleprompter-app", label: "Teleprompter app alternative" }
      ]}
    />
  );
}

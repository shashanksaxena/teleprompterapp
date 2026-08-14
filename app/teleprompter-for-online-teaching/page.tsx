import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Teleprompter for online teaching, lessons, and course videos",
  description:
    "Use a teleprompter for online teaching, recorded lessons, classes, and course modules with better pacing, cleaner explanations, and a browser-based workflow.",
  path: "/teleprompter-for-online-teaching",
  keywords: [
    "teleprompter for online teaching",
    "teleprompter for presentations",
    "teleprompter for public speaking",
    "teleprompter for zoom meetings",
    "teleprompter for classes"
  ]
});

export default function TeleprompterForOnlineTeachingPage() {
  return (
    <ContentPage
      kicker="Education keyword"
      title="Teleprompter for online teaching, classes, and recorded lessons"
      intro="Teachers and educators often need a teleprompter for recorded lessons, course modules, and live explanation videos. This page explains how FreeTeleprompter.in supports online teaching workflows."
      sections={[
        {
          heading: "Why educators use teleprompters",
          paragraphs: [
            "Teaching on camera requires clarity, pacing, and structure. A teleprompter helps you stay aligned with your lesson plan without sounding like you are reading word for word.",
            "It is especially helpful for intros, transitions between topics, and consistent course recording."
          ]
        },
        {
          heading: "Script tips for lesson recording",
          paragraphs: [
            "Break your lesson into sections, keep important definitions visible, and use short speaking blocks instead of long paragraphs. This improves delivery and reduces retakes.",
            "If you record recurring classes, saved scripts can help you standardize openings, summaries, and calls to action."
          ]
        },
        {
          heading: "Why the browser format helps teachers",
          paragraphs: [
            "A browser teleprompter is convenient for teachers because it works across school laptops, personal devices, and quick recording setups without requiring installation.",
            "FreeTeleprompter.in is useful for course creators, tutors, workshop hosts, and educators building online lessons."
          ]
        }
      ]}
      useCases={[
        "Recorded lessons",
        "Course modules",
        "Workshop videos",
        "Teacher explainers",
        "Presentation practice"
      ]}
      faqs={[
        {
          question: "Can a teleprompter help teachers sound more natural?",
          answer:
            "Yes. When lesson scripts are broken into short sections, a teleprompter can keep explanations structured without making delivery sound stiff."
        },
        {
          question: "Is this only for prerecorded lessons?",
          answer:
            "It is most useful for recorded content, but many teachers also use teleprompter-style notes while preparing webinars, workshops, or presentations."
        }
      ]}
      relatedLinks={[
        { href: "/teleprompter-for-youtube", label: "Teleprompter for YouTube videos" },
        { href: "/voice-scroll-teleprompter", label: "Voice scroll teleprompter" },
        { href: "/how-to-use", label: "How to use the tool" }
      ]}
    />
  );
}

import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";
import { HomepageContent } from "@/components/homepage-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Online Teleprompter for Videos",
  description:
    "Use a free online teleprompter for YouTube, webcam videos, presentations, and phone recording. Paste a script, adjust scrolling speed, and start in your browser.",
  keywords: [
    "online teleprompter",
    "free teleprompter",
    "teleprompter online",
    "free teleprompter for videos",
    "teleprompter for YouTube",
    "browser teleprompter",
    "teleprompter for webcam",
    "teleprompter for phone",
    "teleprompter with voice control"
  ],
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
        <AppHeader plan={{ isPremium: false, name: "Free" }} />
      </main>
      <HomepageContent />
    </>
  );
}

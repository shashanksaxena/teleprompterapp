import type { Metadata } from "next";

import { TeleprompterApp } from "@/components/teleprompter-app";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Teleprompter app alternative in your browser",
  description:
    "Use FreeTeleprompter.in as a teleprompter app alternative with browser-based script editing, video recording, mirror mode, saved scripts, and mobile controls.",
  path: "/teleprompter-app",
  keywords: ["teleprompter app", "teleprompter app alternative", "online teleprompter app", "web teleprompter app"]
});

export default function TeleprompterAppPage() {
  return <TeleprompterApp />;
}

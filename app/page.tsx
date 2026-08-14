import type { Metadata } from "next";

import { HomepageContent } from "@/components/homepage-content";
import { TeleprompterApp } from "@/components/teleprompter-app";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return (
    <>
      <TeleprompterApp />
      <HomepageContent />
    </>
  );
}

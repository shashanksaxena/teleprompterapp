import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of use for FreeTeleprompter.in",
  description:
    "Read the terms of use for FreeTeleprompter.in, including acceptable use, accounts, premium access, saved scripts, recording behavior, and service availability.",
  path: "/terms",
  keywords: ["freeteleprompter terms", "teleprompter terms of use", "online teleprompter terms", "creator tool terms"]
});

export default function TermsPage() {
  return (
    <ContentPage
      kicker="Terms"
      title="Terms of use summary"
      intro="These terms summarize the expected use of FreeTeleprompter.in and clarify that the site is a practical web tool for scripting and recording support."
      sections={[
        {
          heading: "Using the service",
          paragraphs: [
            "You may use the teleprompter for lawful content creation, rehearsal, education, presentations, and related communication workflows.",
            "Users are responsible for the material they paste, save, record, or attempt to export from the service."
          ]
        },
        {
          heading: "Acceptable content and conduct",
          paragraphs: [
            "Do not use the service to create, store, distribute, or promote illegal content, deceptive activity, malware, impersonation, harassment, hate, sexually explicit material, or content that infringes someone else's rights.",
            "Do not attempt to manipulate ads, inflate clicks or impressions, interfere with the service, scrape private account data, or bypass limits intended to keep the tool stable for other users."
          ]
        },
        {
          heading: "Accounts and premium access",
          paragraphs: [
            "Some features depend on signing in with Google or holding an active premium status. Access to premium capabilities may change if a subscription expires, is cancelled, or is not successfully renewed.",
            "We may refine free and premium limits over time as the product evolves."
          ]
        },
        {
          heading: "Advertising and third-party services",
          paragraphs: [
            "The site may display advertising or use third-party services for analytics, authentication, hosting, payments, and product reliability. Those services may apply their own terms and policies.",
            "Ads are provided to support the service. Users must not click ads for the purpose of generating revenue or ask others to do so."
          ]
        },
        {
          heading: "Service availability",
          paragraphs: [
            "The tool is provided as a web application and may change over time as features improve, bugs are fixed, or browser support changes.",
            "We aim to keep the experience stable, but uninterrupted service is not guaranteed on every device or browser combination."
          ]
        }
      ]}
    />
  );
}

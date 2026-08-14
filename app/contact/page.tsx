import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact FreeTeleprompter.in support",
  description:
    "Contact FreeTeleprompter.in for product feedback, bug reports, support questions, saved script issues, recording problems, partnerships, and feature suggestions.",
  path: "/contact",
  keywords: ["contact freeteleprompter", "teleprompter support", "online teleprompter feedback", "creator tool support"]
});

export default function ContactPage() {
  return (
    <ContentPage
      kicker="Contact"
      title="Contact FreeTeleprompter.in"
      intro="If you want to report a bug, suggest a feature, discuss partnerships, or ask a product question, this page explains the best way to reach the team behind FreeTeleprompter.in."
      sections={[
        {
          heading: "Product feedback",
          paragraphs: [
            "We welcome feedback about teleprompter speed, script saving, camera behavior, mobile usability, and download experience. Practical user notes help improve the product much faster than generic comments.",
            "When reporting an issue, include your device, browser, and the exact steps that caused the problem if possible."
          ]
        },
        {
          heading: "Support topics",
          paragraphs: [
            "Useful support topics include saved scripts, sign-in problems, recording preview issues, mirror mode behavior, and premium download questions.",
            "If you are using the tool for business or education, feel free to share your workflow and what would make the teleprompter more useful for your use case.",
            "For account, privacy, advertising, copyright, or policy concerns, include the relevant page URL and enough detail for the team to review the issue responsibly."
          ]
        },
        {
          heading: "How to reach us",
          paragraphs: [
            `The easiest support path is email: ${siteConfig.supportEmail}. This address can be used for product questions, bug reports, creator partnerships, and general support.`,
            "This page helps users understand that the product is maintained and open to practical feedback from creators, educators, teams, and partners.",
            "We aim to review genuine support messages and policy reports in a reasonable timeframe, especially when they affect user access, privacy, safety, or site quality."
          ]
        }
      ]}
    />
  );
}

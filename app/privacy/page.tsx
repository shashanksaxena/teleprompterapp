import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy policy for FreeTeleprompter.in",
  description:
    "Read how FreeTeleprompter.in handles local drafts, account sessions, saved scripts, camera and microphone permissions, analytics, and advertising.",
  path: "/privacy",
  keywords: ["freeteleprompter privacy", "teleprompter privacy policy", "saved scripts privacy", "browser recording privacy"]
});

export default function PrivacyPage() {
  return (
    <ContentPage
      kicker="Privacy"
      title="Privacy policy summary"
      intro="This summary explains the basic privacy behavior of FreeTeleprompter.in in straightforward language so users understand what the tool does with scripts, account sessions, and browser-based features."
      sections={[
        {
          heading: "Local drafts and browser behavior",
          paragraphs: [
            "Draft scripts may be stored locally in your browser so you can return to your work without losing it. This is meant to improve usability and reduce accidental data loss.",
            "Browser-based features like speech recognition, camera access, and microphone access only work when you explicitly allow them."
          ]
        },
        {
          heading: "Camera, microphone, and recordings",
          paragraphs: [
            "Camera and microphone permissions are requested by the browser only when you choose recording or speech-assisted features. FreeTeleprompter.in does not need those permissions for basic script editing or fixed-speed scrolling.",
            "Recordings are created in your browser session for preview and download. Avoid pasting or recording confidential, illegal, or sensitive material unless you understand your own device, browser, and account settings."
          ]
        },
        {
          heading: "Signed-in accounts",
          paragraphs: [
            "If you sign in with Google, the application stores basic account information needed to support authenticated features such as saved scripts and premium access state.",
            "Saved scripts linked to your account are intended to remain visible to you when you use the service while signed in."
          ]
        },
        {
          heading: "Analytics, advertising, and cookies",
          paragraphs: [
            "The site may use analytics and advertising tools, including Google services, to understand usage, measure performance, prevent abuse, and support the service. These tools may use cookies or similar browser storage and may collect standard information such as pages visited, device type, approximate location, and interaction events.",
            "Advertising placements are intended to remain clearly separated from the main tool and article content. We do not ask users to click ads, and ads should not block access to the teleprompter or policy pages."
          ]
        },
        {
          heading: "Your choices and contact",
          paragraphs: [
            "You can clear locally stored drafts through your browser settings. You can also choose not to grant camera, microphone, or speech permissions if you only want to use the text scroller.",
            "For privacy questions, account support, or requests related to saved scripts, contact the site owner at shashanksaxena18@gmail.com."
          ]
        }
      ]}
    />
  );
}

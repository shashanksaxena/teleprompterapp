import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Free Teleprompter Online for Video Recording",
    description: "Use a free teleprompter online for YouTube, webcam videos, presentations, phone recording, and rehearsals without installing software.",
    path: "/free-teleprompter",
    keywords: ["free teleprompter", "free teleprompter online", "online teleprompter free", "free video teleprompter"]
});

export default function FreeTeleprompterPage() {
    return <ContentPage
        kicker="Free teleprompter"
        title="Free teleprompter online for videos, presentations, and practice"
        intro="Paste your script, adjust the reading speed and text size, and open a browser teleprompter in seconds. Camera access is optional, so you can rehearse before recording."
        sections={[
            { heading: "A free teleprompter that starts in your browser", paragraphs: ["FreeTeleprompter.in is designed for creators who need a readable script without installing a desktop application. It works for YouTube videos, reels, lessons, presentations, and webcam recording.", "Your draft can stay on your device while you test the reading flow. Sign in only when you want account features such as saved scripts and download access."] },
            { heading: "Adjust the prompt for your setup", paragraphs: ["Change scroll speed, font size, light or dark theme, fullscreen mode, mirror mode, and optional voice scroll. The right setting depends on your distance from the screen and speaking pace.", "Use a short practice take before recording a final video. This makes it easier to correct eye-line, pacing, and camera position."] },
            { heading: "Start using the free teleprompter", paragraphs: ["Open the tool, paste a script, and press Play when you are ready. You can read without camera permission and enable recording only when you choose to make a take.", "The first three downloads are free for authenticated users. A monthly subscription is available after the free allowance is used."] }
        ]}
        faqs={[{ question: "Is this free teleprompter really online?", answer: "Yes. The main prompting workflow runs in a modern browser without requiring a desktop installation." }, { question: "Can I use it without a camera?", answer: "Yes. Camera access is optional for reading and rehearsal." }]}
        relatedLinks={[{ href: "/teleprompter-for-youtube", label: "Teleprompter for YouTube" }, { href: "/teleprompter-for-webcam", label: "Teleprompter for webcam" }, { href: "/teleprompter-app", label: "Open the tool" }]}
    />;
}

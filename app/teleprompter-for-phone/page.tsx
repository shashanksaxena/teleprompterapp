import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Teleprompter for Phone Recording",
    description: "Use your phone as a teleprompter for reels, YouTube Shorts, lessons, interviews, and vertical video recording with readable text and smooth scrolling.",
    path: "/teleprompter-for-phone",
    keywords: ["teleprompter for phone", "phone teleprompter", "mobile teleprompter", "teleprompter for vertical video"]
});

export default function PhoneTeleprompterPage() {
    return <ContentPage
        kicker="Phone teleprompter"
        title="Teleprompter for phone recording and vertical video"
        intro="Turn a phone or nearby mobile screen into a practical prompt for reels, Shorts, lessons, interviews, and quick camera-ready videos."
        sections={[
            { heading: "Keep the phone stable and close to the lens", paragraphs: ["Use a tripod, stand, or compact teleprompter rig so the phone does not move while you speak. Keep the script close to the camera lens to reduce visible eye movement.", "Choose vertical framing for short-form platforms and test the crop before recording the final take."] },
            { heading: "Use large text and a calm pace", paragraphs: ["Mobile screens are smaller and are often placed farther away during recording. Increase font size until the script is effortless to read, then lower the speed if you need more time between lines.", "Short paragraphs make it easier to recover when a take needs a restart."] },
            { heading: "Rehearse before enabling recording", paragraphs: ["You can read the prompt without camera access. When the framing and delivery feel right, enable the camera and microphone for the recording session.", "Open the tool to paste your script and adjust the phone-friendly reading view."] }
        ]}
        faqs={[{ question: "Can I use my phone as a teleprompter?", answer: "Yes. A phone can display the prompt directly, or you can use a second phone near the camera while recording on another device." }, { question: "Is a phone teleprompter useful for reels?", answer: "Yes. Large text, short blocks, and a measured pace help you deliver concise vertical videos with fewer retakes." }]}
        relatedLinks={[{ href: "/teleprompter-for-reels", label: "Reels guide" }, { href: "/teleprompter-for-video-recording", label: "Video recording guide" }, { href: "/teleprompter-app", label: "Open the tool" }]}
    />;
}

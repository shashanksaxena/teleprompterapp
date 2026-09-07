import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Teleprompter for Video Recording",
    description: "Use an online teleprompter for video recording with adjustable speed, readable text, mirror mode, optional camera access, and browser-based practice.",
    path: "/teleprompter-for-video-recording",
    keywords: ["teleprompter for video recording", "video recording teleprompter", "online video teleprompter", "script reader for recording"]
});

export default function VideoRecordingTeleprompterPage() {
    return <ContentPage
        kicker="Video recording teleprompter"
        title="Teleprompter for video recording from script to final take"
        intro="Prepare a script, tune the reading view, rehearse, and record a clearer video without switching between a notes app and your camera workflow."
        sections={[
            { heading: "Prepare a recording-friendly script", paragraphs: ["Write short paragraphs with one idea per block. Add headings for the hook, key points, examples, recap, and call to action so you can recover quickly if you pause.", "Read the copy aloud before recording and remove phrases that feel unnatural. Spoken language is usually simpler than written marketing copy."] },
            { heading: "Tune speed, size, and mirror mode", paragraphs: ["Choose a font size that stays readable from your recording position, then start with a slower speed than your silent reading pace. Use mirror mode only when your physical teleprompter setup needs reversed text.", "Record a short test to check eye-line, audio, framing, and whether the prompt is easy to follow before making the full take."] },
            { heading: "Review and download your take", paragraphs: ["The browser recording stage lets you practice and review without changing tools. Camera access is optional for reading, and the first three authenticated downloads are free.", "When your take is ready, use the download control for the supported video or camera-off audio format."] }
        ]}
        faqs={[{ question: "Can I record video with an online teleprompter?", answer: "Yes. FreeTeleprompter.in provides a browser-based recording workflow with optional camera and microphone access." }, { question: "Can I rehearse before recording?", answer: "Yes. Camera permission is not required to read or rehearse the script." }]}
        relatedLinks={[{ href: "/free-teleprompter", label: "Free teleprompter" }, { href: "/teleprompter-for-youtube", label: "YouTube teleprompter" }, { href: "/how-to-use", label: "How to use" }]}
    />;
}

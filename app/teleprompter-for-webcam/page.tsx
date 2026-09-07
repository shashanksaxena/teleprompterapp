import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Teleprompter for Webcam Videos",
    description: "Use a browser teleprompter beside your webcam for YouTube, meetings, online teaching, interviews, and professional video recording.",
    path: "/teleprompter-for-webcam",
    keywords: ["teleprompter for webcam", "webcam teleprompter", "webcam script reader", "online webcam teleprompter"]
});

export default function WebcamTeleprompterPage() {
    return <ContentPage
        kicker="Webcam teleprompter"
        title="Teleprompter for webcam videos with natural eye contact"
        intro="Keep your script close to the webcam lens so you can speak clearly without memorizing every line or looking far away from the audience."
        sections={[
            { heading: "Place the prompt near the lens", paragraphs: ["The closer your script is to the webcam, the more natural your eye-line looks. Put the browser window near the top center of the screen and raise the laptop if the camera sits too low.", "Use a narrow text column so your eyes do not travel across the full display. Larger text is usually easier when you are sitting farther from the webcam."] },
            { heading: "Use a slower webcam recording pace", paragraphs: ["Speaking aloud takes longer than silently reading. Begin with a slower scroll speed, record a short test, and increase it only if you consistently finish each line early.", "For meetings and interviews, write prompts and reminders rather than a full speech so you can listen and respond naturally."] },
            { heading: "Record without forcing camera access", paragraphs: ["You can rehearse with the webcam teleprompter before enabling the camera. When you are ready, allow camera and microphone access for a recording take.", "Open the teleprompter tool to paste your script and tune the view for your webcam position."] }
        ]}
        faqs={[{ question: "Can I use a webcam teleprompter for Zoom?", answer: "Yes. Use short talking-point prompts near the webcam and pause the scroll while listening to other participants." }, { question: "What if my webcam is built into a laptop?", answer: "Place the prompt near the top of the screen and raise the laptop so the webcam is close to eye level." }]}
        relatedLinks={[{ href: "/teleprompter-for-video-recording", label: "Video recording guide" }, { href: "/free-teleprompter", label: "Free teleprompter" }, { href: "/teleprompter-app", label: "Open the tool" }]}
    />;
}

import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
    title: "Teleprompter for Presentations and Public Speaking",
    description: "Use an online teleprompter for presentations, speeches, webinars, and public speaking with readable prompts and natural eye contact.",
    path: "/teleprompter-for-presentations",
    keywords: ["teleprompter for presentations", "presentation teleprompter", "speech teleprompter", "public speaking teleprompter"]
});

export default function PresentationTeleprompterPage() {
    return <ContentPage
        kicker="Presentation teleprompter"
        title="Teleprompter for presentations, speeches, and webinars"
        intro="Keep your structure visible while presenting with confidence. Use short prompts for key points, transitions, examples, and your closing message."
        sections={[
            { heading: "Write prompts, not a wall of text", paragraphs: ["Presentation prompts should help you remember the next idea without pulling your attention away from the audience. Use headings, short phrases, numbers, and transition lines.", "Keep definitions and quotes concise so you can look up, explain them, and continue without chasing a fast-moving paragraph."] },
            { heading: "Practice timing and audience pauses", paragraphs: ["Run through the presentation aloud and mark places for questions, demonstrations, or applause. A teleprompter supports timing but should not remove space for the audience to react.", "Use a slower pace for important numbers and a clear cue before changing slides or showing a demo."] },
            { heading: "Use the browser tool before the event", paragraphs: ["Paste the script, adjust text size and speed, and rehearse with the same screen position you will use during the presentation. Camera access is optional.", "Open the teleprompter when you are ready to run the final practice or recording."] }
        ]}
        faqs={[{ question: "Can I use a teleprompter for a live presentation?", answer: "Yes. Use concise prompts and place the screen near your camera or audience line so the tool supports rather than replaces audience connection." }, { question: "Should a presentation teleprompter show every word?", answer: "Usually not. Short cues and transition lines often sound more natural than reading a complete essay." }]}
        relatedLinks={[{ href: "/teleprompter-tips", label: "Teleprompter tips" }, { href: "/free-teleprompter", label: "Free teleprompter" }, { href: "/teleprompter-app", label: "Open the tool" }]}
    />;
}

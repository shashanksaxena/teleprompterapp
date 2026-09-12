import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CreatorTool } from "@/components/creator-tool";

type ToolKey = "script-timer" | "word-counter" | "speed-calculator" | "script-formatter" | "script-generator";

const tools: Record<ToolKey, { title: string; description: string; keywords: string[] }> = {
    "script-timer": {
        title: "Free Script Timer for Video Creators",
        description: "Use this free script timer to estimate YouTube, Instagram Reel, presentation, lesson, and talking-head video length from your word count.",
        keywords: ["script timer", "video script timer", "YouTube script timer", "teleprompter timer"]
    },
    "word-counter": {
        title: "Free Video Script Word Counter",
        description: "Count words, characters, sentences, and estimated speaking time for YouTube, Instagram, Reel, podcast, and presentation scripts.",
        keywords: ["script word counter", "video word counter", "YouTube script word count", "Reel script word counter"]
    },
    "speed-calculator": {
        title: "Teleprompter Speed Calculator",
        description: "Calculate speaking words per minute and find a practical starting scroll speed for your teleprompter recording.",
        keywords: ["teleprompter speed calculator", "speaking speed calculator", "words per minute calculator", "script pace calculator"]
    },
    "script-formatter": {
        title: "Free Teleprompter Script Formatter",
        description: "Format a dense video script into clear speaking blocks with natural pauses and readable paragraph breaks for teleprompter recording.",
        keywords: ["script formatter", "teleprompter script formatter", "format video script", "script paragraph formatter"]
    },
    "script-generator": {
        title: "Free Video Script Generator",
        description: "Generate a practical first-draft video script with a hook, context, talking points, and call to action for your next recording.",
        keywords: ["video script generator", "YouTube script generator", "Reel script generator", "free creator script generator"]
    }
};

export function generateStaticParams() {
    return Object.keys(tools).map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
    const { tool } = await params;
    const content = tools[tool as ToolKey];
    if (!content) return {};
    return { title: content.title, description: content.description, keywords: content.keywords, alternates: { canonical: `/creator-tools/${tool}` } };
}

export default async function CreatorToolPage({ params }: { params: Promise<{ tool: string }> }) {
    const { tool } = await params;
    if (!tools[tool as ToolKey]) notFound();
    return <CreatorTool tool={tool as ToolKey} />;
}

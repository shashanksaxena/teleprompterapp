"use client";

import { useEffect, useState } from "react";
import { Calculator, Check, Clock3, Copy, FileText, Gauge, WandSparkles } from "lucide-react";

type ToolKey = "script-timer" | "word-counter" | "speed-calculator" | "script-formatter" | "script-generator";

type CreatorToolProps = {
    tool: ToolKey;
};

const toolContent: Record<ToolKey, { title: string; eyebrow: string; description: string }> = {
    "script-timer": {
        title: "Script Timer",
        eyebrow: "Creator timing tool",
        description: "Estimate how long your script will take to speak and practice a recording pace that feels natural."
    },
    "word-counter": {
        title: "Word Counter",
        eyebrow: "Creator writing tool",
        description: "Count words, characters, sentences, and estimated speaking time before you record your next video."
    },
    "speed-calculator": {
        title: "Speed Calculator",
        eyebrow: "Creator pacing tool",
        description: "Calculate the speaking words per minute your script needs and translate it into a practical teleprompter pace."
    },
    "script-formatter": {
        title: "Script Formatter",
        eyebrow: "Creator editing tool",
        description: "Turn a dense draft into short, readable speaking blocks designed for teleprompter delivery."
    },
    "script-generator": {
        title: "Script Generator",
        eyebrow: "Creator planning tool",
        description: "Generate a structured first draft for a YouTube video, Instagram Reel, lesson, or talking-head update."
    }
};

function wordsOf(text: string) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.round(seconds % 60);
    return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function ToolHeader({ tool }: { tool: ToolKey }) {
    const content = toolContent[tool];
    return (
        <header className="glass-panel rounded-[22px] p-5 md:p-7">
            <p className="section-kicker">{content.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{content.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-soft)] md:text-base">{content.description}</p>
        </header>
    );
}

function ToolFrame({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon: typeof Clock3 }) {
    return (
        <section className="creator-tool-frame">
            <div className="creator-tool-frame-heading">
                <span className="creator-tool-icon"><Icon className="h-5 w-5" /></span>
                <div>
                    <p className="section-kicker">Interactive workspace</p>
                    <h2 className="text-xl font-semibold">{title}</h2>
                </div>
            </div>
            {children}
        </section>
    );
}

function Field({ label, value, onChange, type = "text", min, max, step, suffix }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: number; max?: number; step?: number; suffix?: string }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{label}</span>
            <div className="relative">
                <input type={type} min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} className="control-input w-full" />
                {suffix ? <span className="pointer-events-none absolute right-3 top-3 text-sm text-[var(--text-soft)]">{suffix}</span> : null}
            </div>
        </label>
    );
}

function ScriptTimer() {
    const [script, setScript] = useState("");
    const [wpm, setWpm] = useState("130");
    const [isRunning, setIsRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const wordCount = wordsOf(script);
    const seconds = wordCount ? (wordCount / Math.max(1, Number(wpm))) * 60 : 0;
    useEffect(() => {
        if (!isRunning || seconds <= 0) return;
        const timer = window.setInterval(() => {
            setElapsed((current) => {
                if (current + 1 >= seconds) {
                    setIsRunning(false);
                    return Math.ceil(seconds);
                }
                return current + 1;
            });
        }, 1000);
        return () => window.clearInterval(timer);
    }, [isRunning, seconds]);

    const toggleTimer = () => {
        if (!wordCount) return;
        if (elapsed >= seconds) setElapsed(0);
        setIsRunning((current) => !current);
    };

    return (
        <>
            <ToolHeader tool="script-timer" />
            <ToolFrame title="Time your script" icon={Clock3}>
                <div className="grid gap-5 lg:grid-cols-[1fr_0.42fr]">
                    <textarea value={script} onChange={(event) => setScript(event.target.value)} placeholder="Paste your script to estimate recording time..." className="creator-tool-textarea min-h-64" />
                    <div className="space-y-4">
                        <Field label="Speaking speed" value={wpm} onChange={setWpm} type="number" min={40} max={260} suffix="WPM" />
                        <div className="creator-result-card"><span>{isRunning ? "Practice timer running" : "Estimated duration"}</span><strong>{formatSeconds(Math.max(0, seconds - elapsed))}</strong><small>{wordCount} words at {wpm || 0} words per minute</small></div>
                        <button type="button" onClick={toggleTimer} disabled={!wordCount} className="cta-primary w-full disabled:cursor-not-allowed disabled:opacity-50">{isRunning ? "Pause practice timer" : elapsed >= seconds && seconds > 0 ? "Restart practice timer" : "Start practice timer"}</button>
                    </div>
                </div>
            </ToolFrame>
        </>
    );
}

function WordCounter() {
    const [text, setText] = useState("");
    const words = wordsOf(text);
    const characters = text.length;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    return (
        <>
            <ToolHeader tool="word-counter" />
            <ToolFrame title="Measure your draft" icon={FileText}>
                <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste your YouTube, Reel, lesson, or presentation script..." className="creator-tool-textarea min-h-72" />
                <div className="creator-stat-grid mt-5">
                    {[[words, "Words"], [characters, "Characters"], [sentences, "Sentences"], [formatSeconds(words / 130 * 60), "At 130 WPM"]].map(([value, label]) => <div key={label} className="creator-stat"><strong>{value}</strong><span>{label}</span></div>)}
                </div>
            </ToolFrame>
        </>
    );
}

function SpeedCalculator() {
    const [words, setWords] = useState("150");
    const [minutes, setMinutes] = useState("1");
    const wpm = Math.round(Number(words || 0) / Math.max(0.1, Number(minutes || 0)));
    const teleprompterSpeed = Math.max(10, Math.min(120, Math.round(wpm * 0.28)));
    return (
        <>
            <ToolHeader tool="speed-calculator" />
            <ToolFrame title="Find your speaking pace" icon={Gauge}>
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Script words" value={words} onChange={setWords} type="number" min={1} suffix="words" />
                    <Field label="Target duration" value={minutes} onChange={setMinutes} type="number" min={0.1} step={0.1} suffix="min" />
                </div>
                <div className="creator-result-card creator-result-card-large mt-5"><span>Recommended speaking speed</span><strong>{wpm || 0} WPM</strong><small>Start your teleprompter around {teleprompterSpeed}px/s, then adjust after a short test take.</small></div>
            </ToolFrame>
        </>
    );
}

function ScriptFormatter() {
    const [text, setText] = useState("");
    const [formatted, setFormatted] = useState("");
    const formatScript = () => {
        const result = text.replace(/\s+/g, " ").trim().replace(/([.!?])\s+/g, "$1\n\n");
        setFormatted(result);
    };
    return (
        <>
            <ToolHeader tool="script-formatter" />
            <ToolFrame title="Create readable speaking blocks" icon={FileText}>
                <div className="grid gap-5 lg:grid-cols-2">
                    <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste a dense script draft..." className="creator-tool-textarea min-h-72" />
                    <textarea readOnly value={formatted} placeholder="Your formatted script will appear here..." className="creator-tool-textarea min-h-72" />
                </div>
                <button type="button" onClick={formatScript} className="cta-primary mt-5"><WandSparkles className="h-4 w-4" /> Format script</button>
            </ToolFrame>
        </>
    );
}

function ScriptGenerator() {
    const [topic, setTopic] = useState("");
    const [audience, setAudience] = useState("creators");
    const [tone, setTone] = useState("conversational");
    const [result, setResult] = useState("");
    const generate = () => setResult(`HOOK\nHave you ever struggled with ${topic || "this problem"}?\n\nCONTEXT\nIn this video, I will show ${audience} a practical way to get a better result without overcomplicating the process.\n\nMAIN POINTS\n1. Start with one clear goal.\n2. Use a simple repeatable workflow.\n3. Review the result and improve the next attempt.\n\nCTA\nTry this approach today and follow for more creator tips.`);
    return (
        <>
            <ToolHeader tool="script-generator" />
            <ToolFrame title="Build a first draft" icon={WandSparkles}>
                <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Video topic" value={topic} onChange={setTopic} />
                    <label><span className="mb-1.5 block text-sm font-semibold">Audience</span><select value={audience} onChange={(event) => setAudience(event.target.value)} className="control-input w-full"><option>creators</option><option>business owners</option><option>students</option><option>teachers</option></select></label>
                    <label><span className="mb-1.5 block text-sm font-semibold">Tone</span><select value={tone} onChange={(event) => setTone(event.target.value)} className="control-input w-full"><option>conversational</option><option>educational</option><option>energetic</option><option>professional</option></select></label>
                </div>
                <button type="button" onClick={generate} className="cta-primary mt-5"><WandSparkles className="h-4 w-4" /> Generate {tone} draft</button>
                <textarea readOnly value={result} placeholder="Your hook, points, and call to action will appear here..." className="creator-tool-textarea mt-5 min-h-80" />
                {result ? <p className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-600"><Check className="h-4 w-4" /> Draft ready to refine in the teleprompter.</p> : null}
            </ToolFrame>
        </>
    );
}

export function CreatorTool({ tool }: CreatorToolProps) {
    return <main className="creator-tools-page">{tool === "script-timer" ? <ScriptTimer /> : null}{tool === "word-counter" ? <WordCounter /> : null}{tool === "speed-calculator" ? <SpeedCalculator /> : null}{tool === "script-formatter" ? <ScriptFormatter /> : null}{tool === "script-generator" ? <ScriptGenerator /> : null}</main>;
}

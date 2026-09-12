"use client";

import { Camera, Check, Mic2, Play, ScrollText } from "lucide-react";
import { useState } from "react";

const modes = [
    { label: "Script", icon: ScrollText, value: "Read naturally" },
    { label: "Camera", icon: Camera, value: "Frame your shot" },
    { label: "Voice", icon: Mic2, value: "Follow your pace" }
] as const;

export function HeroStudio() {
    const [activeMode, setActiveMode] = useState<(typeof modes)[number]["label"]>("Script");
    const active = modes.find((mode) => mode.label === activeMode) ?? modes[0];
    const ActiveIcon = active.icon;

    return (
        <div className="hero-studio" aria-label="Interactive teleprompter preview">
            <div className="hero-studio-topline">
                <span className="hero-live-dot" />
                Studio preview
                <span className="hero-studio-status">Ready</span>
            </div>

            <div className="hero-studio-screen">
                <div className="hero-studio-screenbar">
                    <span className="hero-studio-window-dot" />
                    <span className="hero-studio-window-dot" />
                    <span className="hero-studio-window-dot" />
                    <span className="hero-studio-screen-label">freeteleprompter.in</span>
                </div>
                <div className="hero-script-lines" aria-hidden="true">
                    <span className="hero-script-line hero-script-line-long" />
                    <span className="hero-script-line hero-script-line-medium" />
                    <span className="hero-script-line hero-script-line-short" />
                    <span className="hero-script-line hero-script-line-long" />
                    <span className="hero-script-line hero-script-line-medium" />
                </div>
                <div className="hero-script-cursor" aria-hidden="true" />
                <div className="hero-studio-caption">
                    <span className="hero-studio-mode-icon"><ActiveIcon className="h-4 w-4" /></span>
                    <span>{active.value}</span>
                    <span className="hero-studio-caption-check"><Check className="h-3.5 w-3.5" /></span>
                </div>
            </div>

            <div className="hero-studio-controls">
                {modes.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => setActiveMode(label)}
                        className={`hero-mode-button ${activeMode === label ? "is-active" : ""}`}
                        aria-pressed={activeMode === label}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </button>
                ))}
                <a href="#app-tools" className="hero-studio-play" aria-label="Open teleprompter tool">
                    <Play className="h-4 w-4 fill-current" />
                </a>
            </div>
            <div className="hero-studio-progress"><span /></div>
        </div>
    );
}
"use client";

import { Camera, Maximize2, Minimize2, MoonStar, MoveHorizontal, SunMedium } from "lucide-react";

import { AppSettings } from "@/lib/types";

type SettingsPanelProps = {
  settings: AppSettings;
  onSettingsChange: (patch: Partial<AppSettings>) => void;
  onToggleFullscreen: () => void;
  embedded?: boolean;
};

export function SettingsPanel({
  settings,
  onSettingsChange,
  onToggleFullscreen,
  embedded = false
}: SettingsPanelProps) {
  return (
    <section className={embedded ? "rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] p-3 md:p-4" : "glass-panel rounded-[16px] p-3 md:p-4"}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="section-kicker">Prompt controls</h2>

        <div className="inline-flex rounded-md border border-[var(--border)] bg-[var(--surface-strong)] p-1">
          <button
            type="button"
            onClick={() => onSettingsChange({ theme: "light" })}
            className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
              settings.theme === "light" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-soft)]"
            }`}
          >
            <SunMedium className="h-4 w-4" />
            Light
          </button>
          <button
            type="button"
            onClick={() => onSettingsChange({ theme: "dark" })}
            className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-sm ${
              settings.theme === "dark" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-soft)]"
            }`}
          >
            <MoonStar className="h-4 w-4" />
            Dark
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_auto_auto_auto] xl:items-end">
        <label className="block">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Speed</span>
            <span className="text-[var(--text-soft)]">{settings.speed}px/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={1}
            value={settings.speed}
            onChange={(event) => onSettingsChange({ speed: Number(event.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Text size</span>
            <span className="text-[var(--text-soft)]">{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min={24}
            max={72}
            step={1}
            value={settings.fontSize}
            onChange={(event) => onSettingsChange({ fontSize: Number(event.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </label>

        <button
          type="button"
          onClick={() => onSettingsChange({ mirrorMode: !settings.mirrorMode })}
          className="control-chip flex items-center justify-center gap-2"
        >
          <MoveHorizontal className="h-4 w-4" />
          {settings.mirrorMode ? "Mirror on" : "Mirror"}
        </button>
        <button
          type="button"
          onClick={() => onSettingsChange({ mirrorCamera: !settings.mirrorCamera })}
          className="control-chip flex items-center justify-center gap-2"
        >
          <Camera className="h-4 w-4" />
          {settings.mirrorCamera ? "Camera mirror" : "Camera normal"}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="control-chip flex items-center justify-center gap-2"
        >
          {settings.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {settings.isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>
    </section>
  );
}

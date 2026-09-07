"use client";

import { Camera, Maximize2, Minimize2, MoveHorizontal } from "lucide-react";

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
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(120px,1fr)_minmax(120px,1fr)_auto_auto_auto] xl:items-end">
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
          className="control-chip flex items-center justify-center gap-2 whitespace-nowrap px-3"
        >
          <MoveHorizontal className="h-4 w-4" />
          {settings.mirrorMode ? "Mirror on" : "Mirror"}
        </button>
        <button
          type="button"
          onClick={() => onSettingsChange({ mirrorCamera: !settings.mirrorCamera })}
          className="control-chip flex items-center justify-center gap-2 whitespace-nowrap px-3"
        >
          <Camera className="h-4 w-4" />
          {settings.mirrorCamera ? "Camera mirror" : "Camera normal"}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="control-chip flex items-center justify-center gap-2 whitespace-nowrap px-3"
        >
          {settings.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          {settings.isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>
    </section>
  );
}

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
    <section className={embedded ? "min-w-0 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] p-2" : "glass-panel min-w-0 overflow-hidden rounded-[16px] p-3 md:p-4"}>
      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(120px,1fr)_minmax(120px,1fr)_auto_auto_auto] xl:items-end">
        <label className="block min-w-0 xl:col-span-1">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--text-soft)]">
            <span>Speed</span>
            <span>{settings.speed}px/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={1}
            value={settings.speed}
            onChange={(event) => onSettingsChange({ speed: Number(event.target.value) })}
            className="block w-full max-w-full accent-[var(--accent)]"
          />
        </label>

        <label className="block min-w-0 xl:col-span-1">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--text-soft)]">
            <span>Size</span>
            <span>{settings.fontSize}px</span>
          </div>
          <input
            type="range"
            min={24}
            max={72}
            step={1}
            value={settings.fontSize}
            onChange={(event) => onSettingsChange({ fontSize: Number(event.target.value) })}
            className="block w-full max-w-full accent-[var(--accent)]"
          />
        </label>

        <button
          type="button"
          title={settings.mirrorMode ? "Mirror on" : "Mirror off"}
          aria-label={settings.mirrorMode ? "Turn off mirrored text" : "Turn on mirrored text"}
          onClick={() => onSettingsChange({ mirrorMode: !settings.mirrorMode })}
          className="control-chip inline-flex h-10 min-w-10 items-center justify-center touch-manipulation"
        >
          <MoveHorizontal className="h-4 w-4" />
        </button>
        <button
          type="button"
          title={settings.mirrorCamera ? "Camera mirrored" : "Camera normal"}
          aria-label={settings.mirrorCamera ? "Turn off camera mirror" : "Turn on camera mirror"}
          onClick={() => onSettingsChange({ mirrorCamera: !settings.mirrorCamera })}
          className="control-chip inline-flex h-10 min-w-10 items-center justify-center touch-manipulation"
        >
          <Camera className="h-4 w-4" />
        </button>
        <button
          type="button"
          title={settings.isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          aria-label={settings.isFullscreen ? "Exit fullscreen" : "Open fullscreen"}
          onClick={onToggleFullscreen}
          className="control-chip inline-flex h-10 min-w-10 items-center justify-center touch-manipulation"
        >
          {settings.isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </section>
  );
}

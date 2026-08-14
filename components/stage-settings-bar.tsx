"use client";

import { Camera, FlipHorizontal, Gauge, RotateCcw } from "lucide-react";

type StageSettingsBarProps = {
  speed: number;
  mirrorMode: boolean;
  mirrorCamera: boolean;
  onSpeedChange: (speed: number) => void;
  onToggleMirrorMode: () => void;
  onToggleMirrorCamera: () => void;
  onRestart: () => void;
};

export function StageSettingsBar({
  speed,
  mirrorMode,
  mirrorCamera,
  onSpeedChange,
  onToggleMirrorMode,
  onToggleMirrorCamera,
  onRestart
}: StageSettingsBarProps) {
  return (
    <div className="pointer-events-auto absolute right-4 top-20 z-20 md:right-8 md:top-24">
      <div className="flex w-[84px] flex-col items-center gap-3 rounded-[24px] border border-white/15 bg-black/45 p-3 text-white shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            <Gauge className="h-4 w-4" />
          </span>
          <input
            type="range"
            min={10}
            max={120}
            step={1}
            value={speed}
            onChange={(event) => onSpeedChange(Number(event.target.value))}
            className="h-36 w-4 cursor-pointer accent-white [writing-mode:bt-lr] md:h-44"
            aria-label="Scroll speed"
          />
          <span className="text-xs text-white/75">{speed}px/s</span>
        </div>

        <button
          type="button"
          onClick={onToggleMirrorMode}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/8 transition hover:bg-white/12"
          aria-label={mirrorMode ? "Disable text mirror mode" : "Enable text mirror mode"}
          title={mirrorMode ? "Text mirrored" : "Mirror text"}
        >
          <FlipHorizontal className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleMirrorCamera}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/8 transition hover:bg-white/12"
          aria-label={mirrorCamera ? "Disable camera mirror" : "Enable camera mirror"}
          title={mirrorCamera ? "Camera mirrored" : "Mirror camera"}
        >
          <Camera className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/8 transition hover:bg-white/12"
          aria-label="Restart teleprompter from top"
          title="Restart"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

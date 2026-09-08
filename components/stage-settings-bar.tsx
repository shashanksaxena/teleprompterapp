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
    <div className="pointer-events-auto absolute inset-x-2 bottom-28 z-20 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-20 md:right-8 md:top-24">
      <div className="flex w-full items-center justify-between gap-2 rounded-[18px] border border-white/15 bg-black/65 p-2 text-white shadow-[0_16px_50px_rgba(0,0,0,0.35)] sm:w-[84px] sm:flex-col sm:gap-3 sm:rounded-[24px] sm:p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-col sm:items-center">
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
            className="h-7 min-w-0 flex-1 cursor-pointer accent-white sm:h-36 sm:w-4 sm:flex-none [writing-mode:bt-lr] md:h-44"
            aria-label="Scroll speed"
          />
          <span className="w-12 text-right text-[10px] text-white/75 sm:w-auto sm:text-xs">{speed}px/s</span>
        </div>

        <button
          type="button"
          onClick={onToggleMirrorMode}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/8 transition hover:bg-white/12 sm:h-11 sm:w-11"
          aria-label={mirrorMode ? "Disable text mirror mode" : "Enable text mirror mode"}
          title={mirrorMode ? "Text mirrored" : "Mirror text"}
        >
          <FlipHorizontal className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleMirrorCamera}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/8 transition hover:bg-white/12 sm:h-11 sm:w-11"
          aria-label={mirrorCamera ? "Disable camera mirror" : "Enable camera mirror"}
          title={mirrorCamera ? "Camera mirrored" : "Mirror camera"}
        >
          <Camera className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/8 transition hover:bg-white/12 sm:h-11 sm:w-11"
          aria-label="Restart teleprompter from top"
          title="Restart"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

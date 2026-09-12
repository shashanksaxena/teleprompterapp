"use client";

import { useRef } from "react";
import { Download, Mic, Pause, Play, RotateCcw, Square } from "lucide-react";

import { TeleprompterMetrics } from "@/lib/types";

type ControlBarProps = {
  metrics: TeleprompterMetrics;
  onTogglePlay: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
  onRestart?: () => void;
  onDownload: () => void;
  canDownload: boolean;
  className?: string;
  embedded?: boolean;
};

export function ControlBar({
  metrics,
  onTogglePlay,
  onStop,
  onToggleVoice,
  onRestart,
  onDownload,
  canDownload,
  className,
  embedded = false
}: ControlBarProps) {
  const lastTapRef = useRef<number>(0);

  const runOnce = (action: () => void) => {
    const now = Date.now();
    if (now - lastTapRef.current < 450) {
      return;
    }

    lastTapRef.current = now;
    action();
  };

  const handleTogglePlay = () => {
    runOnce(onTogglePlay);
  };

  const handleStop = () => {
    runOnce(onStop);
  };

  const handleToggleVoice = () => {
    runOnce(onToggleVoice);
  };

  const handleDownload = () => {
    runOnce(onDownload);
  };

  const handleAction = (action: () => void) => (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    action();
  };

  return (
    <div
      className={
        className ??
        (embedded ? "rounded-[14px] border border-[var(--border)] bg-[var(--surface-strong)] p-3" : "glass-panel sticky bottom-3 z-20 rounded-[14px] p-3")
      }
    >
      <div className="flex flex-col gap-2.5">
        <div className={embedded ? "flex flex-wrap items-center justify-between gap-1.5" : "flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1"}>
          <button
            type="button"
            onPointerDown={handleAction(handleTogglePlay)}
            aria-label={metrics.isPlaying ? "Pause recording" : "Play recording"}
            title={metrics.isPlaying ? "Pause" : "Play"}
            className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_12px_26px_rgba(59,130,246,0.26)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(59,130,246,0.3)] active:scale-[0.98] touch-manipulation"
          >
            {metrics.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onPointerDown={handleAction(handleStop)}
            aria-label="Stop recording"
            title="Stop"
            className="control-chip inline-flex h-10 min-w-10 shrink-0 items-center justify-center touch-manipulation"
          >
            <Square className="h-4 w-4" />
          </button>

          {onRestart ? (
            <button
              type="button"
              onPointerDown={handleAction(() => runOnce(onRestart))}
              aria-label="Restart from beginning"
              title="Retake"
              className="control-chip inline-flex h-10 min-w-10 shrink-0 items-center justify-center touch-manipulation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : null}

          <button
            type="button"
            onPointerDown={handleAction(handleToggleVoice)}
            aria-label={metrics.voiceEnabled ? "Disable voice scroll" : "Enable voice scroll"}
            title={metrics.voiceEnabled ? "Voice on" : "Voice scroll"}
            className="control-chip inline-flex h-10 min-w-10 shrink-0 items-center justify-center touch-manipulation"
          >
            <Mic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onPointerDown={handleAction(handleDownload)}
            aria-label="Download current recording"
            title="Download reel"
            disabled={!canDownload}
            className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_10px_24px_rgba(59,130,246,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(59,130,246,0.28)] disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.12em] text-[var(--text-soft)]">
          <span>{Math.round(metrics.progress * 100)}% read</span>
          <span>{metrics.voiceSupported ? (metrics.voiceListening ? "Voice live" : "Voice ready") : "Manual"}</span>
          <span>{metrics.recorderSupported ? (metrics.isRecording ? "Recording" : "Ready") : "No camera"}</span>
        </div>
      </div>

      {metrics.voiceError ? (
        <p className="mt-3 text-sm text-rose-400">{metrics.voiceError}</p>
      ) : null}
      {metrics.recorderError ? <p className="mt-2 text-sm text-rose-400">{metrics.recorderError}</p> : null}
    </div>
  );
}

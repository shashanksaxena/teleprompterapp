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
    if (now - lastTapRef.current < 300) {
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

  const pressAction = (action: () => void) => (event: React.MouseEvent | React.TouchEvent) => {
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
      <div className="flex flex-col gap-3">
        <div className={embedded ? "flex flex-wrap items-center gap-2 pb-1" : "flex flex-nowrap items-center gap-2 overflow-x-auto pb-1"}>
          <button
            type="button"
            onMouseDown={pressAction(handleTogglePlay)}
            onTouchStart={pressAction(handleTogglePlay)}
            className="inline-flex min-w-0 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_14px_28px_rgba(59,130,246,0.24)] transition hover:opacity-95 active:scale-[0.99]"
          >
            {metrics.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {metrics.isPlaying ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onMouseDown={pressAction(handleStop)}
            onTouchStart={pressAction(handleStop)}
            className="control-chip inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </button>

          {onRestart ? (
            <button
              type="button"
              onMouseDown={pressAction(() => runOnce(onRestart))}
              onTouchStart={pressAction(() => runOnce(onRestart))}
              className="control-chip inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </button>
          ) : null}

          <button
            type="button"
            onMouseDown={pressAction(handleToggleVoice)}
            onTouchStart={pressAction(handleToggleVoice)}
            className="control-chip inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2"
          >
            <Mic className="h-4 w-4" />
            {metrics.voiceEnabled ? "Voice on" : "Voice scroll"}
          </button>

          <button
            type="button"
            onMouseDown={pressAction(handleDownload)}
            onTouchStart={pressAction(handleDownload)}
            disabled={!canDownload}
            className="control-chip inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download reel
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-soft)]">
          <span>{Math.round(metrics.progress * 100)}% read</span>
          <span>Space = play / pause</span>
          <span>
            {metrics.voiceChecking
              ? "Checking voice access"
              : metrics.voiceSupported
                ? metrics.voiceListening
                  ? "Voice listening"
                  : "Voice ready"
                : "Manual scroll ready"}
          </span>
          <span>
            {metrics.recorderSupported
              ? metrics.isRecording
                ? "Recording live"
                : "Recorder ready"
              : "Recorder unsupported"}
          </span>
        </div>
      </div>

      {metrics.voiceError ? (
        <p className="mt-3 text-sm text-rose-400">{metrics.voiceError}</p>
      ) : null}
      {metrics.recorderError ? <p className="mt-2 text-sm text-rose-400">{metrics.recorderError}</p> : null}
    </div>
  );
}

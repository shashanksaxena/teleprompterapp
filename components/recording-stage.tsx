"use client";

import { RefObject, useEffect, useRef } from "react";
import { Play } from "lucide-react";

import { ControlBar } from "@/components/control-bar";
import { StageSettingsBar } from "@/components/stage-settings-bar";
import { TeleprompterMetrics } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";

type RecordingStageProps = {
  stageRef: RefObject<HTMLDivElement | null>;
  viewportRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  liveStream: MediaStream | null;
  recordingUrl: string | null;
  script: string;
  fontSize: number;
  mirrorMode: boolean;
  mirrorCamera: boolean;
  speed: number;
  hasStarted: boolean;
  isRecording: boolean;
  elapsedSeconds: number;
  offset: number;
  metrics: TeleprompterMetrics;
  onReady?: () => void;
  onSpeedChange: (speed: number) => void;
  onToggleMirrorMode: () => void;
  onToggleMirrorCamera: () => void;
  onRestart: () => void;
  onTogglePlay: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
  onDownload: () => void;
  canDownload: boolean;
};

export function RecordingStage({
  stageRef,
  viewportRef,
  contentRef,
  liveStream,
  recordingUrl,
  script,
  fontSize,
  mirrorMode,
  mirrorCamera,
  speed,
  hasStarted,
  isRecording,
  elapsedSeconds,
  offset,
  metrics,
  onReady,
  onSpeedChange,
  onToggleMirrorMode,
  onToggleMirrorCamera,
  onRestart,
  onTogglePlay,
  onStop,
  onToggleVoice,
  onDownload,
  canDownload
}: RecordingStageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }

    if (liveStream) {
      node.srcObject = liveStream;
      return;
    }

    node.srcObject = null;
  }, [liveStream]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 z-50 flex min-h-screen flex-col overflow-hidden bg-black text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        {liveStream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={cn("stage-video h-full w-full object-cover", mirrorCamera && "mirror-text")}
          />
        ) : recordingUrl ? (
          <video src={recordingUrl} autoPlay muted loop playsInline className="stage-video h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-neutral-950" />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="pointer-events-none relative flex-1 px-3 pb-44 pt-16 sm:px-4 sm:pb-40 sm:pt-20 md:px-8 md:pb-36 md:pt-12">
        <div
          ref={viewportRef}
          className="mx-auto h-full w-full max-w-5xl overflow-hidden rounded-[20px] bg-black/10 px-3 py-[15vh] sm:rounded-[28px] sm:px-4 sm:py-[18vh] md:px-10"
        >
          <div
            ref={contentRef}
            style={{ transform: `translate3d(0, -${offset}px, 0)` }}
            className="mx-auto max-w-4xl will-change-transform"
          >
            <p
              style={{ fontSize: `${fontSize}px` }}
              className={cn(
                "teleprompter-text pb-[58vh] font-medium text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]",
                mirrorMode && "mirror-text"
              )}
            >
              {script || "Your script will appear here as you type."}
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute left-3 top-4 z-10 rounded-full bg-black/55 px-2.5 py-1.5 text-xs font-semibold text-white/90 sm:left-4 sm:text-sm md:left-8 md:top-8">
        {formatDuration(elapsedSeconds)}
      </div>

      <div className="pointer-events-none absolute right-3 top-4 z-10 max-w-[48vw] truncate rounded-full bg-black/55 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:right-4 sm:text-xs md:right-8 md:top-8">
        {isRecording ? "Recording live" : "Take paused"}
      </div>

      <StageSettingsBar
        speed={speed}
        mirrorMode={mirrorMode}
        mirrorCamera={mirrorCamera}
        onSpeedChange={onSpeedChange}
        onToggleMirrorMode={onToggleMirrorMode}
        onToggleMirrorCamera={onToggleMirrorCamera}
        onRestart={onRestart}
      />

      {!hasStarted ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[22px] border border-white/15 bg-black/60 p-5 text-center text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:rounded-[28px] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">Ready to prompt</p>
            <h2 className="mt-3 text-2xl font-semibold">Frame your shot, set the speed, then begin.</h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Camera access is optional. Use the controls above to fine-tune the speed and layout before the script
              begins moving.
            </p>
            <button
              type="button"
              onClick={onTogglePlay}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-base font-semibold text-black transition hover:scale-[1.01]"
            >
              <Play className="h-5 w-5" />
              Start teleprompter
            </button>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:p-3 md:p-5">
        <ControlBar
          metrics={metrics}
          onTogglePlay={onTogglePlay}
          onStop={onStop}
          onRestart={onRestart}
          onToggleVoice={onToggleVoice}
          onDownload={onDownload}
          canDownload={canDownload}
          className="mx-auto w-full max-w-5xl rounded-[16px] border border-white/20 bg-black/65 p-2 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:rounded-[20px] sm:p-3 [--border:rgba(255,255,255,0.18)] [--surface-strong:rgba(255,255,255,0.08)] [--text-soft:rgba(255,255,255,0.76)]"
        />
      </div>
    </div>
  );
}

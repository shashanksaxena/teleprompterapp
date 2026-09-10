"use client";

import { useEffect, useRef } from "react";
import { Camera, Circle, Download, Music2, Video } from "lucide-react";

import { formatDuration } from "@/lib/utils";

type RecordingPanelProps = {
  id?: string;
  liveStream: MediaStream | null;
  recordingUrl: string | null;
  audioUrl: string | null;
  isRecording: boolean;
  recordingDurationSeconds: number;
  isPremium: boolean;
  onDownload: () => void;
  onDownloadAudio: () => void;
};

export function RecordingPanel({
  id,
  liveStream,
  recordingUrl,
  audioUrl,
  isRecording,
  recordingDurationSeconds,
  isPremium,
  onDownload,
  onDownloadAudio
}: RecordingPanelProps) {
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

  return (
    <section id={id} className="glass-panel scroll-mt-6 rounded-[16px] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Take preview</p>
          <h2 className="text-base font-semibold">Recorded reel</h2>
          <p className="text-sm text-[var(--text-soft)]">
            A take is created automatically while you prompt.
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-soft)]">
          {isPremium ? "Unlimited downloads" : "3 free video downloads"}
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--surface-muted)]">
        {liveStream ? (
          <video ref={videoRef} autoPlay muted playsInline className="aspect-video w-full object-cover" />
        ) : recordingUrl ? (
          <video
            key={recordingUrl}
            src={recordingUrl}
            controls
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-[var(--text-soft)]">
            <div className="text-center">
              <Camera className="mx-auto mb-2 h-6 w-6" />
              <p className="text-sm">Press play to begin a recorded take.</p>
            </div>
          </div>
        )}
      </div>

      {audioUrl ? (
        <div className="mt-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Music2 className="h-4 w-4 text-[var(--accent)]" />
            Camera-off audio track
          </div>
          <audio controls src={audioUrl} className="w-full" preload="metadata">
            Your browser does not support audio playback.
          </audio>
          <button
            type="button"
            onClick={onDownloadAudio}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-semibold transition hover:border-[var(--accent)]"
          >
            <Download className="h-4 w-4" />
            Download MP3
          </button>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
          {isRecording ? <Circle className="h-4 w-4 text-rose-500" /> : <Video className="h-4 w-4" />}
          {isRecording ? "Recording in progress" : recordingUrl ? "Recording ready" : "No recording yet"}
        </div>

        {recordingUrl ? (
          <div className="text-sm text-[var(--text-soft)]">Duration {formatDuration(recordingDurationSeconds)}</div>
        ) : null}

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!recordingUrl}
        >
          <Download className="h-4 w-4" />
          Download reel
        </button>
      </div>
    </section>
  );
}

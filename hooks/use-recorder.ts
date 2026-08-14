"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearLatestRecording, readLatestRecording, saveLatestRecording } from "@/lib/recording-cache";

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm"
  ];

  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || "";
}

export function useRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordingDurationSeconds, setRecordingDurationSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setLiveStream(null);
  }, []);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.requestData();
      recorderRef.current.stop();
      return;
    }

    clearTimer();
    cleanupStream();
    setIsRecording(false);
  }, [cleanupStream, clearTimer]);

  const start = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser does not support video recording.");
      return false;
    }

    if (isRecording) {
      return true;
    }

    try {
      setError(null);

      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(null);
      }

      void clearLatestRecording();
      setRecordingBlob(null);
      setRecordingDurationSeconds(0);
      setElapsedSeconds(0);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      const mimeType = getSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      streamRef.current = stream;
      setLiveStream(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimer();
        const durationSeconds = startTimeRef.current
          ? Math.max(1, Math.round((performance.now() - startTimeRef.current) / 1000))
          : elapsedSeconds;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "video/webm"
        });

        if (blob.size > 0) {
          const nextUrl = URL.createObjectURL(blob);
          setRecordingBlob(blob);
          setRecordingUrl(nextUrl);
          setRecordingDurationSeconds(durationSeconds);
          void saveLatestRecording(blob, durationSeconds);
        } else {
          setError("The recording finished, but the preview could not be generated on this browser.");
        }

        recorderRef.current = null;
        chunksRef.current = [];
        startTimeRef.current = null;
        cleanupStream();
        setIsRecording(false);
      };

      recorder.onerror = () => {
        setError("Recording failed on this browser.");
      };

      recorder.start(250);
      recorderRef.current = recorder;
      startTimeRef.current = performance.now();
      timerRef.current = window.setInterval(() => {
        if (!startTimeRef.current) {
          return;
        }

        setElapsedSeconds(Math.max(0, Math.floor((performance.now() - startTimeRef.current) / 1000)));
      }, 250);
      setIsRecording(true);
      return true;
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Unable to access camera and microphone.");
      cleanupStream();
      return false;
    }
  }, [cleanupStream, clearTimer, elapsedSeconds, isRecording, recordingUrl]);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && typeof MediaRecorder !== "undefined");

    let active = true;

    void readLatestRecording()
      .then((entry) => {
        if (!active || !entry || recordingBlob) {
          return;
        }

        const nextUrl = URL.createObjectURL(entry.blob);
        setRecordingBlob(entry.blob);
        setRecordingUrl(nextUrl);
        setRecordingDurationSeconds(entry.durationSeconds);
      })
      .catch(() => {
        // Ignore cache restore errors and continue with live recording support.
      });

    return () => {
      active = false;
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
      clearTimer();
      cleanupStream();
    };
  }, [cleanupStream, clearTimer, recordingBlob, recordingUrl]);

  return {
    isRecording,
    isSupported,
    liveStream,
    recordingUrl,
    recordingBlob,
    elapsedSeconds,
    recordingDurationSeconds,
    error,
    start,
    stop
  };
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mp3Encoder } from "@breezystack/lamejs";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
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

function createFallbackStream() {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;

  const context = canvas.getContext("2d");
  if (!context || typeof canvas.captureStream !== "function") {
    throw new Error("Camera-free recording is not supported by this browser.");
  }

  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, "#0f172a");
  background.addColorStop(1, "#172554");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#bfdbfe";
  context.font = "600 34px sans-serif";
  context.fillText("FreeTeleprompter.in", 72, 92);
  context.fillStyle = "#f8fafc";
  context.font = "600 54px sans-serif";
  context.fillText("Camera-off recording", 72, 190);
  context.fillStyle = "#cbd5e1";
  context.font = "28px sans-serif";
  context.fillText("Your teleprompter session is being recorded.", 72, 248);
  context.fillStyle = "#22c55e";
  context.beginPath();
  context.arc(92, 635, 10, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#e2e8f0";
  context.font = "24px sans-serif";
  context.fillText("Camera access was not enabled", 122, 643);

  return canvas.captureStream(30);
}

function encodePcmToMp3(samples: Int16Array, sampleRate: number) {
  const encoder = new Mp3Encoder(1, sampleRate, 128);
  const chunks: ArrayBuffer[] = [];
  const sampleBlockSize = 1152;

  for (let index = 0; index < samples.length; index += sampleBlockSize) {
    const block = samples.subarray(index, Math.min(index + sampleBlockSize, samples.length));
    const encoded = encoder.encodeBuffer(block);
    if (encoded.length > 0) {
      chunks.push(new Uint8Array(encoded).buffer as ArrayBuffer);
    }
  }

  const finalChunk = encoder.flush();
  if (finalChunk.length > 0) {
    chunks.push(new Uint8Array(finalChunk).buffer as ArrayBuffer);
  }

  return new Blob(chunks, { type: "audio/mpeg" });
}

async function convertAudioBlobToMp3(audioBlob: Blob) {
  const AudioContextConstructor = window.AudioContext;
  const audioContext = new AudioContextConstructor();

  try {
    const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
    const samples = audioBuffer.getChannelData(0);
    const pcm = new Int16Array(samples.length);

    for (let index = 0; index < samples.length; index += 1) {
      pcm[index] = Math.max(-1, Math.min(1, samples[index])) * 32767;
    }

    return encodePcmToMp3(pcm, audioBuffer.sampleRate);
  } finally {
    await audioContext.close();
  }
}

function createSilentMp3(durationSeconds: number) {
  const sampleRate = 44100;
  const samples = new Int16Array(Math.max(sampleRate, Math.ceil(durationSeconds * sampleRate)));
  return encodePcmToMp3(samples, sampleRate);
}

async function convertVideoToMp4(videoBlob: Blob) {
  const ffmpeg = new FFmpeg();
  const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "application/wasm")
  });
  await ffmpeg.writeFile("input.webm", await fetchFile(videoBlob));
  await ffmpeg.exec(["-i", "input.webm", "-c:v", "libx264", "-c:a", "aac", "-movflags", "faststart", "output.mp4"]);
  const output = await ffmpeg.readFile("output.mp4");
  await ffmpeg.deleteFile("input.webm");
  await ffmpeg.deleteFile("output.mp4");
  await ffmpeg.terminate();
  const outputBytes = typeof output === "string" ? new TextEncoder().encode(output) : output;
  return new Blob([outputBytes.buffer as ArrayBuffer], { type: "video/mp4" });
}

export function useRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStopPromiseRef = useRef<Promise<Blob> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
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

  const start = useCallback(async (recordImmediately = true) => {
    if (typeof window === "undefined") {
      return false;
    }

    const hasLiveMediaStream = streamRef.current?.getTracks().some((track) => track.readyState === "live") ?? false;

    if (isRecording && hasLiveMediaStream) {
      return true;
    }

    try {
      setError(null);

      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(null);
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      void clearLatestRecording();
      setRecordingBlob(null);
      setRecordingDurationSeconds(0);
      setElapsedSeconds(0);
      chunksRef.current = [];
      audioChunksRef.current = [];
      audioStopPromiseRef.current = null;

      if (typeof MediaRecorder === "undefined") {
        setError("This browser does not support recorded video.");
        return true;
      }

      let stream: MediaStream;
      let cameraOff = false;

      if (hasLiveMediaStream && streamRef.current) {
        stream = streamRef.current;
      } else if (navigator.mediaDevices?.getUserMedia) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 3840 },
              height: { ideal: 2160 },
              frameRate: { ideal: 30, max: 60 }
            },
            audio: true
          });
        } catch {
          stream = createFallbackStream();
          cameraOff = true;
          setError("Camera access was skipped. A camera-free video will be created instead.");
        }
      } else {
        stream = createFallbackStream();
        cameraOff = true;
        setError("Camera access is unavailable. A camera-free video will be created instead.");
      }

      streamRef.current = stream;
      setLiveStream(stream);

      if (!recordImmediately) {
        return true;
      }

      if (cameraOff && navigator.mediaDevices?.getUserMedia) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = audioStream.getAudioTracks()[0];
          if (audioTrack) {
            stream.addTrack(audioTrack);
          }

          const audioRecorder = new MediaRecorder(audioStream);
          audioStopPromiseRef.current = new Promise<Blob>((resolve) => {
            audioRecorder.onstop = () => {
              resolve(new Blob(audioChunksRef.current, { type: audioRecorder.mimeType || "audio/webm" }));
              audioChunksRef.current = [];
              audioRecorderRef.current = null;
            };
          });
          audioRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          audioRecorder.start(250);
          audioRecorderRef.current = audioRecorder;
        } catch {
          setError("Camera is off. A silent MP3 will be created because microphone access was not enabled.");
        }
      }

      const mimeType = getSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        clearTimer();
        const durationSeconds = startTimeRef.current
          ? Math.max(1, Math.round((performance.now() - startTimeRef.current) / 1000))
          : elapsedSeconds;
        const rawBlob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "video/webm"
        });
        const blob = rawBlob.type.includes("mp4")
          ? rawBlob
          : await convertVideoToMp4(rawBlob).catch(() => rawBlob);

        if (blob.size > 0) {
          const nextUrl = URL.createObjectURL(blob);
          setRecordingBlob(blob);
          setRecordingUrl(nextUrl);
          setRecordingDurationSeconds(durationSeconds);
          void saveLatestRecording(blob, durationSeconds);

          if (audioRecorderRef.current && audioRecorderRef.current.state !== "inactive") {
            audioRecorderRef.current.stop();
          }

          const audioBlob = audioStopPromiseRef.current ? await audioStopPromiseRef.current : null;
          const mp3Blob = audioBlob?.size ? await convertAudioBlobToMp3(audioBlob).catch(() => null) : null;
          const finalAudioBlob = mp3Blob || createSilentMp3(durationSeconds);
          const nextAudioUrl = URL.createObjectURL(finalAudioBlob);
          setAudioBlob(finalAudioBlob);
          setAudioUrl(nextAudioUrl);
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
        setError("Recording failed on this browser, but the prompt still works without live camera preview.");
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
      setError(
        startError instanceof Error
          ? "Camera access is optional. You can continue with the prompt without live preview."
          : "Camera access is optional. You can continue with the prompt without live preview."
      );
      cleanupStream();
      return true;
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
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
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
    audioUrl,
    audioBlob,
    elapsedSeconds,
    recordingDurationSeconds,
    error,
    start,
    stop,
    pause: () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.pause();
        audioRecorderRef.current?.pause();
        clearTimer();
      }
    },
    resume: () => {
      if (recorderRef.current?.state === "paused") {
        recorderRef.current.resume();
        audioRecorderRef.current?.resume();
        startTimeRef.current = performance.now() - elapsedSeconds * 1000;
        timerRef.current = window.setInterval(() => {
          if (startTimeRef.current) {
            setElapsedSeconds(Math.max(0, Math.floor((performance.now() - startTimeRef.current) / 1000)));
          }
        }, 250);
      }
    }
  };
}

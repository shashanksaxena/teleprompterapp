"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { clamp } from "@/lib/utils";

const PLAYBACK_SPEED_MULTIPLIER = 2.35;
const LOOP_INTERVAL_MS = 16;

type UseTeleprompterOptions = {
  speed: number;
};

export function useTeleprompter({ speed }: UseTeleprompterOptions) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const maxOffsetRef = useRef(0);
  const voiceDeltaRef = useRef(0);
  const voiceFrameRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const stopLoop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    lastTickRef.current = null;
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) {
      return;
    }

    const naturalOffset = Math.max(0, content.scrollHeight - viewport.clientHeight);
    const minimumTravel = viewport.clientHeight * 0.9;
    const maxOffset = Math.max(naturalOffset, minimumTravel);
    maxOffsetRef.current = maxOffset;

    setOffset((current) => {
      const next = clamp(current, 0, maxOffset);
      setProgress(maxOffset > 0 ? next / maxOffset : 0);
      return next;
    });
  }, []);

  const animateVoiceScroll = useCallback(() => {
    voiceFrameRef.current = null;
    if (voiceDeltaRef.current <= 0 || maxOffsetRef.current <= 0) {
      voiceDeltaRef.current = 0;
      return;
    }

    const step = Math.min(voiceDeltaRef.current * 0.2, 5);
    voiceDeltaRef.current -= step;
    setOffset((current) => {
      const next = clamp(current + step, 0, maxOffsetRef.current);
      setProgress(maxOffsetRef.current > 0 ? next / maxOffsetRef.current : 0);
      return next;
    });
    voiceFrameRef.current = window.requestAnimationFrame(animateVoiceScroll);
  }, []);

  const applyDelta = useCallback((delta: number) => {
    voiceDeltaRef.current = Math.min(voiceDeltaRef.current + delta, maxOffsetRef.current * 0.18);
    if (voiceFrameRef.current === null) {
      voiceFrameRef.current = window.requestAnimationFrame(animateVoiceScroll);
    }
  }, [animateVoiceScroll]);

  const tick = useCallback(() => {
    const now = performance.now();
    if (!lastTickRef.current) {
      lastTickRef.current = now;
      return;
    }

    const delta = now - lastTickRef.current;
    lastTickRef.current = now;

    if (maxOffsetRef.current <= 0) {
      return;
    }

    setOffset((current) => {
      const next = clamp(current + ((speed * PLAYBACK_SPEED_MULTIPLIER) / 1000) * delta, 0, maxOffsetRef.current);
      setProgress(maxOffsetRef.current > 0 ? next / maxOffsetRef.current : 0);

      if (next >= maxOffsetRef.current) {
        setIsPlaying(false);
      }

      return next;
    });
  }, [speed]);

  useEffect(() => {
    measure();

    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      measure();
    });

    if (viewportRef.current) {
      observer.observe(viewportRef.current);
    }

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!isPlaying) {
      stopLoop();
      return;
    }

    tick();
    intervalRef.current = window.setInterval(tick, LOOP_INTERVAL_MS);
    return stopLoop;
  }, [isPlaying, stopLoop, tick]);

  useEffect(() => stopLoop, [stopLoop]);

  useEffect(() => () => {
    if (voiceFrameRef.current !== null) {
      window.cancelAnimationFrame(voiceFrameRef.current);
    }
  }, []);

  const controls = useMemo(
    () => ({
      play: () => {
        lastTickRef.current = null;
        setIsPlaying(true);
      },
      pause: () => setIsPlaying(false),
      toggle: () => setIsPlaying((current) => !current),
      restart: () => {
        setIsPlaying(false);
        voiceDeltaRef.current = 0;
        if (voiceFrameRef.current !== null) {
          window.cancelAnimationFrame(voiceFrameRef.current);
          voiceFrameRef.current = null;
        }
        setOffset(0);
        setProgress(0);
      },
      scrollByDelta: applyDelta,
      measure
    }),
    [applyDelta, measure]
  );

  return {
    viewportRef,
    contentRef,
    offset,
    isPlaying,
    progress,
    ...controls
  };
}

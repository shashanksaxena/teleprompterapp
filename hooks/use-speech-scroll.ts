"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: {
      transcript: string;
      confidence: number;
    };
  }>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

type UseSpeechScrollOptions = {
  onAdvance: (delta: number) => void;
};

export function useSpeechScroll({ onAdvance }: UseSpeechScrollOptions) {
  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const enabledRef = useRef(false);
  const recognitionCtorRef = useRef<(new () => SpeechRecognitionInstance) | null>(null);

  const stop = useCallback(() => {
    enabledRef.current = false;
    setEnabled(false);
    setListening(false);
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const SpeechRecognitionCtor = recognitionCtorRef.current;
    if (!SpeechRecognitionCtor || recognitionRef.current) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcriptSize = 0;

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcriptSize += event.results[index][0].transcript.trim().length;
      }

      if (transcriptSize > 0) {
        const advanceBy = Math.max(24, transcriptSize * 2.2);
        onAdvance(advanceBy);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error === "not-allowed" ? "Microphone access was denied." : `Speech error: ${event.error}`);
      setListening(false);
      enabledRef.current = false;
      setEnabled(false);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;

      if (enabledRef.current) {
        start();
      }
    };

    setError(null);
    setListening(true);
    recognition.start();
    recognitionRef.current = recognition;
  }, [onAdvance]);

  const toggle = useCallback(() => {
    if (!supported) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (enabledRef.current) {
      stop();
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    start();
  }, [start, stop, supported]);

  useEffect(() => {
    recognitionCtorRef.current = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    setSupported(Boolean(recognitionCtorRef.current));
  }, []);

  useEffect(() => stop, [stop]);

  return {
    supported,
    enabled,
    listening,
    error,
    toggle,
    stop
  };
}

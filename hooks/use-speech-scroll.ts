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
  const [checking, setChecking] = useState(true);
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
      const message =
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Microphone access is needed for voice scrolling. Allow it in your browser settings, then try again."
          : event.error === "no-speech"
            ? "I could not hear speech yet. Try speaking a little closer to your microphone."
            : "Voice scrolling paused. You can continue with manual scrolling or try again.";
      setError(message);
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
    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch {
      setError("Voice scrolling could not start. You can continue with manual scrolling.");
      enabledRef.current = false;
      setEnabled(false);
    }
  }, [onAdvance]);

  const toggle = useCallback(() => {
    if (checking) {
      return;
    }

    if (!supported) {
      setError("Voice scrolling is not available in this browser. Manual scrolling is still ready to use.");
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
    setChecking(false);
  }, []);

  useEffect(() => stop, [stop]);

  return {
    supported,
    checking,
    enabled,
    listening,
    error,
    toggle,
    stop
  };
}

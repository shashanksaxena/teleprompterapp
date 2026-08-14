export type ThemeMode = "light" | "dark";

export type AppSettings = {
  speed: number;
  fontSize: number;
  theme: ThemeMode;
  mirrorMode: boolean;
  mirrorCamera: boolean;
  isFullscreen: boolean;
};

export type SavedScript = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type UserPlan = {
  isPremium: boolean;
  name: "Free" | "Premium";
};

export type TeleprompterMetrics = {
  isPlaying: boolean;
  progress: number;
  voiceSupported: boolean;
  voiceEnabled: boolean;
  voiceListening: boolean;
  voiceError: string | null;
  isRecording: boolean;
  recorderSupported: boolean;
  recorderError: string | null;
};

export type RestoredRecording = {
  blob: Blob | null;
  url: string | null;
  durationSeconds: number;
};

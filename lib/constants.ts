import { AppSettings, SavedScript, UserPlan } from "@/lib/types";

export const STORAGE_KEYS = {
  draft: "freeteleprompter:draft:v2",
  savedScripts: "freeteleprompter:saved-scripts",
  settings: "freeteleprompter:settings",
  plan: "freeteleprompter:plan"
} as const;

export const FREE_SCRIPT_LIMIT = 3;
export const FREE_DOWNLOAD_LIMIT = 3;

export const DEFAULT_SCRIPT = "";

export const DEMO_SCRIPT = `Welcome to FreeTeleprompter.in.

Record better videos without memorizing every line. Paste your own script here, adjust the reading speed, and start recording when you are ready.`;

export const DEFAULT_SETTINGS: AppSettings = {
  speed: 36,
  fontSize: 42,
  theme: "light",
  mirrorMode: false,
  mirrorCamera: true,
  isFullscreen: false
};

export const DEFAULT_PLAN: UserPlan = {
  isPremium: false,
  name: "Free"
};

export const STARTER_SCRIPTS: SavedScript[] = [
  {
    id: "welcome-demo",
    title: "Welcome Demo",
    content: DEFAULT_SCRIPT,
    updatedAt: new Date("2026-04-21T12:00:00.000Z").toISOString()
  }
];

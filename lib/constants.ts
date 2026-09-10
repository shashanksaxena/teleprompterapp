import { AppSettings, SavedScript, UserPlan } from "@/lib/types";

export const STORAGE_KEYS = {
  draft: "freeteleprompter:draft",
  savedScripts: "freeteleprompter:saved-scripts",
  settings: "freeteleprompter:settings",
  plan: "freeteleprompter:plan"
} as const;

export const FREE_SCRIPT_LIMIT = 3;
export const FREE_DOWNLOAD_LIMIT = 3;

export const DEFAULT_SCRIPT = `Welcome to FreeTeleprompter.in.

Record better videos without memorizing every line. This browser-based teleprompter helps creators, educators, founders, and video teams stay natural on camera.

Paste your script, adjust the reading speed, switch themes, and enable mirror mode when your camera setup needs reversed text.

For a more natural pace, turn on voice-controlled scrolling. The prompt follows your speech while you focus on the delivery.

When you are ready, start the camera, record your take, review it, and download the video.`;

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

import { AppSettings, SavedScript, UserPlan } from "@/lib/types";

export const STORAGE_KEYS = {
  draft: "freeteleprompter:draft",
  savedScripts: "freeteleprompter:saved-scripts",
  settings: "freeteleprompter:settings",
  plan: "freeteleprompter:plan"
} as const;

export const FREE_SCRIPT_LIMIT = 3;

export const DEFAULT_SCRIPT = `Welcome to FreeTeleprompter.in.

This production-ready starter is built for creators, educators, founders, and video teams who need a fast teleprompter that works beautifully on mobile.

Use the editor to paste your script, adjust the reading speed, switch themes, and enable mirror mode when your camera setup needs reversed text.

If you prefer to drive the pace naturally, turn on voice-controlled scrolling. The app listens for your speech and nudges the prompt forward so the reading flow stays comfortable.

Future-ready hooks are already prepared for AI script generation, AI speech feedback, and video recording with captions.`;

export const DEFAULT_SETTINGS: AppSettings = {
  speed: 36,
  fontSize: 42,
  theme: "dark",
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

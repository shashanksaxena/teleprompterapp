export const siteConfig = {
  name: "FreeTeleprompter.in",
  shortName: "FreeTeleprompter",
  domain: "https://freeteleprompter.in",
  author: "Shashank Saxena",
  supportEmail: "shashanksaxena18@gmail.com",
  country: "India",
  title: "Free Online Teleprompter for Videos and YouTube",
  titleTemplate: "%s | FreeTeleprompter.in",
  description:
    "Use a free online teleprompter for YouTube, webcam videos, presentations, phone recording, and voice-controlled scrolling directly in your browser.",
  keywords: [
    "free teleprompter online",
    "online teleprompter",
    "free online teleprompter",
    "teleprompter with video recording",
    "teleprompter app",
    "cue prompter",
    "script scrolling app",
    "voice controlled teleprompter",
    "mirror mode teleprompter",
    "reel teleprompter",
    "teleprompter for reels",
    "teleprompter for youtube videos",
    "browser teleprompter",
    "teleprompter online",
    "free teleprompter",
    "free teleprompter for videos",
    "teleprompter for webcam",
    "teleprompter for phone",
    "teleprompter with voice control",
    "teleprompter for video recording",
    "teleprompter for presentations"
  ],
  ogImage: "/opengraph-image"
} as const;

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.domain;

  try {
    const url = new URL(configuredUrl);
    url.protocol = "https:";
    url.hostname = url.hostname.replace(/^www\./, "");
    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return siteConfig.domain;
  }
}

export function createPageTitle(title: string) {
  return `${title} | ${siteConfig.name}`;
}

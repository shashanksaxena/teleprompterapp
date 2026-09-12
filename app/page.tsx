import type { Metadata } from "next";

import { HomepageContent } from "@/components/homepage-content";
import { HeroStudio } from "@/components/hero-studio";
import { TeleprompterApp } from "@/components/teleprompter-app";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Online Teleprompter for Videos",
  description:
    "Use a free online teleprompter for YouTube, webcam videos, presentations, and phone recording. Paste a script, adjust scrolling speed, and start in your browser.",
  keywords: [
    "online teleprompter",
    "free teleprompter",
    "teleprompter online",
    "free teleprompter for videos",
    "teleprompter for YouTube",
    "browser teleprompter",
    "teleprompter for webcam",
    "teleprompter for phone",
    "teleprompter with voice control"
  ],
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex min-h-[calc(78svh-4.75rem)] w-full max-w-[1180px] items-center px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid w-full items-center gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p className="section-kicker">Write. Read. Record.</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Record Better Videos Without Memorizing Your Script
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-soft)] sm:text-lg">
              Free online teleprompter with voice scrolling, camera recording, script saving, and mirror mode. Works directly in your browser.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
              <a href="#app-tools" className="cta-primary">Start Teleprompter - It&apos;s Free</a>
              <span className="text-[var(--text-soft)]">No installation. No credit card required.</span>
            </div>
            <div className="pricing-strip mt-5">
              <div className="pricing-free">
                <span className="pricing-eyebrow">Start free</span>
                <strong>3 downloads</strong>
                <span>No card required</span>
              </div>
              <div className="pricing-main">
                <span className="pricing-eyebrow">Creator Pro</span>
                <div className="pricing-price"><span>₹</span>49 <small>/ month</small></div>
                <span>Unlimited video + MP3 downloads</span>
              </div>
              <div className="pricing-save">
                <span className="pricing-eyebrow">September bash</span>
                <strong>80% off</strong>
                <span><s>₹249/month</s> regular price</span>
              </div>
            </div>
          </div>
          <HeroStudio />
        </div>
      </section>
      <TeleprompterApp />
      <HomepageContent />
    </>
  );
}

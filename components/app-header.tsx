"use client";

import Link from "next/link";
import { Mic2, PlayCircle, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { GoogleIcon } from "@/components/google-icon";
import { UserPlan } from "@/lib/types";

type AppHeaderProps = {
  plan: UserPlan;
  compact?: boolean;
};

const highlightPills = ["No install", "Mirror mode", "Voice scroll", "Script saving"];

export function AppHeader({ plan, compact = false }: AppHeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="glass-panel overflow-hidden rounded-[28px] p-5 md:p-7">
      {compact ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Teleprompter studio</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Write, tune, and rehearse.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-soft)]">
              Your script stays in the browser. Camera access is optional, so you can practice with the prompt before
              you record.
            </p>
          </div>
          <div className="soft-badge shrink-0">{plan.isPremium ? "Premium plan" : "Free plan"}</div>
        </div>
      ) : null}

      {!compact ? <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]">
            <Mic2 className="h-3.5 w-3.5 text-[var(--accent)]" />
            FreeTeleprompter.in
          </span>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-3xl font-semibold leading-[1.05] md:text-5xl">
              Free online teleprompter for confident video recording.
            </h1>
            <p className="max-w-3xl text-[15px] leading-7 text-[var(--text-soft)] md:text-lg">
              Write or paste your script, adjust scrolling speed and text size, and use a browser teleprompter for
              YouTube, webcam videos, presentations, and phone recording. No installation required.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/teleprompter-app" className="cta-primary">
              <PlayCircle className="h-4 w-4" />
              Try the app now
            </Link>
            <Link href="/how-to-use" className="cta-secondary">
              Learn the flow
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {highlightPills.map((pill) => (
              <span key={pill} className="soft-badge">
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Creator workflow</p>
              <h2 className="mt-1 text-lg font-semibold">Built to keep you in flow</h2>
            </div>
            <div className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              {plan.isPremium ? "Premium" : "Free"}
            </div>
          </div>

          <div className="mockup-window">
            <div className="mockup-topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-pill active" />
                <div className="mockup-pill" />
                <div className="mockup-pill" />
              </div>

              <div className="mockup-stage">
                <div className="script-preview">
                  <div className="script-line line-lg" />
                  <div className="script-line line-md" />
                  <div className="script-line line-sm" />
                  <div className="script-line line-md" />
                  <div className="script-line line-lg" />
                </div>

                <div className="camera-badge">
                  <span className="camera-dot" />
                  live
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {[
              { icon: Sparkles, title: "Write a clear script", text: "Paste your draft and keep it easy to follow." },
              { icon: Wand2, title: "Adjust the pace", text: "Use speed, font size, and mirror mode to fit your setup." },
              { icon: ShieldCheck, title: "Record with confidence", text: "Practice, record, and review in one browser-based flow." }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="feature-item">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="metric-card">
              <span>3 steps</span>
              <strong>Ready</strong>
            </div>
            <div className="metric-card">
              <span>Browser</span>
              <strong>Only</strong>
            </div>
            <div className="metric-card">
              <span>Saved</span>
              <strong>Easy</strong>
            </div>
          </div>
        </div>
      </div> : null}

      <div className={`${compact ? "mt-5" : "mt-6"} flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-soft)]">
          {plan.isPremium ? "Premium plan active" : "Free plan active"}
        </div>

        {status === "authenticated" ? (
          <button type="button" onClick={() => signOut()} className="control-chip inline-flex justify-center">
            {session.user.name ? `Sign out ${session.user.name.split(" ")[0]}` : "Sign out"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => signIn("google")}
            className="control-chip inline-flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
}

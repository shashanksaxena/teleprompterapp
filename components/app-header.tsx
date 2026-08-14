"use client";

import { Mic2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { GoogleIcon } from "@/components/google-icon";
import { UserPlan } from "@/lib/types";

type AppHeaderProps = {
  plan: UserPlan;
};

export function AppHeader({ plan }: AppHeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="grid gap-4 border-b border-[var(--border)] pb-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
          <Mic2 className="h-3.5 w-3.5" />
          FreeTeleprompter.in
        </span>
        <div>
          <h1 className="max-w-4xl text-2xl font-semibold leading-[1.08] md:text-[2.6rem]">
            Free online teleprompter with video recording and voice scroll
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[var(--text-soft)] md:text-lg">
            Record reels, YouTube videos, presentations, and classes with a mobile-friendly teleprompter, mirrored
            script mode, adjustable speed, and account-based saved scripts.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 lg:min-w-[250px] lg:items-end">
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

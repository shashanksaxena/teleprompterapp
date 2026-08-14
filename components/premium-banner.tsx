"use client";

import { Crown, LockKeyhole } from "lucide-react";

type PremiumBannerProps = {
  canSaveMore: boolean;
  isPremium: boolean;
};

export function PremiumBanner({ canSaveMore, isPremium }: PremiumBannerProps) {
  return (
    <div className="glass-panel rounded-[24px] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            {isPremium ? <Crown className="h-4 w-4 text-[var(--accent)]" /> : <LockKeyhole className="h-4 w-4 text-[var(--accent)]" />}
            {isPremium ? "Premium mode" : "Upgrade path ready"}
          </p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            {canSaveMore || isPremium
              ? "Free users get limited saved scripts. Premium can unlock unlimited saves, remove ads, and enable future AI tools."
              : "Free save limit reached. The gating logic is active and ready to connect to billing later."}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-soft)]">
          `isPremium` controls save limits, ad visibility, and future AI feature access.
        </div>
      </div>
    </div>
  );
}

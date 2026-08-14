"use client";

type AdPlaceholderProps = {
  hiddenForPremium: boolean;
};

export function AdPlaceholder({ hiddenForPremium }: AdPlaceholderProps) {
  if (hiddenForPremium) {
    return null;
  }

  return (
    <div className="glass-panel rounded-[24px] border-dashed p-4">
      <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-soft)]">
          Ad Placeholder
        </p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Reserved for future ad units on the free plan. Premium users will not see this area.
        </p>
      </div>
    </div>
  );
}

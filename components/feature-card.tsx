"use client";

import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="glass-panel rounded-[24px] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[var(--accent)]/10 p-3 text-[var(--accent)]">{icon}</div>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-[var(--text-soft)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { RefObject } from "react";

import { cn } from "@/lib/utils";

type DisplayPanelProps = {
  containerRef: RefObject<HTMLDivElement | null>;
  script: string;
  fontSize: number;
  mirrorMode: boolean;
  onScroll: () => void;
};

export function DisplayPanel({
  containerRef,
  script,
  fontSize,
  mirrorMode,
  onScroll
}: DisplayPanelProps) {
  return (
    <section className="glass-panel relative rounded-[16px] p-2 md:p-3">
      <div className="pointer-events-none absolute inset-x-0 top-3 h-16 bg-gradient-to-b from-[var(--surface-strong)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 h-16 bg-gradient-to-t from-[var(--surface-strong)] to-transparent" />

      <div
        ref={containerRef}
        onScroll={onScroll}
        className="relative h-[58vh] overflow-y-auto rounded-[12px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-14 md:h-[70vh] md:px-8"
      >
        <div className="mx-auto max-w-4xl">
          <p
            style={{ fontSize: `${fontSize}px` }}
            className={cn("teleprompter-text pb-[48vh] font-normal", mirrorMode && "mirror-text")}
          >
            {script || "Your script will appear here as you type."}
          </p>
        </div>
      </div>
    </section>
  );
}

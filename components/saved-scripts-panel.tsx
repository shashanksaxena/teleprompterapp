"use client";

import { FileText, Trash2 } from "lucide-react";
import { signIn } from "next-auth/react";

import { FREE_SCRIPT_LIMIT } from "@/lib/constants";
import { SavedScript, UserPlan } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type SavedScriptsPanelProps = {
  isAuthenticated: boolean;
  scripts: SavedScript[];
  plan: UserPlan;
  onLoadScript: (script: SavedScript) => void;
  onDeleteScript: (scriptId: string) => void;
};

export function SavedScriptsPanel({
  isAuthenticated,
  scripts,
  plan,
  onLoadScript,
  onDeleteScript
}: SavedScriptsPanelProps) {
  return (
    <section className="glass-panel rounded-[16px] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Cloud library</p>
          <h2 className="text-base font-semibold">Saved scripts</h2>
          <p className="text-sm text-[var(--text-soft)]">
            {plan.isPremium
              ? "Premium users can keep unlimited scripts."
              : `Free users can keep up to ${FREE_SCRIPT_LIMIT} scripts.`}
          </p>
        </div>
        <div className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-soft)]">
          {scripts.length} total
        </div>
      </div>

      <div className="space-y-3">
        {!isAuthenticated ? (
          <div className="rounded-[18px] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--text-soft)]">
            <p>Sign in with Google to save scripts to your account and keep them visible only to you.</p>
            <button
              type="button"
              onClick={() => void signIn("google")}
              className="mt-4 inline-flex items-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]"
            >
              Sign in to save scripts
            </button>
          </div>
        ) : null}

        {isAuthenticated
          ? scripts.map((script) => (
          <div
            key={script.id}
            className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <button type="button" onClick={() => onLoadScript(script)} className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-[var(--accent)]" />
                  {script.title}
                </div>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  {script.content.slice(0, 180)}
                  {script.content.length > 180 ? "..." : ""}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">
                  Updated {formatDate(script.updatedAt)}
                </p>
              </button>

              <button
                type="button"
                onClick={() => onDeleteScript(script.id)}
                className="rounded-xl border border-[var(--border)] p-2 text-[var(--text-soft)] transition hover:text-rose-300"
                aria-label={`Delete ${script.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
            ))
          : null}

        {isAuthenticated && scripts.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--text-soft)]">
            No saved scripts yet. Use the save button above to create your first reusable prompt.
          </div>
        ) : null}
      </div>
    </section>
  );
}

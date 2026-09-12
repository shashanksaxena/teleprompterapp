"use client";

import { Eraser, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

import { DEMO_SCRIPT } from "@/lib/constants";

type ScriptEditorProps = {
  script: string;
  onScriptChange: (nextValue: string) => void;
  onSaveScript: () => void;
  saveDisabled: boolean;
  saveLabel: string;
  onClearScript: () => void;
  onLoadDemoScript: () => void;
};

export function ScriptEditor({
  script,
  onScriptChange,
  onSaveScript,
  saveDisabled,
  saveLabel,
  onClearScript,
  onLoadDemoScript
}: ScriptEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="glass-panel rounded-[16px] p-4" onMouseDown={() => setIsFocused(true)}>
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="section-kicker">Script workspace</p>
          <h2 className="text-base font-semibold">Paste your script here</h2>
          <p className="text-sm text-[var(--text-soft)]">
            Auto-saved locally and ready for quick edits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemoScript}
            className="control-chip inline-flex items-center gap-2 px-3.5 py-2.5"
          >
            <RotateCcw className="h-4 w-4" />
            Load demo
          </button>
          <button
            type="button"
            onClick={onClearScript}
            className="control-chip inline-flex items-center gap-2 px-3.5 py-2.5"
          >
            <Eraser className="h-4 w-4" />
            Clear
          </button>
          <button
            type="button"
            onClick={onSaveScript}
            disabled={saveDisabled}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_12px_30px_rgba(59,130,246,0.25)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveLabel}
          </button>
        </div>
      </div>

      <textarea
        value={script}
        onChange={(event) => onScriptChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused || script ? "" : DEMO_SCRIPT}
        className="script-editor-input min-h-[220px] w-full rounded-[10px] border border-black bg-black p-4 text-base leading-7 text-white caret-white outline-none transition placeholder:text-white/55 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] md:min-h-[260px]"
      />
    </section>
  );
}

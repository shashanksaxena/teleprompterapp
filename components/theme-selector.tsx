"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import { AppSettings } from "@/lib/types";

type Theme = AppSettings["theme"];

export function ThemeSelector() {
    const [theme, setTheme] = useState<Theme>(DEFAULT_SETTINGS.theme);

    useEffect(() => {
        try {
            const storedSettings = window.localStorage.getItem(STORAGE_KEYS.settings);
            if (storedSettings) {
                const settings = JSON.parse(storedSettings) as Partial<AppSettings>;
                if (settings.theme === "light" || settings.theme === "dark") {
                    setTheme(settings.theme);
                    document.documentElement.dataset.theme = settings.theme;
                }
            }
        } catch {
            document.documentElement.dataset.theme = DEFAULT_SETTINGS.theme;
        }
    }, []);

    const selectTheme = (nextTheme: Theme) => {
        setTheme(nextTheme);
        document.documentElement.dataset.theme = nextTheme;

        try {
            const storedSettings = window.localStorage.getItem(STORAGE_KEYS.settings);
            const settings = storedSettings ? (JSON.parse(storedSettings) as AppSettings) : DEFAULT_SETTINGS;
            window.localStorage.setItem(
                STORAGE_KEYS.settings,
                JSON.stringify({ ...DEFAULT_SETTINGS, ...settings, theme: nextTheme })
            );
            window.dispatchEvent(new CustomEvent("teleprompter:theme-change", { detail: nextTheme }));
        } catch {
            // Theme still applies to the current page if storage is unavailable.
        }
    };

    return (
        <div className="fixed right-4 top-4 z-40 inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md sm:right-6 sm:top-6">
            <button
                type="button"
                aria-label="Use light theme"
                aria-pressed={theme === "light"}
                onClick={() => selectTheme("light")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${theme === "light" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-soft)] hover:text-[var(--text)]"
                    }`}
            >
                <SunMedium className="h-4 w-4" />
            </button>
            <button
                type="button"
                aria-label="Use dark theme"
                aria-pressed={theme === "dark"}
                onClick={() => selectTheme("dark")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition ${theme === "dark" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-soft)] hover:text-[var(--text)]"
                    }`}
            >
                <MoonStar className="h-4 w-4" />
            </button>
        </div>
    );
}

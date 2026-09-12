"use client";

import { Chrome, X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "freeteleprompter:google-login-prompt-dismissed";

async function saveConsent(decision: "accepted" | "rejected" | "dismissed") {
    try {
        await fetch("/api/notifications/consent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                decision,
                promptType: "google_login",
                source: "landing_page"
            })
        });
    } catch {
        // The prompt should stay usable even if persistence fails.
    }
}

export function GoogleLoginPrompt() {
    const { data: session, status } = useSession();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        if (session) {
            return;
        }

        const dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
        if (dismissed) {
            return;
        }

        // Stagger this prompt so it does not appear alongside the notification prompt on the landing page.
        const timer = window.setTimeout(() => setVisible(true), 6000);
        return () => window.clearTimeout(timer);
    }, [session, status]);

    if (status === "loading" || session || !visible) {
        return null;
    }

    const dismiss = () => {
        window.localStorage.setItem(STORAGE_KEY, "1");
        void saveConsent("dismissed");
        setVisible(false);
    };

    const login = async () => {
        window.localStorage.setItem(STORAGE_KEY, "1");
        await saveConsent("accepted");
        setVisible(false);
        await signIn("google", { callbackUrl: "/#app-tools" });
    };

    return (
        <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-xl rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:bg-[rgba(15,23,42,0.86)] sm:inset-x-auto sm:right-5 sm:left-auto">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Chrome className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">Sign in with Google</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">
                        Save scripts, unlock faster workflows, and keep your teleprompter recordings connected to your account.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={dismiss}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-soft)] transition hover:bg-[var(--surface-strong)]"
                    aria-label="Dismiss Google sign-in prompt"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => { void saveConsent("rejected"); dismiss(); }} className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-soft)] transition hover:bg-[var(--surface-strong)]">
                    Later
                </button>
                <button type="button" onClick={() => { void login(); }} className="rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-contrast)] shadow-[0_8px_20px_rgba(59,130,246,0.2)] transition hover:-translate-y-0.5">
                    Continue with Google
                </button>
            </div>
        </div>
    );
}

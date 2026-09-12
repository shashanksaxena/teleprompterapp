"use client";

import { Bell, BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEYS = {
    dismissed: "freeteleprompter:notification-prompt-dismissed",
    permission: "freeteleprompter:notification-permission",
    lastSentAt: "freeteleprompter:notification-last-sent-at"
};

const REMINDER_MESSAGES = [
    "Your next take is ready. Paste a script and keep your flow sharp.",
    "Need a fresh take? Open the teleprompter and keep your delivery natural.",
    "Script tip: trim long sentences and keep your pace conversational for better delivery."
];

function scheduleRegularNotifications() {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
    }

    const sendReminder = () => {
        const lastSentAt = Number(window.localStorage.getItem(STORAGE_KEYS.lastSentAt) || "0");
        const now = Date.now();
        const intervalMs = 1000 * 60 * 60 * 24;

        if (now - lastSentAt < intervalMs) {
            return;
        }

        const message = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
        const notification = new Notification("FreeTeleprompter reminder", {
            body: message,
            icon: "/icon?size=192",
            badge: "/icon?size=192",
            tag: "freeteleprompter-reminder"
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
            window.location.href = "/#app-tools";
        };

        window.localStorage.setItem(STORAGE_KEYS.lastSentAt, String(now));
    };

    sendReminder();
    const intervalId = window.setInterval(sendReminder, 1000 * 60 * 60 * 12);
    return () => window.clearInterval(intervalId);
}

async function saveNotificationConsent(decision: "accepted" | "rejected" | "dismissed", source = "landing_page") {
    try {
        await fetch("/api/notifications/consent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                decision,
                promptType: "browser_notification",
                source
            })
        });
    } catch {
        // The app stays usable even if persistence is unavailable.
    }
}

export function NotificationSettingsControl() {
    const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
        typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
    );

    useEffect(() => {
        if (!("Notification" in window)) {
            setPermission("unsupported");
            return;
        }

        setPermission(Notification.permission);
    }, []);

    if (permission === "unsupported") {
        return null;
    }

    const toggleNotifications = async () => {
        if (!("Notification" in window)) {
            return;
        }

        if (permission === "granted") {
            setPermission("default");
            await saveNotificationConsent("rejected", "settings_panel");
            return;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        await saveNotificationConsent(result === "granted" ? "accepted" : "rejected", "settings_panel");
    };

    return (
        <div className="fixed bottom-5 left-5 z-40 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.85)] px-3 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-[rgba(15,23,42,0.82)]">
            <button type="button" onClick={() => { void toggleNotifications(); }} className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                <Bell className="h-3.5 w-3.5" />
                {permission === "granted" ? "Notifications on" : "Notifications off"}
            </button>
        </div>
    );
}

export function NotificationPermissionPrompt() {
    const [visible, setVisible] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
        typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
    );

    useEffect(() => {
        if (!("Notification" in window)) {
            return;
        }

        const dismissed = window.localStorage.getItem(STORAGE_KEYS.dismissed) === "1";
        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        if (currentPermission === "granted") {
            window.localStorage.setItem(STORAGE_KEYS.permission, currentPermission);
            scheduleRegularNotifications();
            return;
        }

        if (!dismissed) {
            const timer = window.setTimeout(() => setVisible(true), 7000);
            return () => window.clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (permission !== "granted") {
            return;
        }

        const cleanup = scheduleRegularNotifications();
        return cleanup;
    }, [permission]);

    if (!visible || permission === "granted" || permission === "unsupported") {
        return null;
    }

    const enableNotifications = async () => {
        if (!("Notification" in window)) {
            return;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        window.localStorage.setItem(STORAGE_KEYS.permission, result);

        if (result === "granted") {
            setVisible(false);
            scheduleRegularNotifications();
            return;
        }

        setVisible(false);
    };

    const dismiss = () => {
        window.localStorage.setItem(STORAGE_KEYS.dismissed, "1");
        setVisible(false);
    };

    return (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-[20px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-3 shadow-[0_18px_38px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:bg-[rgba(15,23,42,0.86)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:left-auto">
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <BellRing className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">Allow notifications</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-soft)]">
                        Get reminder notifications for script ideas, recording tips, and easy follow-up check-ins.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={dismiss}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-soft)] transition hover:bg-[var(--surface-strong)]"
                    aria-label="Dismiss notification prompt"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={dismiss} className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--text-soft)] transition hover:bg-[var(--surface-strong)]">
                    Not now
                </button>
                <button type="button" onClick={enableNotifications} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[var(--accent-contrast)] shadow-[0_8px_20px_rgba(59,130,246,0.2)] transition hover:-translate-y-0.5">
                    <Bell className="h-3.5 w-3.5" />
                    Allow
                </button>
            </div>
        </div>
    );
}

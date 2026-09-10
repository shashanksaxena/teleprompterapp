"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
    const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!("serviceWorker" in navigator)) {
            return;
        }

        void navigator.serviceWorker.register("/sw.js").catch(() => {
            // The app remains fully usable when offline support is unavailable.
        });

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setInstallEvent(event as InstallPromptEvent);
            setVisible(true);
        };

        const handleInstalled = () => {
            setInstallEvent(null);
            setVisible(false);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleInstalled);
        };
    }, []);

    if (!visible || !installEvent) {
        return null;
    }

    const install = async () => {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        setInstallEvent(null);
        setVisible(false);

        if (choice.outcome === "dismissed") {
            window.sessionStorage.setItem("freeteleprompter:install-dismissed", "1");
        }
    };

    return (
        <aside className="install-prompt" role="status" aria-label="Install FreeTeleprompter">
            <div className="install-prompt-icon">
                <Download className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Install FreeTeleprompter</p>
                <p className="mt-0.5 text-xs text-[var(--text-soft)]">Keep your recording studio one tap away.</p>
            </div>
            <button type="button" onClick={install} className="install-prompt-action">
                Install
            </button>
            <button type="button" onClick={() => setVisible(false)} className="install-prompt-close" aria-label="Dismiss install prompt">
                <X className="h-4 w-4" />
            </button>
        </aside>
    );
}

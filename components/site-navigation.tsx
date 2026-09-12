"use client";

import Link from "next/link";
import { ChevronDown, LogIn, UserRound } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const navItems = [
    { label: "Blog", href: "/articles" },
    { label: "How to use", href: "/how-to-use" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
];

export function SiteNavigation() {
    const { data: session, status } = useSession();
    const [toolsOpen, setToolsOpen] = useState(false);
    const [toolsPosition, setToolsPosition] = useState({ top: 56, left: 16 });
    const toolsButtonRef = useRef<HTMLButtonElement | null>(null);
    const isAuthenticated = status === "authenticated";
    const planLabel = session?.user?.isPremium ? "Pro plan active" : "Free plan active";

    const toggleTools = () => {
        if (!toolsOpen && toolsButtonRef.current) {
            const rect = toolsButtonRef.current.getBoundingClientRect();
            setToolsPosition({
                top: rect.bottom + 8,
                left: Math.max(8, Math.min(rect.left, window.innerWidth - 240))
            });
        }
        setToolsOpen((current) => !current);
    };

    const toolsMenu = toolsOpen && typeof document !== "undefined"
        ? createPortal(
            <div
                className="fixed z-[100] w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1.5 text-[var(--text)] shadow-[0_18px_45px_rgba(15,23,42,0.28)]"
                style={{ top: toolsPosition.top, left: toolsPosition.left }}
                role="menu"
            >
                {[
                    ["Script Timer", "/creator-tools/script-timer"],
                    ["Word Counter", "/creator-tools/word-counter"],
                    ["Speed Calculator", "/creator-tools/speed-calculator"],
                    ["Script Formatter", "/creator-tools/script-formatter"],
                    ["Script Generator", "/creator-tools/script-generator"]
                ].map(([label, href]) => (
                    <Link key={href} href={href} onClick={() => setToolsOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]" role="menuitem">
                        {label}
                    </Link>
                ))}
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <nav
                aria-label="Primary navigation"
                className="fixed inset-x-3 top-3 z-30 mx-auto flex max-w-[1180px] items-center gap-1.5 overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 pr-24 shadow-[0_10px_30px_rgba(15,23,42,0.1)] backdrop-blur-md sm:inset-x-6 sm:top-4 sm:gap-2 sm:pr-32"
            >
                <Link
                    href="/"
                    className="shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--accent-soft)] sm:px-4 sm:text-sm"
                >
                    FreeTeleprompter
                </Link>
                <span className="h-5 w-px shrink-0 bg-[var(--border)]" aria-hidden="true" />
                {navItems.map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="shrink-0 rounded-full px-3 py-2 text-xs font-medium text-[var(--text-soft)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)] sm:px-3.5 sm:text-sm"
                    >
                        {label}
                    </Link>
                ))}
                <div className="relative shrink-0">
                    <button
                        ref={toolsButtonRef}
                        type="button"
                        onClick={toggleTools}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-medium text-[var(--text-soft)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--text)] sm:px-3.5 sm:text-sm"
                        aria-expanded={toolsOpen}
                        aria-haspopup="menu"
                    >
                        Creator tools
                        <ChevronDown className={`h-3.5 w-3.5 transition ${toolsOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        if (!isAuthenticated) {
                            void signIn("google");
                        }
                    }}
                    className={`ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition sm:px-3.5 sm:text-sm ${isAuthenticated
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_8px_20px_rgba(59,130,246,0.22)] hover:opacity-90"
                        }`}
                    aria-label={isAuthenticated ? planLabel : "Sign in with Google"}
                    title={isAuthenticated ? planLabel : "Sign in with Google"}
                >
                    {isAuthenticated ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                    <span>{isAuthenticated ? planLabel : "Sign in"}</span>
                </button>
            </nav>
            {toolsMenu}
        </>
    );
}

import Link from "next/link";

const navItems = [
    { label: "Home", href: "/" },
    { label: "Teleprompter", href: "/teleprompter-app" },
    { label: "Blog", href: "/articles" },
    { label: "How to use", href: "/how-to-use" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
];

export function SiteNavigation() {
    return (
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
        </nav>
    );
}

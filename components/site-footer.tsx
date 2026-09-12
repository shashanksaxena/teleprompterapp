import Link from "next/link";
import { Heart } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="mx-auto mt-8 w-full max-w-[1180px] px-4 pb-6 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] py-5 text-sm text-[var(--text-soft)] sm:flex-row">
                <p className="inline-flex items-center gap-1.5">
                    Built with <Heart className="h-4 w-4 fill-rose-500 text-rose-500" aria-hidden="true" /> for everyone
                </p>
                <div className="flex items-center gap-4">
                    <Link href="/privacy" className="transition hover:text-[var(--text)]">Privacy</Link>
                    <Link href="/terms" className="transition hover:text-[var(--text)]">Terms</Link>
                    <span>© {new Date().getFullYear()} FreeTeleprompter.in</span>
                </div>
            </div>
        </footer>
    );
}
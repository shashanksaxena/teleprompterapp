"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { CheckCircle2, CreditCard, Download, Loader2, ShieldCheck, Sparkles, X } from "lucide-react";
import { GoogleIcon } from "@/components/google-icon";

type Props = { open: boolean; onClose: () => void; onDownload: () => void; recordingReady: boolean; onSubscriptionActivated: () => void };
type Options = { key: string; subscription_id: string; name: string; description: string; handler: (response: { razorpay_subscription_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void; prefill?: { name?: string | null; email?: string | null }; theme?: { color: string }; modal?: { ondismiss?: () => void } };
declare global { interface Window { Razorpay?: new (options: Options) => { open: () => void } } }

function loadRazorpay() { return new Promise<boolean>((resolve) => { if (window.Razorpay) return resolve(true); const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script); }); }

export function DownloadGateModal({ open, onClose, onDownload, recordingReady, onSubscriptionActivated }: Props) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    if (!open) return null;
    const isAuthenticated = status === "authenticated";
    const title = isAuthenticated ? "Your first 3 downloads are free" : "Get your first 3 downloads free";
    const intro = isAuthenticated
        ? "You've used all 3 free downloads. Upgrade to Pro for unlimited video and MP3 downloads at ₹49/month."
        : "Sign in to use your 3 free video or MP3 downloads, then upgrade only when you need unlimited downloads.";

    const startPayment = async () => {
        setLoading(true); setMessage(null);
        if (!(await loadRazorpay())) { setMessage("Secure checkout could not load. Please disable blockers and retry."); setLoading(false); return; }
        const response = await fetch("/api/subscription/create", { method: "POST" });
        const payload = (await response.json()) as { keyId?: string; subscriptionId?: string; error?: string };
        if (!response.ok || !payload.keyId || !payload.subscriptionId) { setMessage(payload.error || "Unable to start payment."); setLoading(false); return; }
        const checkout = new window.Razorpay!({
            key: payload.keyId, subscription_id: payload.subscriptionId, name: "FreeTeleprompter.in", description: "₹49/month for unlimited video downloads",
            prefill: { name: session?.user?.name, email: session?.user?.email }, theme: { color: "#3b82f6" }, modal: { ondismiss: () => setLoading(false) },
            handler: async (payment) => {
                const verification = await fetch("/api/subscription/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payment) });
                if (!verification.ok) { setMessage("Payment verification failed. Please try again."); setLoading(false); return; }
                onSubscriptionActivated(); setLoading(false); onDownload(); onClose();
            }
        });
        checkout.open();
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="download-gate-title">
            <div className="glass-panel w-full max-w-lg overflow-hidden rounded-[28px] p-0 shadow-[0_24px_90px_rgba(15,23,42,0.3)]">
                <div className="border-b border-[var(--border)] bg-[var(--accent-soft)] px-5 py-5 sm:px-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-contrast)] shadow-lg">
                                <Download className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="section-kicker">Video downloads</p>
                                <h2 id="download-gate-title" className="mt-1 text-xl font-semibold">{title}</h2>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2" aria-label="Close">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--text-soft)]">{intro}</p>
                </div>

                <div className="space-y-4 p-5 sm:p-7">
                    {!recordingReady ? <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--text-soft)]">Record a take first, then open the download flow.</div> : null}
                    {status !== "authenticated" ? (
                        <>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    [Sparkles, "3 free downloads"],
                                    [ShieldCheck, "Private account"],
                                    [Download, "Download your take"]
                                ].map(([Icon, label]) => (
                                    <div key={label as string} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-center">
                                        <Icon className="mx-auto h-4 w-4 text-[var(--accent)]" />
                                        <p className="mt-2 text-xs font-semibold text-[var(--text-soft)]">{label as string}</p>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => signIn("google", { callbackUrl: window.location.href })} className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_14px_28px_rgba(59,130,246,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-600">
                                <GoogleIcon />
                                Continue with Google
                            </button>
                            <p className="text-center text-xs text-[var(--text-soft)]">No payment is required for your first 3 video downloads.</p>
                        </>
                    ) : (
                        <>
                            <div className="rounded-2xl border border-[var(--accent)]/25 bg-[var(--accent-soft)] p-4">
                                <div className="flex items-start gap-3"><CreditCard className="mt-0.5 h-5 w-5 text-[var(--accent)]" /><div><h3 className="font-semibold">Pro monthly subscription</h3><p className="mt-1 text-sm leading-6 text-[var(--text-soft)]">Unlimited video and MP3 downloads for ₹49/month.</p></div></div>
                            </div>
                            <button type="button" onClick={startPayment} disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-contrast)] shadow-[0_14px_28px_rgba(59,130,246,0.24)] disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{loading ? "Opening secure checkout..." : "Upgrade to Pro - ₹49/month"}</button>
                            {message ? <p className="text-sm text-rose-500">{message}</p> : null}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CheckCircle2, CreditCard, Download, Loader2, X } from "lucide-react";

import { GoogleIcon } from "@/components/google-icon";

type DownloadGateModalProps = {
    open: boolean;
    onClose: () => void;
    onDownload: () => void;
    recordingReady: boolean;
    onSubscriptionActivated: () => void;
};

type SubscriptionResponse = {
    keyId: string;
    subscriptionId: string;
    amountInr: number;
};

type RazorpayOptions = {
    key: string;
    subscription_id: string;
    name: string;
    description: string;
    handler: (response: {
        razorpay_subscription_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => void;
    prefill?: { name?: string | null; email?: string | null };
    theme?: { color: string };
    modal?: { ondismiss?: () => void };
};

declare global {
    interface Window {
        Razorpay?: new (options: RazorpayOptions) => { open: () => void };
    }
}

function loadRazorpay() {
    return new Promise<boolean>((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function DownloadGateModal({
    open,
    onClose,
    onDownload,
    recordingReady,
    onSubscriptionActivated
}: DownloadGateModalProps) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [autoDownloaded, setAutoDownloaded] = useState(false);

    useEffect(() => {
        if (!open) {
            setAutoDownloaded(false);
            setMessage(null);
        }
    }, [open]);

    useEffect(() => {
        if (!open || status !== "authenticated" || !session.user.isPremium || !recordingReady || autoDownloaded) {
            return;
        }

        setAutoDownloaded(true);
        onDownload();
        onClose();
    }, [autoDownloaded, onClose, onDownload, open, recordingReady, session?.user.isPremium, status]);

    if (!open) {
        return null;
    }

    const startSubscription = async () => {
        setLoading(true);
        setMessage(null);

        const loaded = await loadRazorpay();
        if (!loaded) {
            setMessage("Payment checkout could not load. Please disable blockers and try again.");
            setLoading(false);
            return;
        }

        const response = await fetch("/api/subscription/create", { method: "POST" });
        const payload = (await response.json()) as SubscriptionResponse & { error?: string };
        if (!response.ok) {
            setMessage(payload.error || "Unable to start the subscription.");
            setLoading(false);
            return;
        }

        const checkout = new window.Razorpay!({
            key: payload.keyId,
            subscription_id: payload.subscriptionId,
            name: "FreeTeleprompter.in",
            description: "Monthly teleprompter downloads",
            prefill: {
                name: session?.user?.name,
                email: session?.user?.email
            },
            theme: { color: "#3b82f6" },
            handler: async (payment) => {
                const verifyResponse = await fetch("/api/subscription/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payment)
                });

                if (!verifyResponse.ok) {
                    setMessage("Payment was received, but verification needs attention. Please contact support.");
                    setLoading(false);
                    return;
                }

                onSubscriptionActivated();
                setLoading(false);
                setMessage("Premium activated. Your download is starting.");
                queueMicrotask(() => {
                    onDownload();
                    onClose();
                });
            },
            modal: {
                ondismiss: () => setLoading(false)
            }
        });

        checkout.open();
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4">
            <div className="glass-panel w-full max-w-xl rounded-[28px] p-5 shadow-float">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Download your teleprompter reel</h2>
                        <p className="mt-1 text-sm text-[var(--text-soft)]">
                            Your first 3 downloads are free. Continue with ₹49/month after that.
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] p-2" aria-label="Close">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {!recordingReady ? (
                    <div className="rounded-[20px] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--text-soft)]">
                        Record a take first, then open the download flow.
                    </div>
                ) : null}

                {status !== "authenticated" ? (
                    <div className="space-y-4">
                        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--text-soft)]">
                            Sign in to receive your 3 free downloads and manage your subscription securely.
                        </div>
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: `${window.location.origin}${window.location.pathname}?payment=1` })}
                            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]"
                        >
                            <GoogleIcon />
                            Sign in with Google
                        </button>
                    </div>
                ) : session.user.isPremium ? (
                    <div className="space-y-4">
                        <div className="rounded-[20px] border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                            Premium is active. Your download is ready.
                        </div>
                        <button type="button" onClick={onDownload} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]">
                            <Download className="h-4 w-4" />
                            Download reel
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                            <div className="flex items-start gap-3">
                                <CreditCard className="mt-0.5 h-5 w-5 text-[var(--accent)]" />
                                <div>
                                    <h3 className="font-semibold">Monthly downloads subscription</h3>
                                    <p className="mt-1 text-sm text-[var(--text-soft)]">
                                        Razorpay securely processes ₹49/month. Billing renews automatically until cancelled.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={startSubscription}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            {loading ? "Opening secure checkout..." : "Start ₹49/month subscription"}
                        </button>
                        <button type="button" onClick={() => signOut()} className="control-chip ml-2 inline-flex items-center gap-2">
                            Switch account
                        </button>
                        {message ? <p className="text-sm text-[var(--text-soft)]">{message}</p> : null}
                    </div>
                )}
            </div>
        </div>
    );
}

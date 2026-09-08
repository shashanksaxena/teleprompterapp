"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { CheckCircle2, CreditCard, Download, Loader2, X } from "lucide-react";
import { GoogleIcon } from "@/components/google-icon";

type Props = { open: boolean; onClose: () => void; onDownload: () => void; recordingReady: boolean; onSubscriptionActivated: () => void };
type Options = { key: string; order_id: string; name: string; description: string; handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void; prefill?: { name?: string | null; email?: string | null }; theme?: { color: string }; modal?: { ondismiss?: () => void } };
declare global { interface Window { Razorpay?: new (options: Options) => { open: () => void } } }

function loadRazorpay() { return new Promise<boolean>((resolve) => { if (window.Razorpay) return resolve(true); const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script); }); }

export function DownloadGateModal({ open, onClose, onDownload, recordingReady, onSubscriptionActivated }: Props) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    if (!open) return null;

    const startPayment = async () => {
        setLoading(true); setMessage(null);
        if (!(await loadRazorpay())) { setMessage("Secure checkout could not load. Please disable blockers and retry."); setLoading(false); return; }
        const response = await fetch("/api/subscription/create", { method: "POST" });
        const payload = (await response.json()) as { keyId?: string; orderId?: string; error?: string };
        if (!response.ok || !payload.keyId || !payload.orderId) { setMessage(payload.error || "Unable to start payment."); setLoading(false); return; }
        const checkout = new window.Razorpay!({
            key: payload.keyId, order_id: payload.orderId, name: "FreeTeleprompter.in", description: "30 days of teleprompter downloads",
            prefill: { name: session?.user?.name, email: session?.user?.email }, theme: { color: "#3b82f6" }, modal: { ondismiss: () => setLoading(false) },
            handler: async (payment) => {
                const verification = await fetch("/api/subscription/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payment) });
                if (!verification.ok) { setMessage("Payment verification failed. Please try again."); setLoading(false); return; }
                onSubscriptionActivated(); setLoading(false); onDownload(); onClose();
            }
        });
        checkout.open();
    };

    return <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4"><div className="glass-panel w-full max-w-xl rounded-[28px] p-5 shadow-float">
        <div className="mb-4 flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">Download your teleprompter reel</h2><p className="mt-1 text-sm text-[var(--text-soft)]">Your first 3 downloads are free. Pay ₹49 once for 30 days. No recurring billing.</p></div><button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] p-2" aria-label="Close"><X className="h-4 w-4" /></button></div>
        {!recordingReady ? <div className="rounded-[20px] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--text-soft)]">Record a take first, then open the download flow.</div> : null}
        {status !== "authenticated" ? <div className="space-y-4"><p className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--text-soft)]">Sign in to receive your 3 free downloads and manage payment access.</p><button type="button" onClick={() => signIn("google", { callbackUrl: window.location.href })} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]"><GoogleIcon />Sign in with Google</button></div> : <div className="space-y-4"><div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4"><div className="flex items-start gap-3"><CreditCard className="mt-0.5 h-5 w-5 text-[var(--accent)]" /><div><h3 className="font-semibold">One-time Premium payment</h3><p className="mt-1 text-sm text-[var(--text-soft)]">Pay ₹49 once for 30 days of Premium downloads.</p></div></div></div><button type="button" onClick={startPayment} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{loading ? "Opening secure checkout..." : "Pay ₹49 for 30 days"}</button>{message ? <p className="text-sm text-rose-500">{message}</p> : null}</div>}
    </div></div>;
}

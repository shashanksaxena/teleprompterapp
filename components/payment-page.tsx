"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type RazorpayOptions = {
    key: string;
    order_id: string;
    name: string;
    description: string;
    handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
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

export function PaymentPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const returnTo = searchParams.get("returnTo")?.startsWith("/") ? searchParams.get("returnTo")! : "/teleprompter-app";

    const signInWithGoogle = async () => {
        setLoading(true);
        const result = await signIn("google", { callbackUrl: window.location.href, redirect: false });
        if (!result?.url) {
            setMessage(result?.error || "Google sign-in could not start. Please refresh and try again.");
            setLoading(false);
            return;
        }
        window.location.assign(result.url);
    };

    const startPayment = async () => {
        setLoading(true);
        setMessage(null);
        if (!(await loadRazorpay())) {
            setMessage("Secure payment checkout could not load. Please disable blockers and retry.");
            setLoading(false);
            return;
        }

        const response = await fetch("/api/subscription/create", { method: "POST" });
        const payload = (await response.json()) as { keyId?: string; orderId?: string; error?: string };
        if (!response.ok || !payload.keyId || !payload.orderId) {
            setMessage(payload.error || "Unable to start the payment.");
            setLoading(false);
            return;
        }

        const checkout = new window.Razorpay!({
            key: payload.keyId,
            order_id: payload.orderId,
            name: "FreeTeleprompter.in",
            description: "30 days of teleprompter downloads",
            prefill: { name: session?.user?.name, email: session?.user?.email },
            theme: { color: "#3b82f6" },
            modal: { ondismiss: () => setLoading(false) },
            handler: async (payment) => {
                const verification = await fetch("/api/subscription/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payment)
                });
                if (!verification.ok) {
                    setMessage("Payment verification failed. Please try again.");
                    setLoading(false);
                    return;
                }
                router.replace(`${returnTo}?payment=success`);
            }
        });
        checkout.open();
    };

    return (
        <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center px-4 py-10">
            <section className="glass-panel w-full rounded-[24px] p-6 md:p-8">
                <p className="section-kicker">Secure checkout</p>
                <h1 className="mt-2 text-3xl font-semibold">Unlock Premium downloads</h1>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                    Your first three downloads are free. Pay ₹49 once for 30 days of Premium access. No recurring billing is set up.
                </p>
                {status !== "authenticated" ? (
                    <button type="button" onClick={signInWithGoogle} disabled={loading} className="cta-primary mt-6 w-full disabled:opacity-60">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {loading ? "Opening Google sign-in..." : "Sign in with Google to continue"}
                    </button>
                ) : (
                    <button type="button" onClick={startPayment} disabled={loading} className="cta-primary mt-6 w-full disabled:opacity-60">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                        {loading ? "Opening secure checkout..." : "Pay ₹49 for 30 days"}
                    </button>
                )}
                {message ? <p className="mt-4 text-sm text-rose-500">{message}</p> : null}
            </section>
        </main>
    );
}

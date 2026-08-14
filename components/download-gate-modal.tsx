"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CheckCircle2, CreditCard, Download, X } from "lucide-react";

import { GoogleIcon } from "@/components/google-icon";

type DownloadGateModalProps = {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
  recordingReady: boolean;
  onSubscriptionActivated: () => void;
};

type PaymentIntentResponse = {
  intentId: string;
  upiUrl: string;
  amountInr: number;
};

export function DownloadGateModal({
  open,
  onClose,
  onDownload,
  recordingReady,
  onSubscriptionActivated
}: DownloadGateModalProps) {
  const { data: session, status } = useSession();
  const [intent, setIntent] = useState<PaymentIntentResponse | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [ackMessage, setAckMessage] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  useEffect(() => {
    if (!open) {
      setAutoDownloaded(false);
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

  useEffect(() => {
    if (!open || status !== "authenticated" || session.user.isPremium) {
      return;
    }

    let cancelled = false;

    async function loadIntent() {
      setLoadingPayment(true);
      setAckMessage(null);

      const response = await fetch("/api/subscription/intent", {
        method: "POST"
      });

      if (!response.ok || cancelled) {
        setLoadingPayment(false);
        return;
      }

      const payload = (await response.json()) as PaymentIntentResponse;
      const { default: QRCode } = await import("qrcode");
      const dataUrl = await QRCode.toDataURL(payload.upiUrl, {
        width: 240,
        margin: 1
      });

      if (!cancelled) {
        setIntent(payload);
        setQrDataUrl(dataUrl);
        setLoadingPayment(false);
      }
    }

    void loadIntent();

    return () => {
      cancelled = true;
    };
  }, [open, session?.user.isPremium, status]);

  if (!open) {
    return null;
  }

  const handleAcknowledge = async () => {
    if (!intent) {
      return;
    }

    const response = await fetch("/api/subscription/acknowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intentId: intent.intentId
      })
    });

    if (response.ok) {
      setAckMessage("Premium activated for one month. Your reel download is starting.");
      onSubscriptionActivated();
      queueMicrotask(() => {
        onDownload();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="glass-panel w-full max-w-xl rounded-[28px] p-5 shadow-float">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Download your teleprompter reel</h2>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Sign in with Google and unlock the ₹99/month download plan.
            </p>
          </div>

          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] p-2">
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
              Google sign-in is required before we can attach scripts, plan status, and payment activity to your MongoDB profile.
            </div>
            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: `${window.location.origin}?payment=1`
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>
        ) : session.user.isPremium ? (
          <div className="space-y-4">
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4 text-sm text-[var(--text-soft)]">
              Premium is active for {session.user.name || "your account"}. Your reel can be downloaded now.
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]"
              >
                <Download className="h-4 w-4" />
                Download reel
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="control-chip inline-flex items-center gap-2"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 text-[var(--accent)]" />
                <div>
                  <h3 className="font-semibold">Premium download plan</h3>
                  <p className="mt-1 text-sm text-[var(--text-soft)]">
                    Scan to pay ₹99 per month. This scanner is configured for `8882897431@ptaxis`, and payment state is stored in MongoDB.
                  </p>
                </div>
              </div>
            </div>

            {loadingPayment ? (
              <div className="rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--text-soft)]">
                Preparing your payment scanner...
              </div>
            ) : qrDataUrl ? (
              <div className="flex flex-col items-center gap-4 rounded-[20px] border border-[var(--border)] bg-white p-4 text-slate-900">
                <img src={qrDataUrl} alt="Premium plan payment QR code" className="h-60 w-60 rounded-xl" />
                <p className="text-center text-sm">
                  Scan this QR with any UPI app to pay ₹{intent?.amountInr ?? 99}/month to `8882897431@ptaxis`.
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAcknowledge}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)]"
                disabled={!intent}
              >
                <CheckCircle2 className="h-4 w-4" />
                I have paid
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="control-chip inline-flex items-center gap-2"
              >
                Switch account
              </button>
            </div>

            {ackMessage ? <p className="text-sm text-emerald-500">{ackMessage}</p> : null}
          </div>
        )}
      </div>
    </div>
  );
}

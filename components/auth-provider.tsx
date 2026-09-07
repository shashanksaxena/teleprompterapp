"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function PresenceHeartbeat() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const sendHeartbeat = () => {
      void fetch("/api/auth/presence", { method: "POST", keepalive: true });
    };

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [status]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PresenceHeartbeat />
      {children}
    </SessionProvider>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentPage } from "@/components/payment-page";

export const metadata: Metadata = {
    title: "Monthly download subscription",
    robots: { index: false, follow: false, noarchive: true }
};

export default function PaymentRoute() {
    return (
        <Suspense fallback={<main className="min-h-[calc(100vh-5rem)]" />}>
            <PaymentPage />
        </Suspense>
    );
}

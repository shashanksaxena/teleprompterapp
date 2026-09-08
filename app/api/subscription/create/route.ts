import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { createServerId, nowIso } from "@/lib/server";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email || session.user.isAdmin) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!keyId || !keySecret || !planId) {
        return NextResponse.json({ error: "Razorpay subscription is not configured." }, { status: 503 });
    }

    const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            plan_id: planId,
            total_count: Number(process.env.RAZORPAY_TOTAL_COUNT || 12),
            quantity: 1,
            customer_notify: 1,
            notes: {
                email: session.user.email,
                product: "FreeTeleprompter.in monthly downloads"
            }
        })
    });

    if (!response.ok) {
        const razorpayError = (await response.json().catch(() => null)) as {
            error?: { description?: string };
        } | null;
        return NextResponse.json(
            { error: razorpayError?.error?.description || "Unable to create the subscription." },
            { status: 502 }
        );
    }

    const subscription = (await response.json()) as { id: string };
    const collection = await getTeleprompterCollection();
    await collection.insertOne({
        kind: "payment_intent",
        intentId: createServerId(),
        provider: "razorpay",
        providerSubscriptionId: subscription.id,
        ownerId: session.user.id,
        email: session.user.email,
        amountInr: 49,
        planName: "Premium",
        status: "created",
        createdAt: nowIso()
    });

    return NextResponse.json({
        keyId,
        subscriptionId: subscription.id,
        amountInr: 49
    });
}

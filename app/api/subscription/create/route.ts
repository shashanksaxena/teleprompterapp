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

    if (!keyId || !keySecret) {
        return NextResponse.json({ error: "Razorpay payment is not configured." }, { status: 503 });
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount: 4900,
            currency: "INR",
            receipt: `teleprompter_${createServerId()}`,
            payment_capture: 1,
            notes: {
                email: session.user.email,
                product: "FreeTeleprompter.in 30-day download access"
            }
        })
    });

    if (!response.ok) {
        const razorpayError = (await response.json().catch(() => null)) as {
            error?: { description?: string };
        } | null;
        return NextResponse.json(
            { error: razorpayError?.error?.description || "Unable to create the payment order." },
            { status: 502 }
        );
    }

    const order = (await response.json()) as { id: string };
    const collection = await getTeleprompterCollection();
    await collection.insertOne({
        kind: "payment_intent",
        intentId: createServerId(),
        provider: "razorpay",
        providerOrderId: order.id,
        ownerId: session.user.id,
        email: session.user.email,
        amountInr: 49,
        planName: "Premium 30-day access",
        status: "created",
        createdAt: nowIso()
    });

    return NextResponse.json({
        keyId,
        orderId: order.id,
        amountInr: 49
    });
}

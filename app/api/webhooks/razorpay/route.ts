import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { getTeleprompterCollection } from "@/lib/mongodb";

export async function POST(request: Request) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = request.headers.get("x-razorpay-signature");
    const rawBody = await request.text();

    if (!secret || !signature) {
        return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
    }

    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const valid = expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!valid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as {
        event?: string;
        payload?: {
            subscription?: { entity?: { id?: string } };
            payment?: { entity?: { subscription_id?: string } };
        };
    };
    const subscriptionId =
        payload.payload?.subscription?.entity?.id ?? payload.payload?.payment?.entity?.subscription_id;

    if (!subscriptionId) {
        return NextResponse.json({ ok: true });
    }

    const activeEvents = new Set(["subscription.activated", "subscription.charged"]);
    const inactiveEvents = new Set(["subscription.cancelled", "subscription.completed", "subscription.halted"]);
    const status = activeEvents.has(payload.event || "") ? "active" : inactiveEvents.has(payload.event || "") ? "inactive" : null;

    if (!status) {
        return NextResponse.json({ ok: true });
    }

    const collection = await getTeleprompterCollection();
    const updatedAt = new Date().toISOString();
    await collection.updateMany(
        { kind: "payment_intent", providerSubscriptionId: subscriptionId },
        { $set: { status, lastWebhookEvent: payload.event, updatedAt } }
    );
    await collection.updateMany(
        { kind: "user", "plan.providerSubscriptionId": subscriptionId },
        {
            $set: {
                "plan.status": status,
                "plan.isPremium": status === "active",
                updatedAt
            }
        }
    );

    return NextResponse.json({ ok: true });
}

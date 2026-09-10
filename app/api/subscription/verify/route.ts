import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { nowIso } from "@/lib/server";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email || session.user.isAdmin) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = (await request.json()) as {
        razorpay_subscription_id?: string;
        razorpay_payment_id?: string;
        razorpay_signature?: string;
    };
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || !body.razorpay_subscription_id || !body.razorpay_payment_id || !body.razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment response." }, { status: 400 });
    }

    const expected = createHmac("sha256", secret)
        .update(`${body.razorpay_payment_id}|${body.razorpay_subscription_id}`)
        .digest("hex");
    const valid = expected.length === body.razorpay_signature.length &&
        timingSafeEqual(Buffer.from(expected), Buffer.from(body.razorpay_signature));

    if (!valid) {
        return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const activatedAt = nowIso();
    const collection = await getTeleprompterCollection();

    await collection.updateOne(
        {
            kind: "payment_intent",
            providerSubscriptionId: body.razorpay_subscription_id,
            ownerId: session.user.id
        },
        {
            $set: {
                status: "active",
                providerPaymentId: body.razorpay_payment_id,
                activatedAt,
                verifiedAt: activatedAt
            }
        }
    );

    await collection.updateOne(
        { kind: "user", email: session.user.email },
        {
            $set: {
                updatedAt: activatedAt,
                plan: {
                    name: "Premium",
                    isPremium: true,
                    priceInr: 49,
                    billingCycle: "monthly",
                    status: "active",
                    activatedAt,
                    provider: "razorpay",
                    providerPaymentId: body.razorpay_payment_id,
                    providerSubscriptionId: body.razorpay_subscription_id
                }
            }
        },
        { upsert: true }
    );

    return NextResponse.json({ ok: true, isPremium: true });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email || session.user.isAdmin) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const collection = await getTeleprompterCollection();
    const user = await collection.findOne<{ plan?: { isPremium?: boolean; expiresAt?: string; status?: string }; downloadCount?: number }>({
        kind: "user",
        email: session.user.email
    });

    const premiumActive = Boolean(
        user?.plan?.isPremium &&
        (user.plan.status === "active" ||
            (user.plan.expiresAt && new Date(user.plan.expiresAt).getTime() > Date.now()))
    );
    if (premiumActive) {
        return NextResponse.json({ allowed: true, source: "subscription", remaining: 0 });
    }

    if (user?.plan?.isPremium) {
        await collection.updateOne({ kind: "user", email: session.user.email }, { $set: { "plan.isPremium": false, "plan.status": "expired", updatedAt: new Date().toISOString() } });
    }

    const downloadCount = Number(user?.downloadCount ?? 0);
    if (downloadCount >= 3) {
        return NextResponse.json(
            { allowed: false, requiresSubscription: true, remaining: 0 },
            { status: 402 }
        );
    }

    const update = await collection.updateOne(
        {
            kind: "user",
            email: session.user.email,
            $or: [{ downloadCount: { $lt: 3 } }, { downloadCount: { $exists: false } }]
        },
        {
            $inc: { downloadCount: 1 },
            $set: { updatedAt: new Date().toISOString() }
        }
    );

    if (!update.modifiedCount) {
        return NextResponse.json({ error: "Please retry the download." }, { status: 409 });
    }

    return NextResponse.json({
        allowed: true,
        source: "free_allowance",
        remaining: Math.max(0, 3 - downloadCount - 1)
    });
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";

export async function POST() {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email || session.user.isAdmin) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    try {
        const collection = await getTeleprompterCollection();
        await collection.updateOne(
            { kind: "user", email },
            { $set: { lastSeenAt: new Date().toISOString() } }
        );
    } catch (error) {
        console.warn("Presence heartbeat skipped because MongoDB is unavailable.", error);
        return NextResponse.json({ ok: false }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
}

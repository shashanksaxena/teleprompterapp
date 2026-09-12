import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { createServerId, nowIso } from "@/lib/server";

export async function POST(request: Request) {
    const body = (await request.json()) as {
        decision?: string;
        promptType?: string;
        source?: string;
        email?: string;
        name?: string;
    };

    const decision = body.decision === "accepted" ? "accepted" : body.decision === "rejected" ? "rejected" : "dismissed";
    const promptType = body.promptType === "google_login" ? "google_login" : "browser_notification";
    const source = body.source?.trim() || "landing_page";

    const session = await getServerSession(authOptions);
    const collection = await getTeleprompterCollection();

    await collection.insertOne({
        kind: "notification_consent",
        id: createServerId(),
        decision,
        promptType,
        source,
        userId: session?.user?.id || null,
        email: (session?.user?.email || body.email || null)?.trim().toLowerCase() || null,
        name: session?.user?.name || body.name || null,
        createdAt: nowIso(),
        updatedAt: nowIso()
    });

    return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { createServerId, nowIso } from "@/lib/server";

export async function POST(request: Request) {
    const body = (await request.json()) as { name?: string; email?: string; phone?: string; subject?: string; message?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!name || !email || !email.includes("@") || !subject || !message || message.length < 10) {
        return NextResponse.json({ error: "Please provide valid contact details and a message." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const timestamp = nowIso();
    const collection = await getTeleprompterCollection();
    await collection.insertOne({
        kind: "contact_lead",
        id: createServerId(),
        name,
        email,
        phone: phone || null,
        subject,
        message,
        userId: session?.user?.id || null,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: "new"
    });

    return NextResponse.json({ ok: true });
}
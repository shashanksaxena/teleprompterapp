import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { createServerId, nowIso } from "@/lib/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collection = await getTeleprompterCollection();
  const intentId = createServerId();
  const amountInr = 99;
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "8882897431@ptaxis";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || "FreeTeleprompter";
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amountInr}&cu=INR&tn=${encodeURIComponent(
    `Premium teleprompter plan ${intentId}`
  )}`;

  await collection.insertOne({
    kind: "payment_intent",
    intentId,
    ownerId: session.user.id,
    email: session.user.email,
    amountInr,
    planName: "Premium",
    upiUrl,
    status: "created",
    createdAt: nowIso()
  });

  return NextResponse.json({
    intentId,
    upiUrl,
    amountInr
  });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { nowIso } from "@/lib/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    intentId: string;
  };

  const collection = await getTeleprompterCollection();
  const activatedAt = nowIso();
  const nextBillingAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await collection.updateOne(
    {
      kind: "payment_intent",
      intentId: body.intentId,
      ownerId: session.user.id
    },
    {
      $set: {
        status: "active",
        acknowledgedAt: activatedAt,
        activatedAt,
        nextBillingAt
      }
    }
  );

  await collection.updateOne(
    {
      kind: "user",
      email: session.user.email
    },
    {
      $set: {
        kind: "user",
        updatedAt: activatedAt,
        plan: {
          name: "Premium",
          isPremium: true,
          priceInr: 99,
          billingCycle: "monthly",
          status: "active",
          activatedAt,
          nextBillingAt,
          paymentHandle: "8882897431@ptaxis"
        }
      }
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, isPremium: true, nextBillingAt });
}

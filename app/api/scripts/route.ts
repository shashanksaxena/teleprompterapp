import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getTeleprompterCollection } from "@/lib/mongodb";
import { createServerId, nowIso } from "@/lib/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const collection = await getTeleprompterCollection();
  const scripts = await collection
    .find({ kind: "script", ownerId: session.user.id })
    .sort({ updatedAt: -1 })
    .toArray();

  return NextResponse.json({
    scripts: scripts.map((script) => ({
      id: script.id,
      title: script.title,
      content: script.content,
      updatedAt: script.updatedAt
    }))
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    title: string;
    content: string;
  };

  const collection = await getTeleprompterCollection();
  const id = body.id || createServerId();
  const timestamp = nowIso();

  await collection.updateOne(
    { kind: "script", id, ownerId: session.user.id },
    {
      $set: {
        kind: "script",
        id,
        ownerId: session.user.id,
        title: body.title,
        content: body.content,
        updatedAt: timestamp
      },
      $setOnInsert: {
        createdAt: timestamp
      }
    },
    { upsert: true }
  );

  return NextResponse.json({
    script: {
      id,
      title: body.title,
      content: body.content,
      updatedAt: timestamp
    }
  });
}

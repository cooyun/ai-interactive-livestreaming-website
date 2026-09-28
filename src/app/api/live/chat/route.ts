import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { liveChatMessages } from "@/db/schema";
import { desc, gt } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const afterId = searchParams.get("afterId");

    let messages;
    if (afterId && !isNaN(Number(afterId))) {
      messages = await db
        .select()
        .from(liveChatMessages)
        .where(gt(liveChatMessages.id, Number(afterId)))
        .orderBy(liveChatMessages.id)
        .limit(50);
    } else {
      // Last 40 messages ordered newest last for chat view
      const recent = await db
        .select()
        .from(liveChatMessages)
        .orderBy(desc(liveChatMessages.id))
        .limit(40);
      messages = recent.reverse();
    }

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

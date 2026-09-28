import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  orders,
  leads,
  affiliates,
  liveStreamSettings,
  aiKnowledgeItems,
  liveChatMessages,
} from "@/db/schema";
import { sanitizeInput } from "@/lib/security";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.id))
      .limit(20);

    const revenueResult = await db
      .select({
        totalRevenue: sql<string>`coalesce(sum(${orders.amount}), 0)`,
        totalOrders: sql<number>`count(*)`,
      })
      .from(orders);

    const leadsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads);

    const affiliatesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(affiliates);

    const [settings] = await db.select().from(liveStreamSettings).limit(1);

    const kbItems = await db
      .select()
      .from(aiKnowledgeItems)
      .orderBy(desc(aiKnowledgeItems.id))
      .limit(10);

    return NextResponse.json({
      success: true,
      metrics: {
        totalRevenue: revenueResult[0]?.totalRevenue || "0.00",
        totalOrders: Number(revenueResult[0]?.totalOrders || 0),
        totalLeads: Number(leadsCount[0]?.count || 0),
        totalAffiliates: Number(affiliatesCount[0]?.count || 0),
      },
      settings,
      recentOrders: allOrders,
      knowledgeBase: kbItems,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load admin metrics";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update_stream") {
      const { activeHost, streamTitle, currentTopic, speechRate } = body;

      const [existing] = await db.select().from(liveStreamSettings).limit(1);
      if (existing) {
        await db
          .update(liveStreamSettings)
          .set({
            activeHost: activeHost === "alex" ? "alex" : "nova",
            streamTitle: sanitizeInput(streamTitle || existing.streamTitle || "", 200),
            currentTopic: sanitizeInput(currentTopic || existing.currentTopic || "", 400),
            speechRate: speechRate ? String(speechRate) : "1.0",
            updatedAt: new Date(),
          })
          .where(eq(liveStreamSettings.id, existing.id));
      }

      return NextResponse.json({ success: true, message: "Stream settings updated" });
    }

    if (action === "broadcast_message") {
      const { message, senderName } = body;
      const cleanMsg = sanitizeInput(message || "", 500);
      if (!cleanMsg) {
        return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
      }

      const [broadcast] = await db
        .insert(liveChatMessages)
        .values({
          senderName: sanitizeInput(senderName || "Host Broadcaster", 40),
          senderAvatar: "📢",
          senderRole: "system",
          message: cleanMsg,
          messageType: "deal_pitch",
          isAiResponse: false,
        })
        .returning();

      return NextResponse.json({ success: true, broadcast });
    }

    if (action === "add_knowledge") {
      const { questionPattern, answerText, topic, triggerKeywords } = body;
      if (!questionPattern || !answerText || !triggerKeywords) {
        return NextResponse.json(
          { success: false, error: "Question, Answer, and Keywords are required" },
          { status: 400 }
        );
      }

      const [newKb] = await db
        .insert(aiKnowledgeItems)
        .values({
          questionPattern: sanitizeInput(questionPattern, 200),
          answerText: sanitizeInput(answerText, 1000),
          topic: sanitizeInput(topic || "custom", 60),
          triggerKeywords: sanitizeInput(triggerKeywords, 300),
          active: true,
        })
        .returning();

      return NextResponse.json({ success: true, knowledgeItem: newKb });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to execute admin action";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

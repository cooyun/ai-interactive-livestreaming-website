import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { liveChatMessages } from "@/db/schema";
import { checkRateLimit, sanitizeInput } from "@/lib/security";
import { generateAiHostResponse } from "@/lib/ai-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Rate limiting: max 20 requests per minute
    const rateLimit = checkRateLimit(ip, 20, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a moment before interacting again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawMessage = body.message || "";
    const rawSender = body.senderName || "Visitor";
    const hostPersona = body.hostPersona === "alex" ? "alex" : "nova";
    const lang = body.lang || "en";
    const giftType = body.giftType || null;
    const isGift = Boolean(giftType);
    const isSuperChat = Boolean(body.isSuperChat);

    const message = sanitizeInput(rawMessage, 400);
    const senderName = sanitizeInput(rawSender, 40) || "Global Guest";

    if (!message && !isGift) {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // Determine message type
    let messageType = "text";
    let giftAmount: string | null = null;
    let senderRole = "visitor";

    if (isGift) {
      messageType = "gift";
      senderRole = "vip";
      if (giftType === "rocket") giftAmount = "9.99";
      else if (giftType === "coffee") giftAmount = "1.99";
      else if (giftType === "diamond") giftAmount = "4.99";
      else if (giftType === "crown") giftAmount = "19.99";
    } else if (isSuperChat) {
      messageType = "superchat";
      senderRole = "vip";
      giftAmount = "4.99";
    }

    // Insert user message into database
    const [insertedUserMsg] = await db
      .insert(liveChatMessages)
      .values({
        senderName,
        senderAvatar: isGift ? "💎" : isSuperChat ? "⭐" : "👤",
        senderRole,
        message: isGift
          ? `Sent ${giftType.toUpperCase()} gift to support the 24/7 AI broadcast! ${message ? `"${message}"` : ""}`
          : message,
        messageType,
        giftType,
        giftAmount,
        isAiResponse: false,
      })
      .returning();

    // Generate AI Host response
    let aiPrompt = message;
    if (isGift) {
      aiPrompt = `Thank you for sending the ${giftType} gift! ${message}`;
    }

    const aiResult = await generateAiHostResponse({
      userMessage: aiPrompt,
      senderName,
      hostPersona,
      lang,
    });

    // Special appreciation if user sent gift/superchat
    let aiText = aiResult.text;
    if (isGift) {
      const giftShoutout =
        lang === "zh"
          ? `🎉 非常感谢 @${senderName} 赠送的豪华礼物【${giftType.toUpperCase()}】！您的支持是我们24小时不间断直播的最大动力！`
          : `🎉 Massive shoutout to @${senderName} for the incredible ${giftType.toUpperCase()} gift! Thank you for backing our 24/7 autonomous broadcast!`;
      aiText = `${giftShoutout} ${aiText}`;
    }

    // Insert AI response into database
    const [insertedAiMsg] = await db
      .insert(liveChatMessages)
      .values({
        senderName: hostPersona === "alex" ? "Alex AI Host" : "Nova AI Host",
        senderAvatar: "🎙️",
        senderRole: "ai_host",
        message: aiText,
        messageType: isGift ? "superchat" : "text",
        isAiResponse: true,
        respondedToId: insertedUserMsg.id,
      })
      .returning();

    return NextResponse.json({
      success: true,
      userMessage: insertedUserMsg,
      aiResponse: insertedAiMsg,
      spokenText: aiText,
      recommendedProduct: aiResult.recommendedProduct,
      actionPrompt: aiResult.actionPrompt,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error handling interaction";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

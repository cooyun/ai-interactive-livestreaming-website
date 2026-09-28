import { NextResponse } from "next/server";
import { db } from "@/db";
import { liveStreamSettings, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settingsList = await db.select().from(liveStreamSettings).limit(1);
    const settings = settingsList[0] || {
      activeHost: "nova",
      streamTitle: "24/7 Global AI Traffic & E-Commerce Live Broadcast",
      currentTopic: "How to Scale Global .COM Traffic from 0 to $10,000/Mo using Autonomous AI Agents",
      voiceEnabled: true,
      speechRate: "1.0",
      welcomeMessage: "Welcome to the 24/7 Live Stream! I am Nova, your interactive AI host.",
      simulatedViewerBase: 1420,
    };

    // Fetch featured deal for the live stream
    let featuredProduct = null;
    try {
      const prods = await db
        .select()
        .from(products)
        .where(eq(products.isFeaturedInLive, true))
        .limit(1);
      if (prods.length > 0) {
        featuredProduct = prods[0];
      } else {
        const anyProd = await db.select().from(products).limit(1);
        featuredProduct = anyProd[0] || null;
      }
    } catch (e) {
      console.error("Error fetching live deal:", e);
    }

    // Add slight realistic jitter to viewer count
    const jitter = Math.floor(Math.sin(Date.now() / 15000) * 45);
    const viewerCount = Math.max(120, (settings.simulatedViewerBase || 1350) + jitter);

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        activeViewers: viewerCount,
        uptimeHours: 247,
        likesCount: 18420 + Math.floor((Date.now() % 100000) / 100),
      },
      featuredDeal: featuredProduct,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

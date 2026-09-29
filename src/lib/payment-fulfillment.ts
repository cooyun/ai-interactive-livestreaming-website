import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { affiliates, orders, liveChatMessages } from "@/db/schema";

export async function finalizePaidOrder({
  orderNumber,
  payerEmail,
}: {
  orderNumber: string;
  payerEmail?: string | null;
}): Promise<{ orderNumber: string; status: string }> {
  const [targetOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!targetOrder) {
    return { orderNumber, status: "not_found" };
  }

  if (targetOrder.status === "completed") {
    return { orderNumber, status: targetOrder.status };
  }

  await db
    .update(orders)
    .set({
      status: "completed",
      customerEmail: payerEmail || targetOrder.customerEmail,
    })
    .where(eq(orders.id, targetOrder.id));

  if (targetOrder.affiliateCode) {
    const [affiliate] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.code, targetOrder.affiliateCode))
      .limit(1);

    if (affiliate) {
      const commissionRate = Number(process.env.AFFILIATE_COMMISSION_RATE || 30);
      const commission = Number(targetOrder.amount || 0) * (commissionRate / 100);

      await db
        .update(affiliates)
        .set({
          totalConversions: sql`${affiliates.totalConversions} + 1`,
          totalEarnings: sql`COALESCE(${affiliates.totalEarnings}, 0) + ${String(commission.toFixed(2))}`,
        })
        .where(eq(affiliates.id, affiliate.id));
    }
  }

  try {
    await db.insert(liveChatMessages).values({
      senderName: "AI Sales Engine",
      senderAvatar: "✅",
      senderRole: "system",
      message: `Payment confirmed for ${targetOrder.productName}. License ${targetOrder.licenseKey} is active and the order was fulfilled.`,
      messageType: "order_toast",
      isAiResponse: false,
    });
  } catch (error) {
    console.error("Failed to insert fulfillment message:", error);
  }

  return { orderNumber, status: "completed" };
}

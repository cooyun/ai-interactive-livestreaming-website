import { NextRequest, NextResponse } from "next/server";
import { createPaypalOrder, isPaypalConfigured } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount ?? 0);
    const currency = typeof body.currency === "string" ? body.currency : "USD";
    const itemName = typeof body.itemName === "string" && body.itemName.trim()
      ? body.itemName.trim()
      : "AI Live Stream Product";
    const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber : undefined;

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: "Valid amount is required." }, { status: 400 });
    }

    if (!isPaypalConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_SECRET to enable live checkout.",
        },
        { status: 503 }
      );
    }

    const effectiveOrderNumber = orderNumber || `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await createPaypalOrder({ amount, currency, itemName, orderNumber: effectiveOrderNumber });
    if (!order) {
      return NextResponse.json({ success: false, error: "Could not create PayPal order." }, { status: 500 });
    }

    const paypalOrder = order as { id?: string; links?: Array<{ rel?: string; href?: string }> };
    const approvalLink = paypalOrder.links?.find((link) => link.rel === "approve")?.href || null;

    return NextResponse.json({
      success: true,
      paypalOrder: {
        id: paypalOrder.id,
        approvalUrl: approvalLink,
        customOrderNumber: effectiveOrderNumber,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create PayPal order.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

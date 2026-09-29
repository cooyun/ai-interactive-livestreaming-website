import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import {
  getOrderStatusFromPaypalEvent,
  isValidPaypalWebhookSignature,
  verifyPaypalWebhookSignature,
} from "@/lib/paypal";
import { finalizePaidOrder } from "@/lib/payment-fulfillment";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers = req.headers;
    const event = JSON.parse(rawBody || "{}");

    const transmissionId = headers.get("paypal-transmission-id");
    const transmissionSig = headers.get("paypal-transmission-sig");
    const timestamp = headers.get("paypal-transmission-time");
    const certUrl = headers.get("paypal-cert-url");
    const eventType = event?.event_type;
    const resource = event?.resource;

    if (!transmissionId || !transmissionSig || !timestamp || !certUrl || !eventType || !resource) {
      return NextResponse.json({ success: false, error: "Invalid PayPal webhook payload." }, { status: 400 });
    }

    const usesOfficialWebhookVerification = Boolean(process.env.PAYPAL_WEBHOOK_ID && process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET);
    let isValid = false;

    if (usesOfficialWebhookVerification) {
      isValid = await verifyPaypalWebhookSignature(headers, event);
    } else if (process.env.PAYPAL_WEBHOOK_SECRET) {
      isValid = isValidPaypalWebhookSignature(rawBody, transmissionSig, process.env.PAYPAL_WEBHOOK_SECRET);
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid PayPal webhook signature." }, { status: 401 });
    }

    const nextStatus = getOrderStatusFromPaypalEvent(eventType);
    const payerEmail = resource?.payer?.email_address || null;
    const paypalOrderId = resource?.id || null;

    if (!nextStatus) {
      return NextResponse.json({ success: true, received: true, ignored: true, eventType });
    }

    const desiredOrderNumber = resource?.custom_id || resource?.invoice_id || null;
    if (desiredOrderNumber) {
      const [targetOrder] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, desiredOrderNumber))
        .limit(1);

      if (targetOrder) {
        await db
          .update(orders)
          .set({
            status: nextStatus,
            customerEmail: payerEmail || targetOrder.customerEmail,
          })
          .where(eq(orders.id, targetOrder.id));
      }
    }

    if (nextStatus === "completed") {
      const orderNumber = (resource?.custom_id || resource?.invoice_id || "") as string;
      if (orderNumber) {
        const fulfillment = await finalizePaidOrder({
          orderNumber,
          payerEmail,
        });

        return NextResponse.json({
          success: true,
          received: true,
          eventType,
          orderStatus: fulfillment.status,
          paypalOrderId,
          payerEmail,
        });
      }
    }

    return NextResponse.json({
      success: true,
      received: true,
      eventType,
      orderStatus: nextStatus,
      paypalOrderId,
      payerEmail,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PayPal webhook failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

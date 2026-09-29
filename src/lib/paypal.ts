import { createHmac } from "node:crypto";
import { buildSiteConfig } from "@/lib/site-config";

export function isPaypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_SECRET);
}

export function getPaypalBaseUrl(): string {
  const mode = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

export function isValidPaypalWebhookSignature(payload: string, signature: string, webhookSecret: string): boolean {
  if (!payload || !signature || !webhookSecret) return false;
  const expected = createHmac("sha256", webhookSecret).update(payload).digest("base64");
  return expected === signature;
}

export function getOrderStatusFromPaypalEvent(eventType?: string): "pending" | "completed" | "cancelled" | null {
  switch (eventType) {
    case "CHECKOUT.ORDER.APPROVED":
    case "PAYMENT.CAPTURE.PENDING":
      return "pending";
    case "PAYMENT.CAPTURE.COMPLETED":
      return "completed";
    case "CHECKOUT.ORDER.CANCELLED":
    case "PAYMENT.CAPTURE.DENIED":
      return "cancelled";
    default:
      return null;
  }
}

export async function createPaypalOrder({
  amount,
  currency = "USD",
  itemName,
  orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
}: {
  amount: number | string;
  currency?: string;
  itemName: string;
  orderNumber?: string;
}) {
  if (!isPaypalConfigured()) {
    return null;
  }

  const { siteUrl, siteName } = buildSiteConfig();
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: orderNumber,
          invoice_id: orderNumber,
          amount: {
            currency_code: currency.toUpperCase(),
            value: String(amount),
          },
          description: itemName,
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: siteName,
            user_action: "PAY_NOW",
            return_url: `${siteUrl}/checkout/return`,
            cancel_url: `${siteUrl}/checkout/cancel`,
          },
        },
      },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal order creation failed: ${response.status} ${text}`);
  }

  return response.json();
}

export async function getPaypalAccessToken(): Promise<string> {
  if (!isPaypalConfigured()) throw new Error("PayPal credentials are not configured.");

  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) throw new Error(`PayPal authentication failed with status ${response.status}.`);
  const data = await response.json() as { access_token?: string };
  if (!data.access_token) throw new Error("PayPal authentication response did not include an access token.");
  return data.access_token;
}

export async function verifyPaypalWebhookSignature(headers: Headers, event: unknown): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId || !isPaypalConfigured()) return false;

  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const transmissionSig = headers.get("paypal-transmission-sig");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");
  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) return false;

  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${getPaypalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: event,
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) return false;
  const result = await response.json() as { verification_status?: string };
  return result.verification_status === "SUCCESS";
}

export async function capturePaypalOrder(paypalOrderId: string) {
  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `capture-${paypalOrderId}`,
    },
    body: "{}",
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const details = await response.json().catch(() => null) as { details?: Array<{ issue?: string }> } | null;
    if (!details?.details?.some((item) => item.issue === "ORDER_ALREADY_CAPTURED")) {
      throw new Error(`PayPal capture failed with status ${response.status}.`);
    }
  }

  if (!response.ok) {
    const getResponse = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(20000),
    });
    if (!getResponse.ok) throw new Error("Unable to verify the previously captured PayPal order.");
    return getResponse.json();
  }

  return response.json();
}

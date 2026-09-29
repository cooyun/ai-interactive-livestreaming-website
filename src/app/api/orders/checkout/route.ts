import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, liveChatMessages } from "@/db/schema";
import { createPaypalOrder, isPaypalConfigured } from "@/lib/paypal";
import { checkRateLimit, sanitizeInput, isValidEmail, generateLicenseKey } from "@/lib/security";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function getCheckoutMode(): "demo" | "paypal" | "disabled" {
  const mode = (process.env.CHECKOUT_MODE || "demo").toLowerCase();
  if (mode === "paypal") return "paypal";
  if (mode === "disabled") return "disabled";
  return "demo";
}

export async function POST(req: NextRequest) {
  try {
    const checkoutMode = getCheckoutMode();

    if (checkoutMode === "disabled") {
      return NextResponse.json(
        { success: false, error: "Checkout is disabled on this deployment." },
        { status: 503 }
      );
    }

    if (process.env.NODE_ENV === "production" && checkoutMode === "demo") {
      return NextResponse.json(
        { success: false, error: "Production checkout requires CHECKOUT_MODE=paypal and valid PayPal credentials." },
        { status: 503 }
      );
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(ip, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many checkout attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { productId, customerName, customerEmail, affiliateCode, country } = body;

    if (!customerEmail || !isValidEmail(customerEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address for instant delivery." },
        { status: 400 }
      );
    }

    if (!customerName || typeof customerName !== "string" || customerName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name is required." },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeInput(customerName, 60);
    const sanitizedEmail = customerEmail.trim().toLowerCase();
    const sanitizedAffiliate = affiliateCode ? sanitizeInput(affiliateCode, 32).toUpperCase() : null;

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(productId)))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "The selected product was not found or has ended." },
        { status: 404 }
      );
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const licenseKey = generateLicenseKey("LIVE");

    let paymentMode = "demo";
    let paymentDetails: Record<string, unknown> | null = null;

    if (checkoutMode === "paypal") {
      if (!isPaypalConfigured()) {
        return NextResponse.json(
          { success: false, error: "PayPal checkout is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_SECRET." },
          { status: 503 }
        );
      }

      const paypalOrder = await createPaypalOrder({
        amount: String(product.price),
        currency: "USD",
        itemName: product.title,
        orderNumber,
      });

      paymentMode = "paypal";
      paymentDetails = paypalOrder ?? null;
    }

    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerEmail: sanitizedEmail,
        customerName: sanitizedName,
        productId: product.id,
        productName: product.title,
        amount: product.price,
        currency: "USD",
        status: paymentMode === "paypal" ? "pending" : "demo",
        affiliateCode: sanitizedAffiliate,
        licenseKey,
      })
      .returning();

    const buyerLocation = sanitizeInput(typeof country === "string" ? country : "USA", 50);
    const maskedName =
      sanitizedName.length > 2
        ? `${sanitizedName[0]}***${sanitizedName[sanitizedName.length - 1]}`
        : sanitizedName;

    try {
      await db.insert(liveChatMessages).values({
        senderName: "AI Sales Engine",
        senderAvatar: "⚡",
        senderRole: "system",
        message: `${paymentMode === "paypal" ? "Checkout request" : "Demo checkout"}: ${maskedName} from ${buyerLocation} initiated a ${paymentMode} purchase for [${product.title}].`,
        messageType: "order_toast",
        isAiResponse: false,
      });
    } catch (e) {
      console.error("Failed to insert checkout chat message:", e);
    }

    const responseMessage =
      paymentMode === "paypal"
        ? "Checkout session created. Complete payment in PayPal to fulfill the order."
        : "Demo order generated. No payment was taken and no email was sent.";

    return NextResponse.json({
      success: true,
      mode: paymentMode,
      order: {
        orderNumber: newOrder.orderNumber,
        productName: newOrder.productName,
        amount: newOrder.amount,
        licenseKey: newOrder.licenseKey,
        customerEmail: newOrder.customerEmail,
        customerName: newOrder.customerName,
        downloadUrl: paymentMode === "paypal" ? "/checkout/return" : "#access-portal",
      },
      payment: paymentDetails,
      message: responseMessage,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Order checkout failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

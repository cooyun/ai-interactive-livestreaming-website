import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, liveChatMessages } from "@/db/schema";
import { checkRateLimit, sanitizeInput, isValidEmail, generateLicenseKey } from "@/lib/security";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production" && process.env.DEMO_CHECKOUT_ENABLED !== "true") {
      return NextResponse.json(
        { success: false, error: "Demo checkout is disabled in production." },
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

    // Find product
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

    // Generate Order Number & License
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const licenseKey = generateLicenseKey("LIVE");

    // Insert order
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
        status: "demo",
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
        message: `Demo checkout: ${maskedName} from ${buyerLocation} generated a preview license for [${product.title}].`,
        messageType: "order_toast",
        isAiResponse: false,
      });
    } catch (e) {
      console.error("Failed to insert demo checkout chat message:", e);
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: newOrder.orderNumber,
        productName: newOrder.productName,
        amount: newOrder.amount,
        licenseKey: newOrder.licenseKey,
        customerEmail: newOrder.customerEmail,
        customerName: newOrder.customerName,
        downloadUrl: "#access-portal",
      },
      message: "Demo order generated. No payment was taken and no email was sent.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Order checkout failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

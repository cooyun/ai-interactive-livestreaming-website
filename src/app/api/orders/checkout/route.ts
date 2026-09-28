import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, liveChatMessages, affiliates } from "@/db/schema";
import { checkRateLimit, sanitizeInput, isValidEmail, generateLicenseKey } from "@/lib/security";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
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
        status: "completed",
        affiliateCode: sanitizedAffiliate,
        licenseKey,
      })
      .returning();

    // Update product sales & decrement stock
    await db
      .update(products)
      .set({
        salesCount: sql`${products.salesCount} + 1`,
        stock: sql`GREATEST(1, ${products.stock} - 1)`,
      })
      .where(eq(products.id, product.id));

    // Handle affiliate commission attribution if valid affiliate code
    if (sanitizedAffiliate) {
      try {
        const commRate = 0.30; // 30% commission
        const commEarned = (Number(product.price) * commRate).toFixed(2);
        await db
          .update(affiliates)
          .set({
            totalConversions: sql`${affiliates.totalConversions} + 1`,
            totalEarnings: sql`${affiliates.totalEarnings} + ${commEarned}`,
          })
          .where(eq(affiliates.code, sanitizedAffiliate));
      } catch (affErr) {
        console.error("Affiliate update error:", affErr);
      }
    }

    // Broadcast toast message to live chat for social proof and excitement
    const buyerLocation = country || "USA";
    const maskedName =
      sanitizedName.length > 2
        ? `${sanitizedName[0]}***${sanitizedName[sanitizedName.length - 1]}`
        : sanitizedName;

    try {
      await db.insert(liveChatMessages).values({
        senderName: "AI Sales Engine",
        senderAvatar: "⚡",
        senderRole: "system",
        message: `🎉 Verified Purchase: ${maskedName} from ${buyerLocation} just unlocked [${product.title}]!`,
        messageType: "order_toast",
        isAiResponse: false,
      });
    } catch (e) {
      console.error("Failed to insert live chat purchase toast:", e);
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
      message: "Order completed successfully! Instant access details generated.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Order checkout failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

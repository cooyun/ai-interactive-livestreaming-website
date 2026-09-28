import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { affiliates } from "@/db/schema";
import { sanitizeInput, isValidEmail } from "@/lib/security";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, preferredCode } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required to receive payout notifications." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = sanitizeInput(name || "Affiliate Partner", 60);

    let cleanCode = sanitizeInput(preferredCode || "", 24)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    if (!cleanCode || cleanCode.length < 3) {
      cleanCode = `REF${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Check if affiliate exists
    const [existing] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.email, cleanEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json({
        success: true,
        affiliate: existing,
        message: "Welcome back! Here is your active affiliate tracking link.",
      });
    }

    // Insert new affiliate
    const [newAffiliate] = await db
      .insert(affiliates)
      .values({
        code: cleanCode,
        affiliateName: cleanName,
        email: cleanEmail,
        totalClicks: 0,
        totalConversions: 0,
        totalEarnings: "0.00",
        tier: "Bronze (30%)",
      })
      .returning();

    return NextResponse.json({
      success: true,
      affiliate: newAffiliate,
      message: "Affiliate account created successfully! You now earn 30% on all referred purchases.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Affiliate registration failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, error: "Code required" }, { status: 400 });
    }

    const [aff] = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.code, code.toUpperCase()))
      .limit(1);

    if (!aff) {
      return NextResponse.json({ success: false, error: "Affiliate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, affiliate: aff });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch affiliate";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.isFeaturedInLive), desc(products.id));

    return NextResponse.json({
      success: true,
      products: allProducts,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to fetch products";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

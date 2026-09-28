import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export function verifyAdminRequest(request: Request): NextResponse | null {
  const configuredToken = process.env.ADMIN_API_TOKEN;
  if (!configuredToken) {
    return NextResponse.json(
      { success: false, error: "Admin access is not configured" },
      { status: 503 }
    );
  }

  const providedToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = Buffer.from(configuredToken);
  const provided = Buffer.from(providedToken);
  const authorized =
    expected.length === provided.length && timingSafeEqual(expected, provided);

  if (!authorized) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}
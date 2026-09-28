/**
 * Security utilities: Rate limiting, input sanitization, and security headers.
 */

// In-memory token bucket rate limiter
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

// Clean up stale entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, bucket] of rateLimitStore.entries()) {
      if (now - bucket.lastRefill > 600000) {
        rateLimitStore.delete(ip);
      }
    }
  }, 600000);
}

/**
 * Rate limits incoming requests per IP or identifier.
 * @param ip User identifier (IP address or session ID)
 * @param maxRequests Maximum requests allowed per window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  ip: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let bucket = rateLimitStore.get(ip);

  if (!bucket) {
    bucket = { tokens: maxRequests - 1, lastRefill: now };
    rateLimitStore.set(ip, bucket);
    return { allowed: true, remaining: bucket.tokens };
  }

  // Refill tokens proportionally
  const elapsed = now - bucket.lastRefill;
  if (elapsed > windowMs) {
    bucket.tokens = maxRequests;
    bucket.lastRefill = now;
  } else {
    const refillTokens = (elapsed / windowMs) * maxRequests;
    bucket.tokens = Math.min(maxRequests, bucket.tokens + refillTokens);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { allowed: true, remaining: Math.floor(bucket.tokens) };
  }

  return { allowed: false, remaining: 0 };
}

/**
 * Sanitizes user input string against XSS attacks and script injections.
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== "string") return "";

  let sanitized = input.trim().slice(0, maxLength);

  // Strip dangerous html script tags, iframe, object, javascript: protocol
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  // Escape basic HTML entities to avoid DOM injection
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return sanitized;
}

/**
 * Sanitizes text for display when unescaping entities.
 */
export function unescapeBasicHtml(escaped: string): string {
  return escaped
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

/**
 * Validates email format strictly
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Generates secure unique order / license tokens
 */
export function generateLicenseKey(prefix = "OMNI"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = (len: number) => {
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `${prefix}-${segment(4)}-${segment(4)}-${segment(4)}`;
}

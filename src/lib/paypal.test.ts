import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";

import { getOrderStatusFromPaypalEvent, isValidPaypalWebhookSignature } from "./paypal";

describe("paypal webhook helpers", () => {
  it("validates the expected HMAC signature", () => {
    const payload = JSON.stringify({ event_type: "CHECKOUT.ORDER.APPROVED", resource: { id: "PP-123" } });
    const secret = "test-secret";
    const signature = createHmac("sha256", secret).update(payload).digest("base64");

    assert.equal(isValidPaypalWebhookSignature(payload, signature, secret), true);
  });

  it("maps PayPal events to ordered states", () => {
    assert.equal(getOrderStatusFromPaypalEvent("CHECKOUT.ORDER.APPROVED"), "pending");
    assert.equal(getOrderStatusFromPaypalEvent("PAYMENT.CAPTURE.COMPLETED"), "completed");
    assert.equal(getOrderStatusFromPaypalEvent("INVOICE.PAID"), null);
  });
});

import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";

const originalEnv = { ...process.env };

describe("site config", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.SITE_URL;
    delete process.env.SITE_NAME;
    delete process.env.SITE_DESCRIPTION;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses environment overrides when present", async () => {
    process.env.SITE_URL = "https://example.com";
    process.env.SITE_NAME = "Example Studio";
    process.env.SITE_DESCRIPTION = "Example marketing description";

    const { buildSiteConfig } = await import("./site-config");
    const config = buildSiteConfig();

    assert.equal(config.siteUrl, "https://example.com");
    assert.equal(config.siteName, "Example Studio");
    assert.equal(config.description, "Example marketing description");
    assert.equal(config.metadataBase.toString(), "https://example.com/");
  });

  it("falls back to safe defaults", async () => {
    const { buildSiteConfig } = await import("./site-config");
    const config = buildSiteConfig();

    assert.equal(config.siteUrl, "https://globalomni.com");
    assert.match(config.siteName, /GlobalOmni/i);
    assert.ok(config.description.length > 20);
  });
});

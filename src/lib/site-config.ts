export type SiteConfig = {
  siteUrl: string;
  siteName: string;
  description: string;
  metadataBase: URL;
  openGraphUrl: string;
};

const DEFAULT_SITE_URL = "https://globalomni.com";
const DEFAULT_SITE_NAME = "GlobalOmni AI™ - 24/7 AI Live Stream & Traffic Engine";
const DEFAULT_DESCRIPTION =
  "Turn your international .COM domain into a high-converting automated traffic and monetization machine with 24/7 AI live streaming, flash deals, and affiliate growth loops.";

function normalizeUrl(value: string | undefined, fallback: string): string {
  const candidate = (value || fallback).trim();
  if (!candidate) return fallback;

  if (/^https?:\/\//i.test(candidate)) {
    return candidate.replace(/\/+$/, "");
  }

  return `https://${candidate.replace(/\/+$/, "")}`;
}

export function buildSiteConfig(): SiteConfig {
  const siteUrl = normalizeUrl(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL, DEFAULT_SITE_URL);
  const siteName = process.env.SITE_NAME || DEFAULT_SITE_NAME;
  const description = process.env.SITE_DESCRIPTION || DEFAULT_DESCRIPTION;

  return {
    siteUrl,
    siteName,
    description,
    metadataBase: new URL(siteUrl),
    openGraphUrl: siteUrl,
  };
}

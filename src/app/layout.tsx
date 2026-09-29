import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildSiteConfig } from "@/lib/site-config";
import "./globals.css";

const siteConfig = buildSiteConfig();

export const metadata: Metadata = {
  metadataBase: siteConfig.metadataBase,
  title: siteConfig.siteName,
  description: siteConfig.description,
  keywords: [
    "AI live stream",
    "24/7 virtual streamer",
    "domain monetization",
    "international domain traffic",
    "AI marketing automation",
    "programmatic SEO",
    "digital commerce",
  ],
  authors: [{ name: "GlobalOmni AI Architecture" }],
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: siteConfig.openGraphUrl,
    siteName: siteConfig.siteName,
    images: [
      {
        url: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
        width: 1200,
        height: 630,
        alt: "24/7 AI Live Streamer Nova",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: ["https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}

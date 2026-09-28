import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://globalomni.com"),
  title: "GlobalOmni AI™ - 24/7 Autonomous AI Live Stream & Global Traffic Engine",
  description:
    "Turn your international .COM domain into a high-converting automated traffic and monetization machine. Features 24/7 interactive real-time AI live streaming, free viral AI tools, flash deals, and 30%-50% affiliate growth loops.",
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
    title: "GlobalOmni AI™ - 24/7 AI Live Stream & Traffic Monetization",
    description:
      "24/7 interactive digital human livestreaming round the clock. Ask any question in chat and grab limited flash deals.",
    url: "https://globalomni.com",
    siteName: "GlobalOmni AI",
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
    title: "GlobalOmni AI™ - 24/7 AI Live Stream & Traffic Engine",
    description:
      "Autonomous 24/7 AI live streaming, viral traffic tools & instant digital monetization for global domains.",
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

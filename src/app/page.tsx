"use client";

import React, { useState, useEffect } from "react";
import { SupportedLang, translations } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { LiveRoomSection } from "@/components/LiveRoomSection";
import { FreeToolsSection } from "@/components/FreeToolsSection";
import { FlashDealsSection, ProductItem } from "@/components/FlashDealsSection";
import { PricingSection } from "@/components/PricingSection";
import { AffiliateSection } from "@/components/AffiliateSection";
import { StrategyRoadmapSection } from "@/components/StrategyRoadmapSection";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AdminControlModal } from "@/components/AdminControlModal";
import { Footer } from "@/components/Footer";
import { Radio, Zap, Sparkles, ArrowRight, ShieldCheck, Flame, Users, TrendingUp } from "lucide-react";

export default function HomePage() {
  const [currentLang, setCurrentLang] = useState<SupportedLang>("zh"); // Default Chinese as requested by prompt, toggleable to EN/ES/JA
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<ProductItem | null>(null);
  const [activeViewers, setActiveViewers] = useState<number>(1428);
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const t = translations[currentLang].hero;

  // Fetch products & stream info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, streamRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/live/stream"),
        ]);

        const prodData = await prodRes.json();
        if (prodData.success && prodData.products) {
          setProducts(prodData.products);
          const featured = prodData.products.find((p: ProductItem) => p.isFeaturedInLive);
          setFeaturedProduct(featured || prodData.products[0]);
        }

        const streamData = await streamRes.json();
        if (streamData.success && streamData.settings) {
          setActiveViewers(streamData.settings.activeViewers || 1428);
        }
      } catch (err) {
        console.error("Data load err:", err);
      }
    };

    fetchData();
  }, []);

  const handleOpenCheckout = (product: any) => {
    setSelectedProductForCheckout(product);
    setIsCheckoutOpen(true);
  };

  const handleJumpToLive = (promptText?: string) => {
    const liveEl = document.getElementById("live-room");
    if (liveEl) {
      liveEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeViewers={activeViewers}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/20 to-fuchsia-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Live Badge Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg mb-6 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-bold text-rose-400 tracking-wide uppercase">
            {t.liveBadge}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-300 font-mono">
            {activeViewers.toLocaleString()} {t.viewersOnline}
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          <span>{t.headlinePrefix} </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
            {t.headlineHighlight}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-5 text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {t.subheadline}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#live-room"
            className="px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-rose-500 via-indigo-600 to-cyan-500 hover:from-rose-400 hover:via-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition-all active:scale-95 group"
          >
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <span>{t.ctaPrimary}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#free-tools"
            className="px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-lg flex items-center gap-2 transition-all hover:text-white"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t.ctaSecondary}</span>
          </a>
        </div>

        {/* Live Social Proof Highlights */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left text-xs text-slate-400 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎙️</span>
            <div>
              <span className="font-bold text-white block">24/7 AI Host</span>
              <span className="text-[11px] text-slate-400">Web Speech Voice</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚡</span>
            <div>
              <span className="font-bold text-white block">Instant Flash Deals</span>
              <span className="text-[11px] text-slate-400">85% OFF Catalog</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🤝</span>
            <div>
              <span className="font-bold text-white block">30% - 50% Affiliate</span>
              <span className="text-[11px] text-slate-400">Viral Referrals</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛡️</span>
            <div>
              <span className="font-bold text-white block">30-Day Guarantee</span>
              <span className="text-[11px] text-slate-400">100% Full Refund</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="flex-1 space-y-16">
        {/* 1. 24/7 AI Live Stream Room */}
        <LiveRoomSection
          currentLang={currentLang}
          onOpenCheckout={handleOpenCheckout}
          featuredProduct={featuredProduct}
        />

        {/* 2. Free Viral AI Traffic Tools Hub */}
        <FreeToolsSection
          currentLang={currentLang}
          onJumpToLive={handleJumpToLive}
        />

        {/* 3. Limited-Time Flash Deals Catalog */}
        <FlashDealsSection
          currentLang={currentLang}
          products={products}
          onOpenCheckout={handleOpenCheckout}
        />

        {/* 4. Strategic 0-to-10K Roadmap for Domain Builders */}
        <StrategyRoadmapSection currentLang={currentLang} />

        {/* 5. 30%-50% Viral Affiliate Machine */}
        <AffiliateSection currentLang={currentLang} />

        {/* 6. Pricing & SaaS Subscription Matrix */}
        <PricingSection
          currentLang={currentLang}
          onOpenCheckout={handleOpenCheckout}
        />
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        product={selectedProductForCheckout}
        onClose={() => setIsCheckoutOpen(false)}
        currentLang={currentLang}
      />

      {/* Admin / Host Control Center Modal */}
      <AdminControlModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SupportedLang, translations } from "@/lib/i18n";
import { triggerConfetti } from "@/lib/confetti";
import {
  Flame,
  Check,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Star,
  Award,
  Sparkles,
  Lock,
} from "lucide-react";

export interface ProductItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  originalPrice: string;
  badge?: string | null;
  features: string; // JSON array
  category?: string | null;
  stock?: number | null;
  salesCount?: number | null;
  isFeaturedInLive?: boolean | null;
  imageUrl?: string | null;
}

interface FlashDealsSectionProps {
  currentLang: SupportedLang;
  products: ProductItem[];
  onOpenCheckout: (product: ProductItem) => void;
}

export function FlashDealsSection({
  currentLang,
  products,
  onOpenCheckout,
}: FlashDealsSectionProps) {
  const t = translations[currentLang].deals;
  const isZh = currentLang === "zh";

  // Countdown timer for live urgency
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 1,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 15, seconds: 0 }; // reset loop
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n: number) => n.toString().padStart(2, "0");

  return (
    <section id="flash-deals" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header with Live Urgency Countdown */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-2 text-slate-400 text-base max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-3 bg-slate-900 border border-rose-500/30 p-3 sm:px-5 rounded-2xl shadow-xl shadow-rose-950/20 shrink-0">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {t.countdownLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-lg sm:text-xl font-black text-white">
            <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-rose-400">
              {formatDigits(timeLeft.hours)}
            </span>
            <span>:</span>
            <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-rose-400">
              {formatDigits(timeLeft.minutes)}
            </span>
            <span>:</span>
            <span className="bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-rose-400">
              {formatDigits(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          let parsedFeatures: string[] = [];
          try {
            parsedFeatures = JSON.parse(product.features);
          } catch {
            parsedFeatures = product.features.split(",");
          }

          const discountPercent = Math.round(
            ((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100
          );

          const isFeatured = Boolean(product.isFeaturedInLive);

          return (
            <div
              key={product.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isFeatured
                  ? "bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-950 border-2 border-indigo-500/60 shadow-2xl shadow-indigo-500/10"
                  : "bg-slate-900/60 border border-slate-800 hover:border-slate-700 shadow-xl"
              }`}
            >
              {/* Top Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase ${
                      isFeatured
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                        : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {product.badge || "PRO"}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    SAVE {discountPercent}%
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white tracking-tight line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Pricing Block */}
                <div className="mt-5 pb-5 border-b border-slate-800/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white tracking-tight">
                      ${product.price}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">USD</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span>
                      🔥 {product.salesCount || 842} {t.soldCount}
                    </span>
                    <span className="text-rose-400 font-medium">
                      ⚡ {product.stock || 6} {t.stockLeft}
                    </span>
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                  {parsedFeatures.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button & Trust Seal */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => {
                    triggerConfetti();
                    onOpenCheckout(product);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    isFeatured
                      ? "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-lg shadow-orange-500/25"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.buyNow}</span>
                </button>

                <p className="mt-2.5 text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.guarantee}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

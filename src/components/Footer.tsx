"use client";

import React from "react";
import { SupportedLang } from "@/lib/i18n";
import { ShieldCheck, Lock, Sparkles, Radio, Award } from "lucide-react";

interface FooterProps {
  currentLang: SupportedLang;
  onOpenAdmin: () => void;
}

export function Footer({ currentLang, onOpenAdmin }: FooterProps) {
  const isZh = currentLang === "zh";

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">30-Day Guarantee</span>
              <span className="text-slate-400 text-[11px]">100% Risk-Free Refund</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">256-Bit SSL</span>
              <span className="text-slate-400 text-[11px]">Bank-Grade Security</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white block">24/7 AI Host</span>
              <span className="text-slate-400 text-[11px]">Real-Time Interaction</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block">Global .COM Ready</span>
              <span className="text-slate-400 text-[11px]">Multi-Currency Payouts</span>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 border-t border-slate-900 pt-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">GLOBAL OMNI .COM</span>
            <span>— {isZh ? "国际域名全自动流量变现引擎" : "Autonomous Traffic & Monetization Architecture"}</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#live-room" className="hover:text-white transition-colors">
              {isZh ? "24小时AI直播" : "AI Live Stream"}
            </a>
            <a href="#free-tools" className="hover:text-white transition-colors">
              {isZh ? "免费AI工具" : "Free Tools"}
            </a>
            <a href="#flash-deals" className="hover:text-white transition-colors">
              {isZh ? "限时特惠" : "Flash Deals"}
            </a>
            <a href="#affiliate" className="hover:text-white transition-colors">
              {isZh ? "30%分销联盟" : "30% Affiliate"}
            </a>
            <button
              onClick={onOpenAdmin}
              className="text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              {isZh ? "主播控制台" : "Host Console"}
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} GlobalOmni.com. All rights reserved. Designed with Next.js 15, PostgreSQL & Web Speech AI.
        </div>
      </div>
    </footer>
  );
}

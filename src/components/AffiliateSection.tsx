"use client";

import React, { useState } from "react";
import { SupportedLang, translations } from "@/lib/i18n";
import { triggerConfetti } from "@/lib/confetti";
import {
  Users,
  Copy,
  Check,
  DollarSign,
  Award,
  Sparkles,
  TrendingUp,
  Share2,
  ArrowRight,
} from "lucide-react";

interface AffiliateSectionProps {
  currentLang: SupportedLang;
}

export function AffiliateSection({ currentLang }: AffiliateSectionProps) {
  const t = translations[currentLang].affiliate;
  const isZh = currentLang === "zh";

  const [referralCount, setReferralCount] = useState<number>(25);
  const [affiliateName, setAffiliateName] = useState<string>("");
  const [affiliateEmail, setAffiliateEmail] = useState<string>("");
  const [preferredCode, setPreferredCode] = useState<string>("");
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate projected passive income
  const avgOrderValue = 49;
  const commissionRate = referralCount >= 80 ? 0.5 : referralCount >= 40 ? 0.4 : referralCount >= 20 ? 0.35 : 0.3;
  const estimatedMonthlyEarnings = (referralCount * avgOrderValue * commissionRate).toFixed(0);

  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: affiliateName || "Partner",
          email: affiliateEmail,
          preferredCode: preferredCode || "VIP",
        }),
      });

      const data = await res.json();
      if (data.success && data.affiliate) {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://globalomni.com";
        setGeneratedLink(`${origin}?ref=${data.affiliate.code}`);
        triggerConfetti();
      } else {
        alert(data.error || "Failed to generate link");
      }
    } catch (err) {
      console.error("Affiliate err:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="affiliate" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.title}
        </h2>
        <p className="mt-3 text-slate-400 text-base sm:text-lg">
          {t.subtitle}
        </p>
      </div>

      {/* Main Affiliate Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Interactive Passive Income Calculator (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {t.calculatorTitle}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Tier: {(commissionRate * 100).toFixed(0)}% Commission
              </span>
            </div>

            {/* Referral Slider */}
            <div className="mt-6">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-300 mb-2">
                <span>{t.sliderLabel}</span>
                <span className="text-xl font-black text-white font-mono">{referralCount} customers/mo</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={referralCount}
                onChange={(e) => setReferralCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                <span>5 / month</span>
                <span>50 / month</span>
                <span>150+ / month</span>
              </div>
            </div>

            {/* Payout Forecast Display */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-950 border border-emerald-500/40 shadow-inner">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">
                {t.estimatedEarnings}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                  ${estimatedMonthlyEarnings}
                </span>
                <span className="text-slate-400 text-sm font-semibold">USD / month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {isZh
                  ? "以客单价 $49 计算。佣金每周自动结算，支持无门槛即时提现至 Stripe / PayPal。"
                  : "Based on $49 average order value. Weekly automated payouts directly to your account."}
              </p>
            </div>
          </div>

          {/* Tier Milestones */}
          <div className="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-slate-800 text-center">
            {[
              { tier: "Bronze", rate: "30%", color: "text-amber-600" },
              { tier: "Silver", rate: "35%", color: "text-slate-300" },
              { tier: "Gold", rate: "40%", color: "text-amber-400" },
              { tier: "Diamond", rate: "50%", color: "text-cyan-400" },
            ].map((item) => (
              <div key={item.tier} className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                <span className={`text-[10px] font-bold block uppercase ${item.color}`}>
                  {item.tier}
                </span>
                <span className="text-xs font-black text-white">{item.rate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Generate Tracking Link & Register (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">{t.joinAffiliateBtn}</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              {isZh
                ? "输入您的信息，即可免费生成专属分销追踪链接。分享给您的社交媒体、自媒体粉丝或站长社群，即可享有终身客户绑定分成！"
                : "Create your unique tracking link. Share on YouTube, TikTok, X, or email lists to earn 30%+ lifetime recurring royalties."}
            </p>

            <form onSubmit={handleCreateAffiliate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {isZh ? "您的姓名 / 团队昵称" : "Your Name / Brand"}
                </label>
                <input
                  type="text"
                  value={affiliateName}
                  onChange={(e) => setAffiliateName(e.target.value)}
                  placeholder={isZh ? "例如：张增长 / TechMarketer" : "e.g. David Miller"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {isZh ? "结算提现邮箱 (PayPal / Stripe)" : "Payout Email (PayPal or Stripe)"}
                </label>
                <input
                  type="email"
                  required
                  value={affiliateEmail}
                  onChange={(e) => setAffiliateEmail(e.target.value)}
                  placeholder="payout@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {t.codePrompt}
                </label>
                <input
                  type="text"
                  value={preferredCode}
                  onChange={(e) => setPreferredCode(e.target.value)}
                  placeholder="GROWTH2026"
                  maxLength={16}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>{t.generateLink}</span>
              </button>
            </form>
          </div>

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="mt-6 pt-5 border-t border-slate-800 animate-fadeIn">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                {t.yourLink}
              </span>
              <div className="flex items-center justify-between bg-slate-950 border border-emerald-500/40 rounded-xl p-2.5">
                <span className="text-xs text-white font-mono truncate mr-2">{generatedLink}</span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

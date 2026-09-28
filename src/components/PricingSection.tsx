"use client";

import React, { useState } from "react";
import { SupportedLang } from "@/lib/i18n";
import { triggerConfetti } from "@/lib/confetti";
import { Check, Sparkles, HelpCircle, ChevronDown, ShieldCheck, Zap } from "lucide-react";

interface PricingSectionProps {
  currentLang: SupportedLang;
  onOpenCheckout: (product: any) => void;
}

export function PricingSection({ currentLang, onOpenCheckout }: PricingSectionProps) {
  const isZh = currentLang === "zh";
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: isZh ? "基础体验版" : "Starter Discovery",
      price: "0",
      description: isZh
        ? "适合刚购入域名的个人站长体验AI引流工具与直播间互动"
        : "Perfect for testing free AI tools and participating in the live community.",
      features: isZh
        ? [
            "24小时AI直播间无限制实时互动",
            "4款免费AI引流工具（每日5次生成）",
            "基础SEO元数据与关键词建议",
            "30% 分销裂变推广资格",
          ]
        : [
            "Unlimited access to 24/7 AI live room",
            "Free viral AI tools (5 generations/day)",
            "Basic SEO title & meta generation",
            "Standard 30% affiliate program rights",
          ],
      cta: isZh ? "免费使用" : "Get Started Free",
      popular: false,
    },
    {
      name: isZh ? "增长专业版" : "Growth Pro",
      price: billingCycle === "monthly" ? "29" : "24",
      period: isZh ? "/月" : "/mo",
      description: isZh
        ? "专为需要快速突破0流量、搭建全自动获客管道的独立站长设计"
        : "Built for serious site builders scaling from zero traffic to steady cashflow.",
      features: isZh
        ? [
            "包含全部基础功能",
            "无限次生成爆款脚本与多语言SEO元数据",
            "OmniTraffic AI™ 全球自动索引算法授权",
            "直播间专属VIP皇冠徽章与弹幕优先回答",
            "35% 阶梯分销佣金",
            "每周全球高转化关键词与热点库推送",
          ]
        : [
            "Everything in Starter Discovery",
            "Unlimited viral video scripts & multilingual SEO",
            "OmniTraffic AI™ indexing algorithm license",
            "VIP badge in live room + prioritized host answers",
            "Elevated 35% tier affiliate commissions",
            "Weekly curated high-intent buyer keywords",
          ],
      cta: isZh ? "立即升级 Pro" : "Upgrade to Pro",
      popular: true,
    },
    {
      name: isZh ? "企业旗舰版" : "Enterprise Sovereign",
      price: billingCycle === "monthly" ? "99" : "79",
      period: isZh ? "/月" : "/mo",
      description: isZh
        ? "为您的域名私有化部署同款24小时AI数字人实时直播系统"
        : "Turnkey private deployment of this 24/7 AI live host system on your domain.",
      features: isZh
        ? [
            "包含全部 Pro 功能",
            "私有化部署 24/7 AI 数字人直播间源码与引擎",
            "自定义数字人形象与多语言声音模型",
            "自主知识库与商品闪购一键挂载",
            "最高 50% 顶配分销佣金比例",
            "专属技术团队 1对1 架构协助与支持",
          ]
        : [
            "Everything in Growth Pro",
            "Turnkey 24/7 AI Live Streamer source code & engine",
            "Custom digital human avatars & multilingual voice",
            "Custom knowledge base & flash deal commerce integration",
            "Maximum 50% tier affiliate commission rates",
            "Dedicated engineering team 1-on-1 deployment support",
          ],
      cta: isZh ? "部署专属AI直播" : "Deploy Sovereign AI",
      popular: false,
    },
  ];

  const faqs = isZh
    ? [
        {
          q: "我的国际.COM域名刚注册，完全没有流量，能用这套系统吗？",
          a: "完全可以！本系统专为0流量新域名设计。传统建站需要等待漫长SEO收录，而通过我们的24小时AI数字人直播+免费高价值引流工具+社交裂变闭环，可以在第一周迅速吸引首批精准海外访客并促成转化。",
        },
        {
          q: "24小时AI实时直播需要我自己在电脑前一直开着吗？",
          a: "不需要！AI数字人主播是运行在云端服务器上的自主智能体，能够根据知识库与商品目录自动回答访客咨询、播报限时折扣、处理打赏与订单，实现365天全自动无人值守。",
        },
        {
          q: "真的有30天退款保障吗？支持哪些支付方式？",
          a: "是的！我们提供30天100%全额无理由退款保证。支持Visa、Mastercard、PayPal以及全球主流货币结算，保障您的投资零风险。",
        },
        {
          q: "分销裂变计划是如何结算的？",
          a: "任何访客或用户都可以免费申请专属分销链接。每当有人通过您的链接购买任何数字化产品或订阅服务，系统自动结算30%~50%的佣金，每周通过Stripe或PayPal准时结算到账。",
        },
      ]
    : [
        {
          q: "Can this work on a brand new .com domain with zero backlinks?",
          a: "Yes! The architecture is specifically optimized for zero-to-one domain launches. Instead of waiting months for conventional SEO, the 24/7 AI live host and viral free utility tools capture and convert social and organic discovery traffic within days.",
        },
        {
          q: "Do I need to keep my computer running for the 24/7 AI live stream?",
          a: "No! The digital human host runs fully autonomous in the cloud. It monitors chats, speaks via speech synthesis, and handles sales pitches 24/7 without any human intervention required.",
        },
        {
          q: "What is your refund policy?",
          a: "We offer an unconditional 30-day 100% money-back guarantee. If you are not satisfied with your results, simply request a refund and you will be refunded promptly.",
        },
        {
          q: "How are affiliate commissions paid?",
          a: "Affiliates earn 30% to 50% recurring commissions on all referred sales. Payouts are distributed weekly directly to your PayPal or Stripe account with no minimum threshold.",
        },
      ];

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isZh ? "灵活方案与投资回报" : "Transparent Pricing & ROI"}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {isZh ? "选择契合您域名规模的增长方案" : "Scalable Plans for High-Velocity Growth"}
        </h2>
        <p className="mt-3 text-slate-400 text-base">
          {isZh
            ? "无论是个人测试还是企业规模化变现，皆可随时升级或降级"
            : "From initial validation to enterprise sovereign streaming infrastructure."}
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="mt-6 inline-flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isZh ? "按月订阅" : "Monthly Billing"}
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>{isZh ? "按年订阅" : "Annual (Save 20%)"}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? "bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 relative"
                : "bg-slate-900/50 border border-slate-800"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                {isZh ? "最受站长欢迎" : "Most Popular"}
              </span>
            )}

            <div>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{plan.description}</p>

              <div className="mt-5 pb-5 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                  <span className="text-xs text-slate-500 font-mono ml-1">USD</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => {
                  triggerConfetti();
                  onOpenCheckout({
                    id: 100 + idx,
                    title: `${plan.name} (${billingCycle})`,
                    price: plan.price === "0" ? "0.00" : plan.price,
                    originalPrice: String(Number(plan.price) * 1.5 || 49),
                  });
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                  plan.popular
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                <span>{plan.cta}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">
            {isZh ? "常见疑问与解答 (FAQ)" : "Frequently Asked Questions"}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

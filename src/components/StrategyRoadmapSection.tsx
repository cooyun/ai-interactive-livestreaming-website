"use client";

import React from "react";
import { SupportedLang, translations } from "@/lib/i18n";
import {
  Compass,
  Zap,
  Radio,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from "lucide-react";

interface StrategyRoadmapProps {
  currentLang: SupportedLang;
}

export function StrategyRoadmapSection({ currentLang }: StrategyRoadmapProps) {
  const t = translations[currentLang].strategy;
  const isZh = currentLang === "zh";

  const stages = isZh
    ? [
        {
          stage: "第 1 阶段",
          title: "零成本冷启动：免费AI高意向引流工具矩阵",
          desc: "全新国际.COM域名在初期没有外链与历史权重。通过免费提供短视频脚本生成、SEO元标签生成等高频工具，可以快速被Google、Bing收录，并在TikTok/Twitter等社群形成自然的口碑收藏与自发反向链接。",
          icon: Zap,
          tag: "解决流量来源",
          metric: "7-14天突破首批500-2,000自然日访客",
        },
        {
          stage: "第 2 阶段",
          title: "信任爆发点：24小时AI数字人实时直播承接",
          desc: "普通冷访客跳出率高达80%，但当他们进入网站看到的是一个24小时不打烊、能实时语音交流与解答疑问的AI数字人主播时，平均停留时长大幅延长350%！通过实时弹幕互动，瞬间拉满信任度与科技感。",
          icon: Radio,
          tag: "解决访客留存与互动",
          metric: "访客停留时间从15秒延长至4分30秒",
        },
        {
          stage: "第 3 阶段",
          title: "即时变现：直播专属闪购与数字化高毛利产品",
          desc: "避开传统实物发货的高库存与长物流。直接在直播间右下方挂载1.5折限时闪购数字化套件（如OmniTraffic AI），通过倒计时紧迫感与一键秒级出码交付，使每100个进入直播间的访客产生3-5单即时现金流。",
          icon: ShoppingBag,
          tag: "解决盈利闭环",
          metric: "客单价 $29 - $199，毛利率高达 95%+",
        },
        {
          stage: "第 4 阶段",
          title: "病毒裂变与被动复利：30%-50%全球分销计划",
          desc: "为每一位到访者和购买者赋予免费分销商身份，提供独一无二的邀请短链接。借助高额终身佣金驱动站长社群在Reddit、YouTube、论坛为您免费带货推广，彻底摆脱付费买量依赖，实现滚雪球复利增长。",
          icon: TrendingUp,
          tag: "解决规模化复利",
          metric: "每个老客户带来平均1.8个新付费用户",
        },
      ]
    : [
        {
          stage: "Stage 1",
          title: "Zero-Cost Cold Start: High-Intent Free Utility Hub",
          desc: "New international .com domains have zero domain rating. Providing free, high-utility tools (viral video hook generators, SEO meta optimizers) triggers rapid Google indexation and organic bookmarks on Reddit, X, and IndieHackers.",
          icon: Zap,
          tag: "Traffic Generation",
          metric: "500 - 2,000 initial organic visitors in 7-14 days",
        },
        {
          stage: "Stage 2",
          title: "Instant Trust Engine: 24/7 AI Live Stream Broadcaster",
          desc: "Cold web visitors bounce in seconds. Welcoming them with an active, autonomous AI streamer who greets them and answers questions live spikes session duration by 350% and dissolves cold purchasing resistance.",
          icon: Radio,
          tag: "Visitor Retention & Engagement",
          metric: "Session duration surges from 15s to 4.5+ minutes",
        },
        {
          stage: "Stage 3",
          title: "High-Margin Cashflow: Instant Live Digital Commerce",
          desc: "Bypass physical shipping headaches. Pitch 85% OFF digital software and growth suites directly on the live deck with automated license key generation upon checkout, converting 3-5% of live visitors into direct cash.",
          icon: ShoppingBag,
          tag: "Monetization Conversion",
          metric: "$29 - $199 AOV with 95%+ net profit margins",
        },
        {
          stage: "Stage 4",
          title: "Exponential Scale: 30%-50% Global Affiliate Flywheel",
          desc: "Equip every visitor and customer with a 1-click referral link. Generous weekly recurring commissions incentivize influencers and webmasters worldwide to syndicate your domain across social networks for free.",
          icon: TrendingUp,
          tag: "Viral Compounding",
          metric: "1.8x viral coefficient per active partner",
        },
      ];

  return (
    <section id="playbook" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.title}
        </h2>
        <p className="mt-3 text-slate-400 text-base sm:text-lg">
          {t.subtitle}
        </p>
      </div>

      {/* 4 Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 relative group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {stg.stage}
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                    {stg.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {stg.title}
                </h3>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  {stg.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  {isZh ? "预期关键成果" : "Target Metric"}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {stg.metric}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

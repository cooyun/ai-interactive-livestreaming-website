import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { checkRateLimit, sanitizeInput, isValidEmail } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    const rateLimit = checkRateLimit(ip, 25, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Rate limit reached. Please wait 1 minute before generating again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { toolType, niche, audience, email, lang } = body;

    const cleanNiche = sanitizeInput(niche || "digital tools & AI SaaS", 120);
    const cleanAudience = sanitizeInput(audience || "entrepreneurs & online creators", 120);
    const isZh = lang === "zh" || /[\u4e00-\u9fa5]/.test(cleanNiche);

    // Save lead if email provided
    if (email && isValidEmail(email)) {
      try {
        await db.insert(leads).values({
          email: email.trim().toLowerCase(),
          source: `free_tool_${toolType || "generic"}`,
          interest: cleanNiche,
        });
      } catch (leadErr) {
        console.error("Lead capture err:", leadErr);
      }
    }

    let generatedOutput = "";

    switch (toolType) {
      case "viral_video":
        if (isZh) {
          generatedOutput = `【🔥 针对“${cleanNiche}”的爆款短视频脚本框架】

1. 💣 黄金3秒完播率钩子（3选1）：
   • 钩子A（反常识认知）："如果你还在用传统方法做${cleanNiche}，你其实每天都在亏钱！"
   • 钩子B（痛点揭露）："90%的${cleanAudience}都不知道，只需要一个自动化脚本，就能省下80%的时间..."
   • 钩子C（成果展示）："从0开始，我用这个AI方法把新网站跑到了日访客3000+！"

2. 🎬 核心剧情演绎（第4-22秒）：
   • 痛点共鸣："以前找客户、写文案、做SEO累死累活，结果根本没有转化。"
   • 转折方案："直到我们把这个AI自动化闭环跑通——把24小时直播和高价值免费工具结合！"
   • 实操演示："看这里，只需要输入你的关键词，系统自动生成30天多语言引流矩阵。"

3. 🚀 强呼吁转化CTA（第23-30秒）：
   • "想要同款高转化自动化模板？点击主页置顶链接，或在直播间扣【666】，免费领取！"`;
        } else {
          generatedOutput = `【🔥 Viral Short-Form Video Script for "${cleanNiche}"】

1. 💣 3-Second High Retention Hooks (Pick One):
   • Hook A (Contrarian): "Stop doing ${cleanNiche} the old manual way. You're bleeding 80% of your potential traffic!"
   • Hook B (Secret Reveal): "What the top 1% of ${cleanAudience} will NEVER tell you about scaling on autopilot..."
   • Hook C (Proof of Velocity): "How we drove 14,000 international visitors to a brand-new .com in under 14 days without spending on ads."

2. 🎬 Narrative Core (04s - 22s):
   • The Agony: "Most site owners launch a domain, post 3 articles, and stare at flat analytics for months."
   • The Breakthrough: "We flipped the script by setting up a 24/7 AI live stream and instant free utility tools."
   • The Proof: "Visitors enter curious, chat with the AI host in real time, and convert into paying buyers immediately."

3. 🚀 Call to Action (23s - 30s):
   • "Grab the entire autonomous growth blueprint in our live room today. Link in bio before the flash sale ends!"`;
        }
        break;

      case "seo_meta":
        if (isZh) {
          generatedOutput = `【🎯 针对“${cleanNiche}”的SEO元数据与高点击方案】

• 网页主标题（CTR最佳长度 55-60字符）：
  ${cleanNiche} 全攻略 2026：零基础快速引流与高转化实战指南

• 网页Meta描述（吸引Google高点击率）：
  正在寻找高效突破${cleanNiche}的方法？掌握2026最新AI自动化引流策略与转化模型，帮助${cleanAudience}快速获取海量精准流量并实现规模化变现。点击立即免费获取！

• 核心高意向长尾关键词（可直接用于外链与Tag）：
  1. ${cleanNiche} 教程
  2. 如何做好 ${cleanNiche}
  3. ${cleanNiche} 流量增长工具
  4. ${cleanNiche} 变现方案
  5. 2026最新 ${cleanNiche} 策略
  6. ${cleanAudience} 必备AI神器

• 结构化Schema.org建议：
  {"@context":"https://schema.org","@type":"SoftwareApplication","name":"${cleanNiche} AI Suite","offers":{"price":"29.00","priceCurrency":"USD"}}`;
        } else {
          generatedOutput = `【🎯 SEO Meta Tags & High-CTR Blueprint for "${cleanNiche}"】

• Optimized Page Title (56 chars - Max CTR):
  ${cleanNiche} in 2026: Fast Traffic & Monetization Blueprint

• High-Converting Meta Description (155 chars):
  Looking to dominate ${cleanNiche}? Discover how ${cleanAudience} scale international traffic and revenue on autopilot. Claim your free growth toolkit today!

• High-Intent Long-Tail Keywords (Rank fast):
  1. Best ${cleanNiche} tools 2026
  2. How to scale ${cleanNiche} fast
  3. Automated ${cleanNiche} for beginners
  4. ${cleanNiche} conversion strategies
  5. AI growth software for ${cleanAudience}

• OpenGraph Social Card Preview:
  og:title: "Scale ${cleanNiche} on 24/7 Autopilot"
  og:description: "Generate recurring international traffic with zero manual fatigue."`;
        }
        break;

      case "domain_brand":
        if (isZh) {
          generatedOutput = `【💎 针对“${cleanNiche}”的国际化品牌名与超级Slogan方案】

1. Brand: Omni${cleanNiche.replace(/\s+/g, "").slice(0, 8)}
   • Slogan: "全自动驱动，无界流量。"
   • 品牌定位：国际化、科技感、高效率

2. Brand: Apex${cleanNiche.replace(/\s+/g, "").slice(0, 6)}
   • Slogan: "让每一次到访都成为真金白银。"
   • 品牌定位：顶级、高客单价、权威感

3. Brand: ${cleanNiche.replace(/\s+/g, "").slice(0, 6)}Flow
   • Slogan: "像水流一样源源不断的自然流量。"
   • 品牌定位：轻量化、极速落地、自动化

4. Brand: Nova${cleanNiche.replace(/\s+/g, "").slice(0, 6)}
   • Slogan: "AI时代的增长新星。"
   • 品牌定位：智能、未来感、颠覆性`;
        } else {
          generatedOutput = `【💎 International Brand Name & Slogan Proposals for "${cleanNiche}"】

1. Brand: Omni${cleanNiche.replace(/[^a-zA-Z]/g, "").slice(0, 6)} (.com)
   • Slogan: "Autonomous Growth, Infinite Reach."
   • Value Prop: Built for ${cleanAudience} who demand relentless conversion around the clock.

2. Brand: Apex${cleanNiche.replace(/[^a-zA-Z]/g, "").slice(0, 6)} (.com)
   • Slogan: "Turn Cold Clicks Into Compound Revenue."
   • Value Prop: High-performance infrastructure tailored for global scale.

3. Brand: Hyper${cleanNiche.replace(/[^a-zA-Z]/g, "").slice(0, 6)} (.com)
   • Slogan: "Traffic at the Speed of AI."
   • Value Prop: The turnkey launchpad for zero-to-one domain builders.`;
        }
        break;

      case "cold_email":
        if (isZh) {
          generatedOutput = `【✉️ 针对“${cleanNiche}”的高回复率外贸/商务合作开发信】

主题：关于在${cleanNiche}领域为贵司提供每月500+精准询盘的合作提议

尊敬的负责人生效，

关注到贵司在${cleanNiche}领域的优秀布局，特别钦佩你们近期的产品更新！

目前许多${cleanAudience}在海外获客时普遍面临获客成本高、自然流量不足的痛点。我们刚刚上线了一套基于24小时实时AI数字人与高权重工具的国际流量闭环，已协助多个新项目在14天内获得首批数千名海外精准访客。

我们为您准备了一份针对贵项目的《30天零广告费国际流量冷启动报告》。

如果方便，本周四或周五下午能否给您安排一个10分钟的简短在线Demo展示？

祝商祺，
AI 增长团队`;
        } else {
          generatedOutput = `【✉️ High-Response Cold Outreach Pitch for "${cleanNiche}"】

Subject: Quick idea regarding ${cleanNiche} for {{Company}}

Hi {{FirstName}},

Noticed what your team has been doing with ${cleanNiche}—really impressive traction.

Most ${cleanAudience} we talk to are feeling the squeeze on rising ad costs and sluggish organic click-throughs. We developed a 24/7 autonomous live agent protocol that converts international web visitors into qualified leads at 4.2x the industry average.

We put together a custom 1-page traffic diagnostic specifically for your domain.

Would you be open to a 7-minute casual walk-through this Thursday or Friday?

Best regards,
Growth Partnerships Lead`;
        }
        break;

      default:
        generatedOutput = `Output generated for ${cleanNiche}. Please select a valid tool type.`;
    }

    return NextResponse.json({
      success: true,
      output: generatedOutput,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

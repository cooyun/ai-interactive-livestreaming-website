"use client";

import React, { useState } from "react";
import { SupportedLang, translations } from "@/lib/i18n";
import { triggerConfetti } from "@/lib/confetti";
import {
  Zap,
  Sparkles,
  Copy,
  Check,
  Video,
  Search,
  Globe,
  Mail,
  ArrowRight,
  Radio,
  FileText,
} from "lucide-react";

interface FreeToolsSectionProps {
  currentLang: SupportedLang;
  onJumpToLive: (promptText?: string) => void;
}

export function FreeToolsSection({ currentLang, onJumpToLive }: FreeToolsSectionProps) {
  const t = translations[currentLang].tools;
  const isZh = currentLang === "zh";

  const [activeTab, setActiveTab] = useState<"viral_video" | "seo_meta" | "domain_brand" | "cold_email">(
    "viral_video"
  );
  const [nicheInput, setNicheInput] = useState<string>("");
  const [audienceInput, setAudienceInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const tabs = [
    { id: "viral_video", label: t.tabViralVideo, icon: Video, color: "text-rose-400" },
    { id: "seo_meta", label: t.tabSeoMeta, icon: Search, color: "text-cyan-400" },
    { id: "domain_brand", label: t.tabDomainBrand, icon: Globe, color: "text-amber-400" },
    { id: "cold_email", label: t.tabColdEmail, icon: Mail, color: "text-emerald-400" },
  ] as const;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCopied(false);

    try {
      const res = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolType: activeTab,
          niche: nicheInput || "International e-commerce & AI automation",
          audience: audienceInput || "Global digital creators and business owners",
          email: emailInput,
          lang: currentLang,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.output);
        triggerConfetti();
      } else {
        alert(data.error || "Generation error. Please try again.");
      }
    } catch (err) {
      console.error("Tool generate error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="free-tools" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.title}
        </h2>
        <p className="mt-3 text-slate-400 text-base sm:text-lg">
          {t.subtitle}
        </p>
      </div>

      {/* Main Tool Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Tool Type Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setOutput("");
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form Column (5 cols) */}
          <form onSubmit={handleGenerate} className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {t.inputNiche}
              </label>
              <input
                type="text"
                required
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                placeholder={
                  isZh
                    ? "例如：独立站跨境电商、AI生产力SaaS、留学咨询..."
                    : "e.g. B2B SaaS, Luxury Watches, Eco-Friendly Fashion..."
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {t.inputAudience}
              </label>
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                placeholder={
                  isZh
                    ? "例如：跨境亚马逊卖家、独立创作者、海外高净值客户..."
                    : "e.g. Shopify founders, digital nomads, remote developers..."
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {isZh ? "接收免费成长大礼包（选填）" : "Free Growth Pack Delivery (Optional)"}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={isZh ? "输入邮箱，获取完整流量SOP方案" : "Enter your email for the complete growth SOP"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-fuchsia-500 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.generateBtn}</span>
                </>
              )}
            </button>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
              <span className="text-cyan-400">💡</span>
              <span>
                {isZh
                  ? "提示：本工具产生的内容支持一键复制，也可直接发送到上方24小时AI直播间，请AI主播当场为您深入润色与评估！"
                  : "Tip: Results can be copied instantly or sent directly to our 24/7 AI host above for real-time live review!"}
              </span>
            </div>
          </form>

          {/* Output Display Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 min-h-[360px] flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {isZh ? "AI生成的高转化方案成果" : "AI Generated Output Blueprint"}
                </span>
              </div>

              {output && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : t.copyBtn}</span>
                </button>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 py-4 overflow-y-auto max-h-[300px] custom-scrollbar">
              {output ? (
                <pre className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {output}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    {isZh
                      ? "在左侧输入您的业务关键词，点击生成即可获取全球爆款内容"
                      : "Enter your niche on the left and click generate to reveal high-velocity copy"}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {isZh ? "100% 免费无限制使用" : "100% Free & Unlimited Usage"}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions if Output Exists */}
            {output && (
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const prompt = isZh
                      ? `请帮我评估一下刚刚在免费工具生成的方案：${nicheInput || "我的新项目"}`
                      : `Can you review the strategy I just generated for: ${nicheInput || "my domain"}?`;
                    onJumpToLive(prompt);
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>{t.askHost}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] text-slate-500 font-mono">
                  {isZh ? "已通过高转化模型校验" : "Validated by High-CTR AI Model"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

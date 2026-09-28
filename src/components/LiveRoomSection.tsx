"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SupportedLang, translations } from "@/lib/i18n";
import { triggerConfetti, triggerGiftConfetti } from "@/lib/confetti";
import {
  Volume2,
  VolumeX,
  Send,
  Gift,
  Heart,
  Flame,
  Rocket,
  Sparkles,
  Radio,
  Eye,
  Clock,
  CheckCircle2,
  ShoppingBag,
  Zap,
  Users,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface ChatMessage {
  id: number;
  senderName: string;
  senderAvatar?: string | null;
  senderRole: string;
  message: string;
  messageType: string;
  giftType?: string | null;
  giftAmount?: string | null;
  isAiResponse?: boolean;
  createdAt: string | Date;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  price: string;
  originalPrice: string;
  badge?: string | null;
  stock?: number | null;
  salesCount?: number | null;
  isFeaturedInLive?: boolean | null;
}

interface LiveRoomSectionProps {
  currentLang: SupportedLang;
  onOpenCheckout: (product: Product) => void;
  featuredProduct: Product | null;
}

export function LiveRoomSection({
  currentLang,
  onOpenCheckout,
  featuredProduct,
}: LiveRoomSectionProps) {
  const t = translations[currentLang].liveRoom;
  const isZh = currentLang === "zh";

  // Stream state
  const [activeHost, setActiveHost] = useState<"nova" | "alex">("nova");
  const [hostStatus, setHostStatus] = useState<"speaking" | "thinking" | "listening">("speaking");
  const [spokenSubtitle, setSpokenSubtitle] = useState<string>(
    isZh
      ? "欢迎来到24小时AI实时互动直播间！我是AI主播Nova。有任何关于国际域名引流与变现的问题，随时在右侧弹幕提问！"
      : "Welcome to our 24/7 autonomous live stream! I am your AI host, Nova. Ask any question in chat or test our live tools!"
  );
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showDanmaku, setShowDanmaku] = useState<boolean>(true);
  const [viewerCount, setViewerCount] = useState<number>(1428);
  const [likesCount, setLikesCount] = useState<number>(18420);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(892400);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [chatInput, setChatInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [giftMenuOpen, setGiftMenuOpen] = useState<boolean>(false);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; icon: string; left: number }[]>([]);
  const [barrageList, setBarrageList] = useState<{ id: number; text: string; top: number; color: string }[]>([]);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const effectIdRef = useRef(0);

  // Fallback demo product if none provided
  const activeDeal: Product = featuredProduct || {
    id: 1,
    title: "OmniTraffic AI™ - Global Autopilot Traffic Suite 2026",
    slug: "omnitraffic-ai-growth-suite",
    price: "29.00",
    originalPrice: "199.00",
    badge: "85% OFF • LIVE FLASH DEAL",
    stock: 6,
    salesCount: 842,
    isFeaturedInLive: true,
  };

  // Uptime ticker & subtle viewer jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1200, prev + delta);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial chats
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch("/api/live/chat");
        const data = await res.json();
        if (data.success && data.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Chat fetch err:", err);
      }
    };
    fetchChat();

    // Poll for new messages every 4 seconds
    const pollTimer = setInterval(fetchChat, 4000);
    return () => clearInterval(pollTimer);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, hostStatus]);

  // Voice synthesis helper
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = activeHost === "nova" ? 1.15 : 0.95;

      const voices = window.speechSynthesis.getVoices();
      if (currentLang === "zh") {
        const zhVoice = voices.find((v) => v.lang.includes("zh") || v.lang.includes("cmn"));
        if (zhVoice) utterance.voice = zhVoice;
      } else {
        const enVoice = voices.find((v) => v.lang.includes("en"));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onstart = () => setHostStatus("speaking");
      utterance.onend = () => {
        setTimeout(() => setHostStatus("listening"), 800);
      };
      utterance.onerror = () => setHostStatus("listening");

      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Trigger floating reaction
  const sendReaction = (icon: string) => {
    setLikesCount((prev) => prev + 1);
    const id = ++effectIdRef.current;
    const newReaction = {
      id,
      icon,
      left: 65 + (id * 7) % 25,
    };
    setFloatingReactions((prev) => [...prev.slice(-15), newReaction]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2200);
  };

  // Add barrage banner
  const addBarrage = (text: string, color = "#38bdf8") => {
    if (!showDanmaku) return;
    const id = ++effectIdRef.current;
    const newBarrage = {
      id,
      text,
      top: 15 + (id * 13) % 55,
      color,
    };
    setBarrageList((prev) => [...prev.slice(-8), newBarrage]);

    setTimeout(() => {
      setBarrageList((prev) => prev.filter((b) => b.id !== newBarrage.id));
    }, 6000);
  };

  // Send interaction (message, prompt, or gift)
  const handleSendMessage = async (customMessage?: string, giftType?: string) => {
    const textToSend = customMessage ?? chatInput;
    if (!textToSend.trim() && !giftType) return;

    const sender = userName.trim() || (isZh ? "热心观众" : "Global Guest");
    setIsSending(true);
    setHostStatus("thinking");

    if (giftType) {
      triggerGiftConfetti(giftType);
    }

    // Add immediate client barrage
    if (textToSend) {
      addBarrage(`${sender}: ${textToSend}`, giftType ? "#ec4899" : "#ffffff");
    }

    try {
      const res = await fetch("/api/live/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          senderName: sender,
          hostPersona: activeHost,
          lang: currentLang,
          giftType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.userMessage && data.aiResponse) {
          setMessages((prev) => [...prev, data.userMessage, data.aiResponse]);
        }

        if (data.spokenText) {
          setSpokenSubtitle(data.spokenText);
          speakText(data.spokenText);
          addBarrage(`🎙️ Nova: ${data.spokenText.slice(0, 45)}...`, "#38bdf8");
        }

        if (!customMessage && !giftType) {
          setChatInput("");
        }
      } else {
        alert(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Interaction error:", err);
    } finally {
      setIsSending(false);
      setGiftMenuOpen(false);
    }
  };

  // Format uptime (e.g. 247h 19m 28s)
  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  return (
    <section id="live-room" className="relative pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Glow decorative backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-fuchsia-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Header Title & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>24/7 REAL-TIME AI LIVE STREAM</span>
            <span className="text-slate-400 font-mono">NON-STOP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {isZh ? "24小时AI数字人实时互动直播间" : "24/7 Interactive AI Live Summit"}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            {isZh
              ? "实时AI主播全天候在线，解答域名引流、SEO自动化与数字化变现全套方案"
              : "Autonomous AI host live broadcasting round the clock. Ask any question in chat!"}
          </p>
        </div>

        {/* Live Host Persona Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-lg">
          <button
            onClick={() => {
              setActiveHost("nova");
              setSpokenSubtitle(
                isZh
                  ? "我是Nova！针对新域名的流量裂变与直播变现，我随时为你规划！"
                  : "Hi, I'm Nova! Let me guide you on scaling your .com traffic and conversion."
              );
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeHost === "nova"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🎙️ Nova ({t.novaRole.split("&")[0]})</span>
          </button>
          <button
            onClick={() => {
              setActiveHost("alex");
              setSpokenSubtitle(
                isZh
                  ? "我是Alex，负责AI技术架构与系统落地。欢迎探讨AI代理与全自动获客架构！"
                  : "I'm Alex, Head of AI Architecture. Drop your questions on technical scalability!"
              );
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeHost === "alex"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>⚡ Alex ({t.alexRole.split("&")[0]})</span>
          </button>

          {/* Voice Audio Toggle Button */}
          <button
            onClick={() => {
              const nextState = !voiceEnabled;
              setVoiceEnabled(nextState);
              if (nextState) {
                speakText(spokenSubtitle);
              } else {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              voiceEnabled
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            title="Toggle Browser AI Speech Voice"
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceEnabled ? t.audioMute : t.audioUnmute}</span>
          </button>

          {/* Danmaku toggle */}
          <button
            onClick={() => setShowDanmaku(!showDanmaku)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showDanmaku ? "bg-indigo-900/60 text-indigo-300 border border-indigo-700/50" : "bg-slate-800 text-slate-400"
            }`}
          >
            {t.barrageToggle}: {showDanmaku ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Main Live Studio Deck (2 Column Grid: Video Player + Chat Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/70 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md">
        
        {/* Left Column: Live Broadcast Stage (7-8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {/* Video Deck Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-inner group">
            
            {/* Host Avatar Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={
                  activeHost === "nova"
                    ? "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    : "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={activeHost === "nova" ? "Nova AI Host" : "Alex AI Host"}
                fill
                priority
                className={`object-cover object-center transition-all duration-700 ${
                  hostStatus === "speaking" ? "scale-[1.02] filter brightness-105" : "scale-100"
                }`}
              />

              {/* Holographic Digital Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 pointer-events-none" />
              <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay pointer-events-none" />

              {/* Audio Frequency Waveform Visualizer when host is speaking */}
              {hostStatus === "speaking" && (
                <div className="absolute bottom-20 left-6 right-6 flex items-center justify-center gap-1.5 h-10 pointer-events-none">
                  {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95, 65, 80, 50, 90, 60, 45].map((height, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-fuchsia-400 opacity-90 animate-pulse"
                      style={{
                        height: `${height}%`,
                        animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                        animationDelay: `${(i % 4) * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Floating Danmaku (Barrage) Text flying across the video stage */}
              {showDanmaku &&
                barrageList.map((item) => (
                  <div
                    key={item.id}
                    className="absolute whitespace-nowrap text-xs sm:text-sm font-bold drop-shadow-md pointer-events-none z-20 px-3 py-1 rounded-full bg-slate-950/70 border border-white/20 animate-danmaku"
                    style={{
                      top: `${item.top}%`,
                      color: item.color,
                      right: "-100%",
                      animation: "danmaku 6s linear forwards",
                    }}
                  >
                    {item.text}
                  </div>
                ))}

              {/* Floating Heart / Reaction Bubbles */}
              {floatingReactions.map((item) => (
                <div
                  key={item.id}
                  className="absolute text-2xl sm:text-3xl pointer-events-none z-30 animate-float-up"
                  style={{
                    bottom: "20%",
                    left: `${item.left}%`,
                  }}
                >
                  {item.icon}
                </div>
              ))}
            </div>

            {/* Top Video Overlays: Status badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold tracking-wide shadow-lg">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  LIVE
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-mono border border-slate-700/60">
                  <Eye className="w-3 h-3 text-cyan-400" />
                  {viewerCount.toLocaleString()}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-mono border border-slate-700/60">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {formatUptime(uptimeSeconds)}
                </span>
              </div>

              {/* Host Status Badge */}
              <div className="pointer-events-auto">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                    hostStatus === "speaking"
                      ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/20"
                      : hostStatus === "thinking"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse"
                      : "bg-slate-900/80 text-slate-300 border-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  {hostStatus === "speaking"
                    ? `${activeHost === "nova" ? "Nova" : "Alex"} is speaking`
                    : hostStatus === "thinking"
                    ? "AI is thinking..."
                    : "Listening to chat"}
                </span>
              </div>
            </div>

            {/* Subtitle / Teleprompter Box */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-xl p-3 shadow-xl">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {activeHost === "nova" ? "Nova (AI Growth Host)" : "Alex (AI Tech Host)"}
                      </span>
                      {!voiceEnabled && (
                        <button
                          onClick={() => {
                            setVoiceEnabled(true);
                            speakText(spokenSubtitle);
                          }}
                          className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          {t.audioNotice}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed mt-0.5 line-clamp-3">
                      {spokenSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Control Bar: Reactions + Flash Deal Pin */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:px-4">
            
            {/* Pinned Flash Deal Pill */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/20">
                <Flame className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                    {activeDeal.badge || "FLASH DEAL"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeDeal.stock} {translations[currentLang].deals.stockLeft}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {activeDeal.title}
                </h4>
              </div>
            </div>

            {/* Quick Buy CTA + Reactions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Floating Reaction triggers */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
                {[
                  { icon: "❤️", label: "Heart" },
                  { icon: "🔥", label: "Fire" },
                  { icon: "🚀", label: "Rocket" },
                  { icon: "👏", label: "Clap" },
                  { icon: "💎", label: "Diamond" },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => sendReaction(r.icon)}
                    className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-base transition-transform active:scale-125"
                    title={r.label}
                  >
                    {r.icon}
                  </button>
                ))}
              </div>

              {/* Instant Grab Deal Button */}
              <button
                onClick={() => {
                  triggerConfetti();
                  onOpenCheckout(activeDeal);
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 shadow-lg shadow-rose-500/25 flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>${activeDeal.price}</span>
                <span className="text-rose-200 line-through text-[11px]">${activeDeal.originalPrice}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Community Interactive Chat (4-5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[520px] lg:h-[580px] bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
          
          {/* Chat Header */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">{t.liveChatHeader}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
              <span>{(likesCount / 1000).toFixed(1)}k likes</span>
            </div>
          </div>

          {/* Quick Question Suggestion Chips */}
          <div className="p-2 bg-slate-950 border-b border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {t.quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap shrink-0 transition-colors"
              >
                💡 {q}
              </button>
            ))}
          </div>

          {/* Chat Message Scrollable Container */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs sm:text-sm custom-scrollbar"
          >
            {messages.map((msg) => {
              const isAi = msg.isAiResponse || msg.senderRole === "ai_host";
              const isGift = msg.messageType === "gift";
              const isSuperChat = msg.messageType === "superchat";
              const isOrderToast = msg.messageType === "order_toast";

              // Order toast styling
              if (isOrderToast) {
                return (
                  <div
                    key={msg.id}
                    className="p-2 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{msg.message}</span>
                  </div>
                );
              }

              // Gift styling
              if (isGift) {
                return (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-fuchsia-950/80 to-indigo-950/80 border border-fuchsia-500/40 text-fuchsia-200 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-fuchsia-300 flex items-center gap-1">
                        🎁 {msg.senderName} sent a {msg.giftType?.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-900/60 text-fuchsia-300">
                        ${msg.giftAmount}
                      </span>
                    </div>
                    <p className="text-xs text-white/90">{msg.message}</p>
                  </div>
                );
              }

              // AI Host message
              if (isAi) {
                return (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-[10px]">
                          🎙️
                        </span>
                        <span className="font-bold text-xs text-indigo-300">{msg.senderName}</span>
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          AI HOST
                        </span>
                      </div>
                      <button
                        onClick={() => speakText(msg.message)}
                        className="text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Play voice audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-100 leading-relaxed">{msg.message}</p>
                  </div>
                );
              }

              // Super chat message
              if (isSuperChat) {
                return (
                  <div
                    key={msg.id}
                    className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500/40 shadow-lg text-amber-100"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-amber-300 flex items-center gap-1">
                        ⭐ {msg.senderName} (Super Chat)
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        ${msg.giftAmount || "4.99"}
                      </span>
                    </div>
                    <p className="text-xs text-white">{msg.message}</p>
                  </div>
                );
              }

              // Normal visitor message
              return (
                <div key={msg.id} className="flex items-start gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[11px] text-slate-300">
                    {msg.senderAvatar || "👤"}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-300 mr-1.5">{msg.senderName}:</span>
                    <span className="text-slate-200 break-words">{msg.message}</span>
                  </div>
                </div>
              );
            })}

            {/* Thinking indicator */}
            {isSending && (
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>
                  {isZh
                    ? "AI主播正在组织解答并准备语音播报..."
                    : "AI host is synthesizing real-time response..."}
                </span>
              </div>
            )}
          </div>

          {/* Gift Dropdown Menu */}
          {giftMenuOpen && (
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-2">
              {[
                { type: "coffee", name: "Coffee", price: "$1.99", icon: "☕" },
                { type: "diamond", name: "Diamond", price: "$4.99", icon: "💎" },
                { type: "rocket", name: "Rocket", price: "$9.99", icon: "🚀" },
                { type: "crown", name: "Crown VIP", price: "$19.99", icon: "👑" },
              ].map((g) => (
                <button
                  key={g.type}
                  onClick={() => handleSendMessage(undefined, g.type)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-xl mb-0.5">{g.icon}</span>
                  <span className="text-[10px] font-bold text-white">{g.name}</span>
                  <span className="text-[9px] text-amber-400 font-mono">{g.price}</span>
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Section */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={isZh ? "您的昵称 (选填)" : "Your Nickname"}
                maxLength={20}
                className="w-1/3 text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={() => setGiftMenuOpen(!giftMenuOpen)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                  giftMenuOpen
                    ? "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500"
                    : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="hidden sm:inline">{t.sendGiftBtn}</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.chatPlaceholder}
                maxLength={250}
                className="flex-1 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isSending || !chatInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.sendBtn}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

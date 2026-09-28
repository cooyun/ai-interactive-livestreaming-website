"use client";

import React, { useState, useEffect } from "react";
import { SupportedLang } from "@/lib/i18n";
import {
  X,
  Sliders,
  DollarSign,
  Users,
  ShoppingBag,
  Send,
  Plus,
  BookOpen,
  Radio,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLang;
}

export function AdminControlModal({ isOpen, onClose, currentLang }: AdminControlModalProps) {
  const isZh = currentLang === "zh";

  const [activeTab, setActiveTab] = useState<"metrics" | "stream" | "kb" | "orders">("metrics");
  const [metrics, setMetrics] = useState({
    totalRevenue: "1840.00",
    totalOrders: 32,
    totalLeads: 128,
    totalAffiliates: 14,
  });
  const [streamSettings, setStreamSettings] = useState({
    activeHost: "nova",
    streamTitle: "24/7 Global AI Traffic & E-Commerce Live Broadcast",
    currentTopic: "How to Scale Global .COM Traffic from 0 to $10,000/Mo using Autonomous AI Agents",
    speechRate: "1.0",
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);

  // Forms state
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSender, setBroadcastSender] = useState("Live Host Director");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // New KB item form
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [newTopic, setNewTopic] = useState("general");
  const [isSavingKb, setIsSavingKb] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      if (data.success) {
        if (data.metrics) setMetrics(data.metrics);
        if (data.settings) {
          setStreamSettings({
            activeHost: data.settings.activeHost || "nova",
            streamTitle: data.settings.streamTitle || "",
            currentTopic: data.settings.currentTopic || "",
            speechRate: data.settings.speechRate || "1.0",
          });
        }
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.knowledgeBase) setKnowledgeBase(data.knowledgeBase);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_stream",
          ...streamSettings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isZh ? "直播间设置已更新！" : "Stream settings saved successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "broadcast_message",
          message: broadcastMessage,
          senderName: broadcastSender,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isZh ? "公告已推送至直播间弹幕区！" : "Broadcast message sent to live chat!");
        setBroadcastMessage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer || !newKeywords) return;

    setIsSavingKb(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_knowledge",
          questionPattern: newQuestion,
          answerText: newAnswer,
          topic: newTopic,
          triggerKeywords: newKeywords,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isZh ? "AI主播新知识已成功录入！" : "New Q&A learned by AI Host!");
        setNewQuestion("");
        setNewAnswer("");
        setNewKeywords("");
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingKb(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isZh ? "AI直播与经营控制台" : "AI Streamer & Command Deck"}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isZh
                  ? "管理24小时AI数字人主播、实时弹幕公告与知识库"
                  : "Control 24/7 host persona, broadcast messages, and AI knowledge base."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="my-2 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 my-4 border-b border-slate-800/80 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: "metrics", label: isZh ? "经营概览" : "Overview", icon: DollarSign },
            { id: "stream", label: isZh ? "直播间控制" : "Stream Controls", icon: Radio },
            { id: "kb", label: isZh ? "AI大脑与知识库" : "AI Knowledge Base", icon: BookOpen },
            { id: "orders", label: isZh ? "订单记录" : "Orders & Leads", icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {/* TAB 1: METRICS OVERVIEW */}
          {activeTab === "metrics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {isZh ? "总变现营收" : "Gross Revenue"}
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ${Number(metrics.totalRevenue).toFixed(2)}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {isZh ? "累计订单数" : "Total Orders"}
                  </span>
                  <div className="text-2xl font-black text-cyan-400 mt-1">
                    {metrics.totalOrders}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {isZh ? "留资潜在客户" : "Captured Leads"}
                  </span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {metrics.totalLeads}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">
                    {isZh ? "活跃分销伙伴" : "Affiliates"}
                  </span>
                  <div className="text-2xl font-black text-fuchsia-400 mt-1">
                    {metrics.totalAffiliates}
                  </div>
                </div>
              </div>

              {/* Instant Broadcast Message Form */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>{isZh ? "推送主播置顶弹幕公告" : "Push Live Broadcast Announcement"}</span>
                </h4>
                <form onSubmit={handleSendBroadcast} className="space-y-3">
                  <input
                    type="text"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder={
                      isZh
                        ? "输入即时播报内容，如：特别通知！前10名在直播间下单的用户额外获赠VIP咨询！"
                        : "Enter announcement to display in the live chat..."
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-500">
                      {isZh ? "将实时播报并记录在访客互动弹幕中" : "Broadcasts directly into live chat"}
                    </span>
                    <button
                      type="submit"
                      disabled={isBroadcasting || !broadcastMessage.trim()}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {isZh ? "立即推送" : "Broadcast Now"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: STREAM SETTINGS */}
          {activeTab === "stream" && (
            <form onSubmit={handleUpdateStream} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    {isZh ? "当前默认主播形象" : "Active AI Streamer Persona"}
                  </label>
                  <select
                    value={streamSettings.activeHost}
                    onChange={(e) =>
                      setStreamSettings({ ...streamSettings, activeHost: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="nova">Nova (增长与带货主播 / Growth Specialist)</option>
                    <option value="alex">Alex (技术架构主播 / AI Tech Architect)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    {isZh ? "语速倍率" : "Speech Rate (0.8x - 1.4x)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.8"
                    max="1.5"
                    value={streamSettings.speechRate}
                    onChange={(e) =>
                      setStreamSettings({ ...streamSettings, speechRate: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {isZh ? "直播间主标题" : "Stream Title"}
                </label>
                <input
                  type="text"
                  value={streamSettings.streamTitle}
                  onChange={(e) =>
                    setStreamSettings({ ...streamSettings, streamTitle: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {isZh ? "当前播报主题大纲" : "Current Topic Presentation"}
                </label>
                <textarea
                  rows={3}
                  value={streamSettings.currentTopic}
                  onChange={(e) =>
                    setStreamSettings({ ...streamSettings, currentTopic: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md"
              >
                {isZh ? "保存直播间设置" : "Save Stream Settings"}
              </button>
            </form>
          )}

          {/* TAB 3: AI KNOWLEDGE BASE */}
          {activeTab === "kb" && (
            <div className="space-y-6">
              {/* Form to add Q&A */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>{isZh ? "教AI主播学习新业务知识" : "Teach AI Host New Knowledge"}</span>
                </h4>
                <form onSubmit={handleAddKnowledge} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder={isZh ? "常见提问模式（如：支持发票吗？）" : "Question Pattern (e.g. Do you support invoices?)"}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      required
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                      placeholder={isZh ? "触发关键词（英文逗号隔开）" : "Trigger Keywords (comma separated)"}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    required
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder={isZh ? "AI主播标准回答口径..." : "AI Host standard answer..."}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />

                  <button
                    type="submit"
                    disabled={isSavingKb}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500"
                  >
                    {isZh ? "确认录入知识库" : "Add to Knowledge Base"}
                  </button>
                </form>
              </div>

              {/* Existing items */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isZh ? "现有已装载的知识条目" : "Active Knowledge Items"}
                </h5>
                <div className="space-y-2">
                  {knowledgeBase.map((kb) => (
                    <div
                      key={kb.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs"
                    >
                      <div className="flex justify-between font-bold text-slate-200">
                        <span>Q: {kb.questionPattern}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">[{kb.topic}]</span>
                      </div>
                      <p className="text-slate-400 mt-1 line-clamp-2">A: {kb.answerText}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS LOG */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isZh ? "最新成交订单记录" : "Recent Verified Orders"}
              </h4>
              {recentOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  {isZh ? "暂无订单数据" : "No orders found."}
                </p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{ord.orderNumber}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                            ${ord.amount}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-0.5 truncate max-w-xs sm:max-w-md">
                          {ord.productName} • {ord.customerEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-indigo-400 block">
                          {ord.licenseKey}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

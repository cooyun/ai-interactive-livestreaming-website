"use client";

import React, { useState } from "react";
import { SupportedLang, translations } from "@/lib/i18n";
import { triggerConfetti } from "@/lib/confetti";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Sparkles,
  Download,
  Copy,
  Check,
} from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: string;
  originalPrice: string;
}

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLang;
}

export function CheckoutModal({ product, isOpen, onClose, currentLang }: CheckoutModalProps) {
  const isZh = currentLang === "zh";

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [keyCopied, setKeyCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerName,
          customerEmail,
          affiliateCode,
          country,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrderComplete(data.order);
        triggerConfetti();
      } else {
        alert(data.error || "Payment processing failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = () => {
    if (orderComplete?.licenseKey) {
      navigator.clipboard.writeText(orderComplete.licenseKey);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    }
  };

  const handleModalClose = () => {
    setOrderComplete(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {orderComplete ? (
          /* Order Success Screen */
          <div className="text-center py-4 space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {isZh ? "🎉 恭喜！购买成功" : "🎉 Order Confirmed!"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isZh
                  ? "授权许可凭证已同步发送至您的邮箱，并已在直播间弹幕播报！"
                  : "Your license key and download portal access have been delivered to your email."}
              </p>
            </div>

            {/* License details card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{isZh ? "订单编号:" : "Order #:"}</span>
                <span className="text-white font-bold">{orderComplete.orderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isZh ? "产品名称:" : "Product:"}</span>
                <span className="text-cyan-400 font-sans font-semibold truncate max-w-[200px]">
                  {orderComplete.productName}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isZh ? "支付金额:" : "Paid:"}</span>
                <span className="text-emerald-400 font-bold">${orderComplete.amount} USD</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase font-sans font-bold block mb-1">
                  {isZh ? "专属激活授权密钥 (License Key):" : "Official License Key:"}
                </span>
                <div className="flex items-center justify-between bg-slate-900 border border-indigo-500/40 rounded-xl p-2.5">
                  <span className="text-sm font-bold text-indigo-300 font-mono tracking-wider">
                    {orderComplete.licenseKey}
                  </span>
                  <button
                    onClick={handleCopyKey}
                    className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50"
                    title="Copy Key"
                  >
                    {keyCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleModalClose}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all"
            >
              {isZh ? "返回直播间继续互动" : "Return to 24/7 Live Stream"}
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                <Lock className="w-3 h-3" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isZh ? "极速激活与安全结算" : "Instant Access Checkout"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.title}</p>
            </div>

            {/* Price Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  {isZh ? "今日限时专享价" : "Live Flash Price"}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-white">${product.price}</span>
                  <span className="text-xs text-slate-500 line-through">${product.originalPrice}</span>
                  <span className="text-xs text-emerald-400 font-bold">USD</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {isZh ? "发货方式" : "Delivery"}
                </span>
                <span className="text-xs text-cyan-400 font-bold">
                  {isZh ? "⚡ 自动即时发货" : "⚡ Instant License"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {isZh ? "姓名 / 称呼" : "Full Name"}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isZh ? "例如：David Zhang" : "e.g. Alex Morgan"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  {isZh ? "电子邮箱 (用于接收授权与下载链接)" : "Email Address (For instant license delivery)"}
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    {isZh ? "国家 / 地区" : "Country"}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="United States">🇺🇸 United States</option>
                    <option value="China">🇨🇳 中国 (China)</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Canada">🇨🇦 Canada</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="Germany">🇩🇪 Germany</option>
                    <option value="Japan">🇯🇵 日本 (Japan)</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    {isZh ? "分销邀请码 (选填)" : "Affiliate Code (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={affiliateCode}
                    onChange={(e) => setAffiliateCode(e.target.value)}
                    placeholder="VIPGROWTH"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{isZh ? "正在安全授权出单..." : "Processing Secure Payment..."}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {isZh
                        ? `立即安全支付 $${product.price} USD`
                        : `Complete Instant Order ($${product.price} USD)`}
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                30-Day Money Back
              </span>
              <span>•</span>
              <span>Stripe / PayPal Ready</span>
              <span>•</span>
              <span>100% Secure</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

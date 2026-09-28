"use client";

import React, { useState } from "react";
import { SupportedLang, translations } from "@/lib/i18n";
import { Radio, Sparkles, Zap, Flame, ShieldCheck, Globe, Sliders, Menu, X } from "lucide-react";

interface NavbarProps {
  currentLang: SupportedLang;
  onLanguageChange: (lang: SupportedLang) => void;
  onOpenAdmin: () => void;
  activeViewers?: number;
}

export function Navbar({
  currentLang,
  onLanguageChange,
  onOpenAdmin,
  activeViewers = 1428,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang].nav;

  const languages: { code: SupportedLang; label: string; flag: string }[] = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "es", label: "ES", flag: "🇪🇸" },
    { code: "ja", label: "JA", flag: "🇯🇵" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Live Status Indicator */}
          <div className="flex items-center gap-3">
            <a href="#live-room" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  GLOBAL<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">OMNI</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-mono">
                    .COM
                  </span>
                </span>
              </div>
            </a>

            {/* Pulsing Live Badge */}
            <a
              href="#live-room"
              className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="tracking-wide">24/7 AI LIVE</span>
              <span className="text-slate-400 text-[11px] font-mono">
                {activeViewers.toLocaleString()} watching
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <a
              href="#live-room"
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
              {t.live}
            </a>
            <a
              href="#free-tools"
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              {t.tools}
            </a>
            <a
              href="#flash-deals"
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              {t.deals}
            </a>
            <a
              href="#pricing"
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              {t.pricing}
            </a>
            <a
              href="#affiliate"
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/30 rounded-lg transition-colors"
            >
              {t.affiliate}
            </a>
            <a
              href="#playbook"
              className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              {t.playbook}
            </a>
          </nav>

          {/* Language Switcher & Actions */}
          <div className="flex items-center gap-2">
            {/* Language Pills */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => onLanguageChange(item.code)}
                  className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                    currentLang === item.code
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title={item.label}
                >
                  <span>{item.flag}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Host Console Button */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Open Live Host & Stream Command Deck"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{t.admin}</span>
            </button>

            {/* Quick Live CTA */}
            <a
              href="#live-room"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 shadow-md shadow-rose-500/20 transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{t.joinLive}</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 px-2 border-t border-slate-800 space-y-1 bg-slate-950/95">
            <a
              href="#live-room"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              🔴 {t.live}
            </a>
            <a
              href="#free-tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              ⚡ {t.tools}
            </a>
            <a
              href="#flash-deals"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              🔥 {t.deals}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              💎 {t.pricing}
            </a>
            <a
              href="#affiliate"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              🤝 {t.affiliate}
            </a>
            <a
              href="#playbook"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              📘 {t.playbook}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Globe,
  ShieldAlert,
  ChevronDown,
  Check,
  QrCode,
  Bell,
  Settings,
  LayoutDashboard,
  Bot,
  FileText,
  TrendingUp,
  User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Logo } from "./Logo";
import { Language } from "@/types";
import { t } from "@/lib/i18n";

export const Header: React.FC<{ onOpenHealthCard?: () => void }> = ({ onOpenHealthCard }) => {
  const pathname = usePathname();
  const {
    language,
    setLanguage,
    activeProfile,
    setActiveProfile,
    profiles,
    triggerSos,
    toastMessage,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "te", label: "తెలుగు (Telugu)" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { name: "AI Assistant", href: "/dashboard/assistant", icon: <Bot className="h-3.5 w-3.5" /> },
    { name: "Reports", href: "/dashboard/reports", icon: <FileText className="h-3.5 w-3.5" /> },
    { name: "Progress", href: "/dashboard/progress", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  ];

  const avatarGradients = [
    "linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)",
    "linear-gradient(135deg, #7C5CFC 0%, #00C2FF 100%)",
    "linear-gradient(135deg, #00D4AA 0%, #0066FF 100%)",
    "linear-gradient(135deg, #FF9500 0%, #FF3366 100%)",
  ];
  const activeProfileIndex = profiles.findIndex((p) => p.id === activeProfile.id);
  const avatarGradient = avatarGradients[activeProfileIndex % avatarGradients.length];

  return (
    <header
      className="sticky top-0 z-40 font-sans transition-all"
      style={{
        background: "rgba(244, 244, 240, 0.90)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      {toastMessage && (
        <div
          className="flex items-center justify-center gap-2 py-1.5 px-4 text-[#111111] text-xs font-bold text-center"
          style={{
            background: "#D8FF57",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Bell className="h-3.5 w-3.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={true} />
        </div>

        {/* Center: Image 1 & Image 2 Centered Floating Pill Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/90 border border-black/5 shadow-sm backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#D8FF57] text-[#111111] shadow-sm scale-100"
                    : "text-[#6F6F70] hover:text-[#111111] hover:bg-black/5"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Controls & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenHealthCard && (
            <button
              onClick={onOpenHealthCard}
              title="Open Emergency Digital Health Card"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 bg-white border border-slate-200 shadow-sm hover:border-slate-300 text-[#111111]"
            >
              <QrCode className="h-3.5 w-3.5 text-[#8C73FF]" />
              <span className="hidden sm:inline">Digital ID</span>
            </button>
          )}

          <button
            onClick={triggerSos}
            className="sos-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wider transition-all active:scale-95"
            style={{ background: "#FF3366" }}
          >
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{t(language, "emergencySos")}</span>
          </button>

          {/* Quick Settings Icon */}
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-full bg-white border border-slate-200 shadow-sm text-[#6F6F70] hover:text-[#111111] transition-all hover:scale-105"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowProfileMenu(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 text-[#111111]"
            >
              <Globe className="h-3.5 w-3.5 text-[#6F6F70]" />
              <span className="uppercase font-bold text-[11px]">{language}</span>
              <ChevronDown className="h-3 w-3 transition-transform duration-200 text-[#6F6F70]" style={{ transform: showLangMenu ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
            {showLangMenu && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl py-2 z-50 bg-white border border-slate-200 shadow-xl"
              >
                <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-wider text-[#6F6F70]">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors rounded-xl font-medium"
                    style={{
                      color: language === l.code ? "#111111" : "#6F6F70",
                      fontWeight: language === l.code ? 700 : 500,
                      background: language === l.code ? "#EEEAFE" : "transparent",
                    }}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <Check className="h-3.5 w-3.5 text-[#8C73FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Button */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLangMenu(false); }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95 bg-white border border-slate-200 shadow-sm"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white font-extrabold text-[11px] select-none overflow-hidden"
                style={{ background: avatarGradient }}
              >
                {activeProfile.avatarUrl ? (
                  <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : (
                  activeProfile.name.charAt(0)
                )}
              </div>
              <span className="hidden md:inline font-bold max-w-[110px] truncate text-[#111111]">
                {activeProfile.name}
              </span>
              <ChevronDown className="h-3 w-3 transition-transform duration-200 text-[#6F6F70]" style={{ transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50 bg-white border border-slate-200 shadow-2xl"
              >
                <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-[#6F6F70]">
                  Active Patient Profile
                </div>
                {profiles.map((p, idx) => {
                  const isActive = activeProfile.id === p.id;
                  const grad = avatarGradients[idx % avatarGradients.length];
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setActiveProfile(p); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-3 transition-all"
                      style={{
                        background: isActive ? "#EEEAFE" : "transparent",
                        borderLeft: isActive ? "3px solid #8C73FF" : "3px solid transparent",
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-extrabold text-[11px] select-none overflow-hidden"
                        style={{ background: grad }}
                      >
                        {p.avatarUrl ? (
                          <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          p.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate" style={{ color: isActive ? "#111111" : "#6F6F70" }}>
                          {p.name}
                        </div>
                        <div className="text-[10px] font-normal text-[#6F6F70]">
                          {p.relationship} · Blood: {p.bloodGroup || 'O+'}
                        </div>
                      </div>
                      {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[#8C73FF]" />}
                    </button>
                  );
                })}
                <div className="pt-2 mt-1 border-t border-slate-100 space-y-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-center py-1.5 px-3 block rounded-xl text-xs font-bold text-[#111111] bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Edit Profile Details
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => {
                      localStorage.removeItem('hb_user_authenticated');
                      localStorage.removeItem('hb_auth_provider');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-center py-1.5 px-3 block rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    Sign Out / Switch Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

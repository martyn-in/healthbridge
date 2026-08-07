"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  Sun,
  Moon,
  Search,
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
    profiles,
    setActiveProfile,
    triggerSos,
    toastMessage,
    darkMode,
    setDarkMode,
    showToast,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <header className="sticky top-0 z-40 font-sans transition-colors duration-300 bg-white/90 dark:bg-[#12132C]/90 backdrop-blur-md border-b border-[#2F3273]/10 dark:border-white/10 shadow-xs">
      {toastMessage && (
        <div className="flex items-center justify-center gap-2 py-1.5 px-4 text-[#2F3273] bg-[#F9DF77] text-xs font-bold text-center">
          <Bell className="h-3.5 w-3.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left: Brand Logo on mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <Logo size="sm" showText={true} />
        </div>

        {/* Search Bar - Dribbble SaaS Benchmark */}
        <div className="hidden sm:flex items-center relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#4D50A2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, reports, doctors..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5FB] dark:bg-[#1E204A] border border-[#2F3273]/15 dark:border-white/15 text-[#1E204A] dark:text-white placeholder-[#4D50A2]/60 outline-none focus:border-[#4D50A2]"
          />
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#F4F5FB] dark:bg-[#1E204A] border border-[#2F3273]/10 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#4D50A2] text-white shadow-sm"
                    : "text-[#2F3273] dark:text-[#CBD0FB] hover:text-[#4D50A2]"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Emergency SOS, Language & Profile Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenHealthCard && (
            <button
              onClick={onOpenHealthCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4F5FB] dark:bg-[#1E204A] text-[#2F3273] dark:text-white border border-[#2F3273]/15 active:scale-95"
            >
              <QrCode className="h-3.5 w-3.5 text-[#4D50A2]" />
              <span className="hidden sm:inline">Digital ID</span>
            </button>
          )}

          {/* Non-negotiable Red Emergency SOS Button */}
          <button
            onClick={triggerSos}
            className="sos-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-[11px] font-black uppercase tracking-wider active:scale-95 shadow-md shadow-rose-500/25"
            style={{ background: "#EF4444" }}
          >
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{t(language, "emergencySos")}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => {
              const nextMode = !darkMode;
              setDarkMode(nextMode);
              showToast(nextMode ? "Dark Mode Enabled" : "Light Mode Enabled");
            }}
            className="p-2 rounded-xl bg-[#F4F5FB] dark:bg-[#1E204A] border border-[#2F3273]/15 text-[#2F3273] dark:text-white hover:text-[#4D50A2]"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-[#F9DF77]" />
            ) : (
              <Moon className="h-4 w-4 text-[#4D50A2]" />
            )}
          </button>

          {/* User Profile Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLangMenu(false); }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl text-xs font-bold bg-[#2F3273] text-white border border-[#4D50A2]/30 shadow-sm"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F9DF77] text-[#2F3273] font-black text-xs">
                {activeProfile.name.charAt(0)}
              </div>
              <span className="hidden md:inline font-bold max-w-[110px] truncate text-white">
                {activeProfile.name}
              </span>
              <ChevronDown className="h-3 w-3 text-[#F9DF77]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50 bg-white dark:bg-[#1E204A] border border-[#2F3273]/20 shadow-2xl">
                <div className="px-3 py-2 text-[10px] uppercase font-black tracking-wider text-[#4D50A2] dark:text-[#CBD0FB]">
                  Active Patient Profile
                </div>
                {profiles.map((p) => {
                  const isActive = activeProfile.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => { setActiveProfile(p); setShowProfileMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-all ${
                        isActive ? "bg-[#4D50A2] text-white font-bold" : "text-[#2F3273] dark:text-white hover:bg-[#F4F5FB] dark:hover:bg-[#2F3273]"
                      }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F9DF77] text-[#2F3273] font-black text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold truncate">{p.name}</div>
                        <div className="text-[10px] opacity-80">{p.relationship} · Blood: {p.bloodGroup || 'O+'}</div>
                      </div>
                      {isActive && <Check className="h-3.5 w-3.5 text-[#F9DF77]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

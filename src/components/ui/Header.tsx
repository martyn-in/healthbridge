"use client";

import React, { useState } from "react";
import {
  Search,
  Globe,
  ShieldAlert,
  ChevronDown,
  Check,
  QrCode,
  Bell,
  Command,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Logo } from "./Logo";
import { Language } from "@/types";
import { t } from "@/lib/i18n";

export const Header: React.FC<{ onOpenHealthCard?: () => void }> = ({ onOpenHealthCard }) => {
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
  const [searchQuery, setSearchQuery] = useState("");

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "te", label: "తెలుగు (Telugu)" },
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
      className="sticky top-0 z-30 font-sans"
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(200,215,235,0.50)",
      }}
    >
      {toastMessage && (
        <div
          className="flex items-center justify-center gap-2 py-1.5 px-4 text-white text-xs font-semibold text-center"
          style={{
            background: "linear-gradient(90deg, #0066FF 0%, #00C2FF 100%)",
            borderBottom: "1px solid rgba(0,102,255,0.25)",
          }}
        >
          <Bell className="h-3.5 w-3.5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <Logo size="sm" showText={true} />
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-4 h-4 w-4 pointer-events-none" style={{ color: "#9BAABF" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, lab tests, medications, or providers…"
            className="w-full pl-11 pr-14 py-2.5 text-xs font-medium rounded-full outline-none transition-all"
            style={{
              background: "rgba(236,238,242,1)",
              boxShadow: "inset 3px 3px 7px rgba(166,180,200,0.40), inset -3px -3px 7px rgba(255,255,255,0.90)",
              color: "#0D1B2A",
              border: "1px solid rgba(200,215,235,0.50)",
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                window.location.href = `/dashboard/care?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "inset 3px 3px 7px rgba(166,180,200,0.40), inset -3px -3px 7px rgba(255,255,255,0.90)";
            }}
          />
          <div
            className="absolute right-3 hidden sm:flex items-center gap-0.5 text-[10px] font-mono rounded-md px-1.5 py-0.5 select-none"
            style={{
              color: "#9BAABF",
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(200,215,235,0.60)",
              boxShadow: "1px 1px 3px rgba(166,180,200,0.30)",
            }}
          >
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenHealthCard && (
            <button
              onClick={onOpenHealthCard}
              title="Open Emergency Digital Health Card"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(200,215,235,0.70)",
                boxShadow: "4px 4px 10px rgba(166,180,200,0.35), -4px -4px 10px rgba(255,255,255,0.90)",
                color: "#0066FF",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "2px 2px 6px rgba(166,180,200,0.30), -2px -2px 6px rgba(255,255,255,0.85)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "4px 4px 10px rgba(166,180,200,0.35), -4px -4px 10px rgba(255,255,255,0.90)"; }}
            >
              <QrCode className="h-3.5 w-3.5" style={{ color: "#0066FF" }} />
              <span className="hidden sm:inline">Digital ID</span>
            </button>
          )}

          <button
            onClick={triggerSos}
            className="sos-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wider transition-all active:scale-95"
            style={{ background: "#FF3366" }}
          >
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
            <span>{t(language, "emergencySos")}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowProfileMenu(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ color: "#0D1B2A" }}
            >
              <Globe className="h-3.5 w-3.5" style={{ color: "#9BAABF" }} />
              <span className="uppercase font-bold text-[11px]" style={{ color: "#0D1B2A" }}>{language}</span>
              <ChevronDown className="h-3 w-3 transition-transform duration-200" style={{ color: "#9BAABF", transform: showLangMenu ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>
            {showLangMenu && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl py-2 z-50"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 8px 32px rgba(13,27,42,0.12), 0 2px 8px rgba(13,27,42,0.06)",
                }}
              >
                <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-wider" style={{ color: "#9BAABF" }}>
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors rounded-xl"
                    style={{
                      color: language === l.code ? "#0066FF" : "#0D1B2A",
                      fontWeight: language === l.code ? 700 : 500,
                      background: language === l.code ? "rgba(0,102,255,0.07)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (language !== l.code) e.currentTarget.style.background = "rgba(236,238,242,0.70)"; }}
                    onMouseLeave={(e) => { if (language !== l.code) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <Check className="h-3.5 w-3.5" style={{ color: "#0066FF" }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLangMenu(false); }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-medium transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(200,215,235,0.60)",
                boxShadow: "4px 4px 10px rgba(166,180,200,0.35), -4px -4px 10px rgba(255,255,255,0.90)",
              }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white font-extrabold text-[11px] select-none"
                style={{ background: avatarGradient }}
              >
                {activeProfile.name.charAt(0)}
              </div>
              <span className="hidden md:inline font-bold max-w-[110px] truncate" style={{ color: "#0D1B2A" }}>
                {activeProfile.name}
              </span>
              <ChevronDown className="h-3 w-3 transition-transform duration-200" style={{ color: "#9BAABF", transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl p-2 z-50"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 8px 32px rgba(13,27,42,0.12), 0 2px 8px rgba(13,27,42,0.06)",
                }}
              >
                <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider" style={{ color: "#9BAABF" }}>
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
                        background: isActive ? "rgba(0,102,255,0.06)" : "transparent",
                        borderLeft: isActive ? "3px solid #0066FF" : "3px solid transparent",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(236,238,242,0.70)"; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-extrabold text-[11px] select-none"
                        style={{ background: grad }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate" style={{ color: isActive ? "#0066FF" : "#0D1B2A" }}>
                          {p.name}
                        </div>
                        <div className="text-[10px] font-normal" style={{ color: "#9BAABF" }}>
                          {p.relationship} · Blood Group: {p.bloodGroup}
                        </div>
                      </div>
                      {isActive && <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#0066FF" }} />}
                    </button>
                  );
                })}
                <div className="pt-2 mt-1 border-t border-slate-200/50 space-y-1">
                  <a
                    href="/dashboard/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-center py-1.5 px-3 block rounded-xl text-xs font-bold text-[#0066FF] bg-[#0066FF]/10 hover:bg-[#0066FF]/20 transition-colors"
                  >
                    Edit Profile Details
                  </a>
                  <a
                    href="/login"
                    onClick={() => {
                      localStorage.removeItem('hb_user_authenticated');
                      localStorage.removeItem('hb_auth_provider');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-center py-1.5 px-3 block rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                  >
                    Sign Out / Switch Account
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sos-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,51,102,0.55), 4px 4px 14px rgba(255,51,102,0.50); }
          50%       { box-shadow: 0 0 0 8px rgba(255,51,102,0), 4px 4px 14px rgba(255,51,102,0.50); }
        }
        .sos-btn { animation: sos-pulse 2s ease-in-out infinite; }
      `}</style>
    </header>
  );
};

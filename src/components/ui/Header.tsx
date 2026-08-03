'use client';

import React, { useState } from 'react';
import {
  Search,
  Globe,
  Sun,
  Moon,
  ShieldAlert,
  User,
  ChevronDown,
  Bell,
  Check,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Logo } from './Logo';
import { Language } from '@/types';
import { t } from '@/lib/i18n';

export const Header: React.FC<{ onOpenHealthCard?: () => void }> = ({ onOpenHealthCard }) => {
  const {
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    activeProfile,
    setActiveProfile,
    profiles,
    triggerSos,
    toastMessage,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="bg-teal-600 text-white text-xs font-semibold py-1.5 px-4 text-center animate-in slide-in-from-top duration-200 flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left: Mobile Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <Logo size="sm" showText={false} />
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">HealthBridge AI</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, lab tests, medicines, or doctors..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500 outline-none transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Health Card QR Button */}
          {onOpenHealthCard && (
            <button
              onClick={onOpenHealthCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-cyan-400 border border-teal-200 dark:border-teal-800/60 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
              title="Open Emergency Digital Health Card"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Health Card</span>
            </button>
          )}

          {/* Persistent SOS Button */}
          <button
            onClick={triggerSos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-transform active:scale-95 animate-pulse focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="uppercase tracking-wider">{t(language, 'emergencySos')}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            >
              <Globe className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span className="uppercase font-bold">{language}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 animate-in fade-in duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
                      language === l.code ? 'text-teal-600 font-bold dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {l.label}
                    {language === l.code && <Check className="h-3.5 w-3.5 text-teal-600 dark:text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-[10px]">
                {activeProfile.name.charAt(0)}
              </div>
              <span className="hidden md:inline text-slate-900 dark:text-slate-100 max-w-[100px] truncate">
                {activeProfile.name}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Active Family Profile
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProfile(p);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
                      activeProfile.id === p.id ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-cyan-400 font-bold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div>{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.relationship} • {p.bloodGroup}
                      </div>
                    </div>
                    {activeProfile.id === p.id && <Check className="h-3.5 w-3.5 text-teal-600 dark:text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

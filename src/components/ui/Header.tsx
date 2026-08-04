'use client';

import React, { useState } from 'react';
import {
  Search,
  Globe,
  Sun,
  Moon,
  ShieldAlert,
  ChevronDown,
  Check,
  QrCode,
  Bell,
  Command,
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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-teal-700 dark:bg-teal-600 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-teal-800">
          <Bell className="h-3.5 w-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left: Mobile Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <Logo size="sm" showText={true} />
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, lab tests, medications, or providers..."
            className="w-full pl-10 pr-12 py-2 text-xs font-medium rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
          />
          <div className="absolute right-3 hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Digital Health Card Button */}
          {onOpenHealthCard && (
            <button
              onClick={onOpenHealthCard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              title="Open Emergency Digital Health Card"
            >
              <QrCode className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Digital ID</span>
            </button>
          )}

          {/* Emergency SOS Button */}
          <button
            onClick={triggerSos}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider text-[11px]">{t(language, 'emergencySos')}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span className="uppercase font-semibold text-[11px]">{language}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      language === l.code ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {l.label}
                    {language === l.code && <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-[10px]">
                {activeProfile.name.charAt(0)}
              </div>
              <span className="hidden md:inline text-slate-900 dark:text-slate-100 font-semibold max-w-[110px] truncate">
                {activeProfile.name}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 p-2 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Active Patient Profile
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProfile(p);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      activeProfile.id === p.id ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.relationship} • Blood Group: {p.bloodGroup}
                      </div>
                    </div>
                    {activeProfile.id === p.id && <Check className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />}
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


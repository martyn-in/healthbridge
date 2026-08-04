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
  LogOut,
  Stethoscope,
  User,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Logo } from './Logo';
import { Language } from '@/types';
import { t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export const Header: React.FC<{ onOpenHealthCard?: () => void }> = ({ onOpenHealthCard }) => {
  const router = useRouter();
  const {
    currentUser,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    activeProfile,
    setActiveProfile,
    profiles,
    triggerSos,
    toastMessage,
    logout,
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
  ];

  const isDoctor = currentUser?.role === 'Physician';

  const roleIcon = isDoctor ? (
    <Stethoscope className="h-3 w-3" />
  ) : currentUser?.role === 'Admin' ? (
    <Building2 className="h-3 w-3" />
  ) : (
    <User className="h-3 w-3" />
  );

  const roleBgClass = isDoctor
    ? 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800'
    : currentUser?.role === 'Admin'
    ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800'
    : 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-teal-600 dark:bg-teal-700 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
          <Bell className="h-3.5 w-3.5 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <Logo size="sm" showText={true} />
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm relative">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, lab tests, medications, or providers..."
            className="w-full pl-9 pr-12 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 outline-none transition-all"
          />
          <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Digital Health Card Button */}
          {onOpenHealthCard && (
            <button
              onClick={onOpenHealthCard}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Open Emergency Digital Health Card"
            >
              <QrCode className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Digital ID</span>
            </button>
          )}

          {/* Emergency SOS Button */}
          <button
            onClick={triggerSos}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all sos-pulse"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="uppercase tracking-wider text-[11px]">{t(language, 'emergencySos')}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => { setShowLangMenu(!showLangMenu); setShowProfileMenu(false); }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span className="uppercase text-[11px] font-bold">{language}</span>
              <ChevronDown className="h-2.5 w-2.5 opacity-40" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fade-in-up">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      language === l.code ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {l.label}
                    {language === l.code && <Check className="h-3.5 w-3.5 text-teal-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Profile / Account Switcher */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowLangMenu(false); }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-[10px] shrink-0">
                {currentUser?.avatarInitials || activeProfile.name.charAt(0)}
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <span className="text-slate-900 dark:text-slate-100 font-semibold max-w-[100px] truncate text-xs">
                  {isDoctor ? currentUser?.name : activeProfile.name}
                </span>
                <span className={`chip text-[9px] border ${roleBgClass} flex items-center gap-0.5`}>
                  {roleIcon}
                  {currentUser?.role || 'Patient'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-dropdown border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in-up">
                {/* Account Info Header */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-xs shrink-0">
                    {currentUser?.avatarInitials || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {isDoctor ? currentUser?.name : activeProfile.name}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {currentUser?.email || ''}
                    </div>
                  </div>
                </div>

                {!isDoctor && (
                  <>
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      Active Patient Record
                    </div>
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setActiveProfile(p); setShowProfileMenu(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                          activeProfile.id === p.id
                            ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {p.relationship} • Blood Group: {p.bloodGroup}
                          </div>
                        </div>
                        {activeProfile.id === p.id && <Check className="h-3.5 w-3.5 text-teal-500" />}
                      </button>
                    ))}
                  </>
                )}

                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => { logout(); setShowProfileMenu(false); router.push('/'); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out of Platform</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

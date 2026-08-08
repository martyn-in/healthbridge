'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Stethoscope, FileText, ScanLine, Pill,
  MapPin, FolderHeart, Calendar, Users, Syringe, Bot,
  HeartPulse, Settings, Activity, ChevronRight, Menu, X, ShieldAlert, ShieldCheck,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { language, activeProfile, triggerSos } = useApp();
  const [showMobileMore, setShowMobileMore] = useState(false);

  const clinicalNav = [
    { name: t(language, 'navSymptoms'),      path: '/dashboard/symptoms',      icon: Stethoscope },
    { name: t(language, 'navReports'),       path: '/dashboard/reports',       icon: FileText },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine },
    { name: t(language, 'navMeds'),          path: '/dashboard/medications',   icon: Pill },
    { name: t(language, 'navCare'),          path: '/dashboard/care',          icon: MapPin },
  ];

  const managementNav = [
    { name: t(language, 'navHome'),         path: '/dashboard',                icon: LayoutDashboard },
    { name: 'Digital ID',                   path: '/dashboard/digital-id',     icon: ShieldCheck },
    { name: 'Progress & Insights',          path: '/dashboard/progress',       icon: Activity },
    { name: t(language, 'navRecords'),      path: '/dashboard/records',        icon: FolderHeart },
    { name: t(language, 'navAppointments'), path: '/dashboard/appointments',   icon: Calendar },
    { name: t(language, 'navFamily'),       path: '/dashboard/family',         icon: Users },
    { name: t(language, 'navVaccines'),     path: '/dashboard/vaccinations',   icon: Syringe },
    { name: t(language, 'navAssistant'),    path: '/dashboard/assistant',      icon: Bot },
    { name: t(language, 'navWellness'),     path: '/dashboard/wellness',       icon: HeartPulse },
    { name: t(language, 'navSettings'),     path: '/dashboard/settings',       icon: Settings },
  ];

  const NavItem = ({ item }: { item: typeof clinicalNav[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;
    return (
      <Link
        href={item.path}
        className={`group flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#6A6ECC] border border-[#4D50A2]/20 font-bold shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-[#4D50A2] text-white shadow-sm'
                : 'bg-transparent text-[var(--text-muted)] group-hover:text-[#4D50A2]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span>{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-3 w-3 text-[#4D50A2]" />}
      </Link>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (TRANSLUCENT FROSTED GLASS PANEL) ────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-20 glass-panel border-r border-[#4D50A2]/10 dark:border-white/10 rounded-none shadow-sm">
        {/* Logo Header */}
        <div className="p-5 border-b border-[#4D50A2]/10 dark:border-white/10">
          <Link href="/dashboard">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {/* Clinical Tools */}
          <div>
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Activity className="h-3 w-3 text-[#4D50A2]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#4D50A2]">
                Clinical Tools
              </span>
            </div>
            <div className="space-y-0.5">
              {clinicalNav.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>

          {/* Patient Workspace */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#4D50A2]">
                Patient Workspace
              </span>
            </div>
            <div className="space-y-0.5">
              {managementNav.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Patient Profile Card at bottom */}
        <div className="p-3 border-t border-[#4D50A2]/10 dark:border-white/10">
          <Link
            href="/dashboard/settings"
            title="Click to edit your profile details"
            className="p-3 rounded-2xl flex items-center gap-3 glass-subcard hover:border-[#4D50A2]/40 transition-all cursor-pointer shadow-sm"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #4D50A2 0%, #2F3273 100%)' }}
            >
              {activeProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-extrabold truncate text-[var(--text-primary)]">
                {activeProfile.name}
              </div>
              <div className="text-[9px] font-semibold text-[#4D50A2]">
                {activeProfile.relationship} · {activeProfile.bloodGroup || 'O+'}
              </div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0 bg-[#4D50A2]" />
          </Link>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV & MORE DRAWER (SAFE AREA INSET COVERAGE) ────────────────── */}
      {showMobileMore && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowMobileMore(false)}
        >
          <div
            className="bg-white dark:bg-[#1C1C24] rounded-t-3xl p-5 border-t border-[#4D50A2]/20 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#4D50A2] dark:text-[#8C73FF]">
                <Activity className="h-4 w-4" /> All HealthBridge Tools
              </div>
              <button
                onClick={() => setShowMobileMore(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { name: t(language, 'navSymptoms'), path: '/dashboard/symptoms', icon: Stethoscope },
                { name: t(language, 'navReports'), path: '/dashboard/reports', icon: FileText },
                { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine },
                { name: t(language, 'navMeds'), path: '/dashboard/medications', icon: Pill },
                { name: t(language, 'navCare'), path: '/dashboard/care', icon: MapPin },
                { name: 'Progress', path: '/dashboard/progress', icon: Activity },
                { name: t(language, 'navRecords'), path: '/dashboard/records', icon: FolderHeart },
                { name: t(language, 'navAppointments'), path: '/dashboard/appointments', icon: Calendar },
                { name: t(language, 'navFamily'), path: '/dashboard/family', icon: Users },
                { name: t(language, 'navVaccines'), path: '/dashboard/vaccinations', icon: Syringe },
                { name: t(language, 'navAssistant'), path: '/dashboard/assistant', icon: Bot },
                { name: t(language, 'navWellness'), path: '/dashboard/wellness', icon: HeartPulse },
                { name: 'Doctor Portal', path: '/dashboard/doctor', icon: Stethoscope },
                { name: t(language, 'navSettings'), path: '/dashboard/settings', icon: Settings },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setShowMobileMore(false)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center space-y-1.5 border transition-all ${
                      isActive
                        ? 'bg-[#4D50A2]/10 border-[#4D50A2]/30 text-[#4D50A2] dark:text-[#8C73FF] font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200/60 dark:border-white/5 text-[var(--text-primary)] hover:bg-slate-100'
                    }`}
                  >
                    <ItemIcon className="h-5 w-5 text-[#4D50A2] dark:text-[#8C73FF]" />
                    <span className="text-[10px] font-bold leading-tight">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Logged in as <span className="font-bold text-[var(--text-primary)]">{activeProfile.name}</span>
              </div>
              <button
                onClick={() => {
                  setShowMobileMore(false);
                  triggerSos();
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-500/20 active:scale-95"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>SOS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] bg-white/95 dark:bg-[#18181D]/95 backdrop-blur-xl border-t border-[#4D50A2]/10 dark:border-white/10 shadow-lg"
      >
        {[
          { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
          { href: '/dashboard/assistant', icon: Bot, label: 'Assistant' },
          { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
          { href: '/dashboard/progress', icon: Activity, label: 'Progress' },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#8C73FF] font-bold'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Link>
          );
        })}

        {/* 'More' Button to trigger slide-up drawer */}
        <button
          onClick={() => setShowMobileMore(!showMobileMore)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
            showMobileMore
              ? 'bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#8C73FF] font-bold'
              : 'text-[var(--text-muted)]'
          }`}
        >
          <Menu className="h-4 w-4" />
          <span className="text-[9px] font-bold">More</span>
        </button>
      </nav>
    </>
  );
};

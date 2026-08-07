'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Stethoscope, FileText, ScanLine, Pill,
  MapPin, FolderHeart, Calendar, Users, Syringe, Bot,
  HeartPulse, Settings, Activity, ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { language, activeProfile } = useApp();

  const clinicalNav = [
    { name: t(language, 'navSymptoms'),      path: '/dashboard/symptoms',      icon: Stethoscope },
    { name: t(language, 'navReports'),       path: '/dashboard/reports',       icon: FileText },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine },
    { name: t(language, 'navMeds'),          path: '/dashboard/medications',   icon: Pill },
    { name: t(language, 'navCare'),          path: '/dashboard/care',          icon: MapPin },
  ];

  const managementNav = [
    { name: t(language, 'navHome'),         path: '/dashboard',                icon: LayoutDashboard },
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
        className={`group flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 ${
          isActive
            ? 'bg-[#4D50A2] text-white border border-white/20 shadow-md'
            : 'text-[#CBD0FB] hover:text-white hover:bg-[#4D50A2]/25'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-[#F9DF77] text-[#2F3273] shadow-sm font-black'
                : 'bg-white/5 text-[#CBD0FB] group-hover:text-white group-hover:bg-white/10'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span>{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-3.5 w-3.5 text-[#F9DF77]" />}
      </Link>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (#2F3273 DEEP INDIGO PREMIUM SAAS RAIL) ────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-30 bg-[#2F3273] text-white border-r border-[#4D50A2]/30 shadow-xl">
        {/* Logo Header */}
        <div className="p-5 border-b border-[#4D50A2]/30 flex items-center justify-between">
          <Link href="/dashboard">
            <Logo size="md" showText={true} />
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#F9DF77] text-[#2F3273]">
            PRO
          </span>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          {/* Clinical Tools */}
          <div>
            <div className="flex items-center gap-1.5 px-3 mb-2.5">
              <Activity className="h-3 w-3 text-[#F9DF77]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#CBD0FB]/70">
                Clinical Tools
              </span>
            </div>
            <div className="space-y-1">
              {clinicalNav.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>

          {/* Patient Workspace */}
          <div>
            <div className="px-3 mb-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#CBD0FB]/70">
                Patient Workspace
              </span>
            </div>
            <div className="space-y-1">
              {managementNav.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Patient Profile Card at bottom */}
        <div className="p-3 border-t border-[#4D50A2]/30">
          <Link
            href="/dashboard/settings"
            className="p-3 rounded-xl flex items-center gap-3 bg-[#1E204A] border border-[#4D50A2]/40 hover:bg-[#4D50A2]/20 transition-all cursor-pointer shadow-inner"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-[#2F3273] bg-[#F9DF77] text-xs shrink-0 shadow-sm">
              {activeProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold truncate text-white">
                {activeProfile.name}
              </div>
              <div className="text-[10px] font-semibold text-[#CBD0FB]/80">
                {activeProfile.relationship} · {activeProfile.bloodGroup || 'O+'}
              </div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0 bg-[#F9DF77]" />
          </Link>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-2 py-2.5 bg-[#2F3273] border-t border-[#4D50A2]/40 shadow-2xl"
      >
        {[
          { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
          { href: '/dashboard/symptoms', icon: Stethoscope, label: 'Symptoms' },
          { href: '/dashboard/assistant', icon: Bot, label: 'AI Chat' },
          { href: '/dashboard/medications', icon: Pill, label: 'Meds' },
          { href: '/dashboard/records', icon: FolderHeart, label: 'Records' },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#4D50A2] text-white font-extrabold shadow-sm'
                  : 'text-[#CBD0FB] hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] font-extrabold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

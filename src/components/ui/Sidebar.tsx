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
        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[12px] font-bold transition-all duration-200 ${
          isActive
            ? 'bg-[#E8E3FF] dark:bg-[#2D2845] text-[#6E56CF] dark:text-[#8C73FF] shadow-sm border border-[#6E56CF]/15 dark:border-[#8C73FF]/20'
            : 'text-[#6B677E] dark:text-[#A0A0A8] hover:text-[#1E1B2E] dark:hover:text-[#F6F6F8] hover:bg-[#E8E3FF]/40 dark:hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? 'bg-[#6E56CF] dark:bg-[#8C73FF] text-white shadow-sm'
                : 'bg-transparent text-[#6B677E] dark:text-[#A0A0A8] group-hover:text-[#6E56CF] dark:group-hover:text-[#8C73FF]'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span>{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-3 w-3 text-[#6E56CF] dark:text-[#8C73FF]" />}
      </Link>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (TRANSLUCENT FROSTED GLASS PANEL) ────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-20 glass-panel border-r border-[#6E56CF]/10 dark:border-white/10 rounded-none shadow-sm">
        {/* Logo Header */}
        <div className="p-5 border-b border-[#6E56CF]/10 dark:border-white/10">
          <Link href="/dashboard">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {/* Clinical Tools */}
          <div>
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Activity className="h-3 w-3 text-[#6E56CF] dark:text-[#8C73FF]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B677E] dark:text-[#A0A0A8]">
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
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B677E] dark:text-[#A0A0A8]">
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
        <div className="p-3 border-t border-[#6E56CF]/10 dark:border-white/10">
          <Link
            href="/dashboard/settings"
            title="Click to edit your profile details"
            className="p-3 rounded-2xl flex items-center gap-3 bg-[#F8F7FF] dark:bg-[#23232A] border border-[#6E56CF]/10 dark:border-white/10 hover:bg-[#E8E3FF]/50 dark:hover:bg-white/5 transition-all cursor-pointer shadow-sm"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #6E56CF 0%, #7C5CFC 100%)' }}
            >
              {activeProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-extrabold truncate text-[#1E1B2E] dark:text-[#F6F6F8]">
                {activeProfile.name}
              </div>
              <div className="text-[9px] font-semibold text-[#6B677E] dark:text-[#A0A0A8]">
                {activeProfile.relationship} · {activeProfile.bloodGroup || 'O+'}
              </div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0 bg-[#6E56CF] dark:bg-[#8C73FF]" />
          </Link>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-2 py-2 bg-white/95 dark:bg-[#18181D]/95 backdrop-blur-xl border-t border-[#6E56CF]/10 dark:border-white/10 shadow-lg"
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
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#E8E3FF] dark:bg-[#2D2845] text-[#6E56CF] dark:text-[#8C73FF] font-bold'
                  : 'text-[#6B677E] dark:text-[#A0A0A8]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

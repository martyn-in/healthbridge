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
    { name: t(language, 'navSymptoms'),      path: '/dashboard/symptoms',      icon: Stethoscope, color: '#FF3366', bg: 'rgba(255,51,102,0.12)' },
    { name: t(language, 'navReports'),       path: '/dashboard/reports',       icon: FileText,    color: '#7C5CFC', bg: 'rgba(124,92,252,0.12)' },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine,    color: '#5B42F3', bg: 'rgba(91,66,243,0.12)' },
    { name: t(language, 'navMeds'),          path: '/dashboard/medications',   icon: Pill,        color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
    { name: t(language, 'navCare'),          path: '/dashboard/care',          icon: MapPin,      color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
  ];

  const managementNav = [
    { name: t(language, 'navHome'),         path: '/dashboard',                icon: LayoutDashboard, color: '#5B42F3', bg: 'rgba(91,66,243,0.12)' },
    { name: 'Progress & Insights',          path: '/dashboard/progress',       icon: Activity,        color: '#8C73FF', bg: 'rgba(140,115,255,0.12)' },
    { name: t(language, 'navRecords'),      path: '/dashboard/records',        icon: FolderHeart,     color: '#7C5CFC', bg: 'rgba(124,92,252,0.12)' },
    { name: t(language, 'navAppointments'), path: '/dashboard/appointments',   icon: Calendar,        color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
    { name: t(language, 'navFamily'),       path: '/dashboard/family',         icon: Users,           color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
    { name: t(language, 'navVaccines'),     path: '/dashboard/vaccinations',   icon: Syringe,         color: '#FF3366', bg: 'rgba(255,51,102,0.12)' },
    { name: t(language, 'navAssistant'),    path: '/dashboard/assistant',      icon: Bot,             color: '#5B42F3', bg: 'rgba(91,66,243,0.12)' },
    { name: t(language, 'navWellness'),     path: '/dashboard/wellness',       icon: HeartPulse,      color: '#00C875', bg: 'rgba(0,200,117,0.12)' },
    { name: t(language, 'navSettings'),     path: '/dashboard/settings',       icon: Settings,        color: '#8896A7', bg: 'rgba(136,150,167,0.12)' },
  ];

  const NavItem = ({ item }: { item: typeof clinicalNav[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;
    return (
      <Link
        href={item.path}
        className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200 ${
          isActive
            ? 'shadow-md border border-[var(--surface-border)]'
            : 'text-[#1E1B2E] dark:text-[#F8FAFC] hover:bg-[var(--accent-lavender)]'
        }`}
        style={{
          background: isActive ? item.bg : 'transparent',
          color: isActive ? item.color : undefined,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0"
            style={{
              background: isActive ? item.bg : 'var(--accent-lavender)',
              color: isActive ? item.color : undefined,
            }}
          >
            <Icon className={`h-3.5 w-3.5 ${!isActive ? 'text-[#5E5A73] dark:text-[#CBD5E1]' : ''}`} />
          </div>
          <span className={!isActive ? 'text-[#1E1B2E] dark:text-[#F8FAFC]' : ''}>{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
      </Link>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-20 border-r border-[var(--surface-border)] bg-[var(--bg-card)] backdrop-blur-xl transition-colors duration-300"
      >
        {/* Logo */}
        <div className="p-5 border-b border-[var(--surface-border)]">
          <Link href="/dashboard">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {/* Clinical Tools */}
          <div>
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Activity className="h-2.5 w-2.5 text-[#5B42F3] dark:text-[#9D8CFF]" />
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">Clinical Tools</span>
            </div>
            <div className="space-y-1">
              {clinicalNav.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>

          {/* Patient Workspace */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">Patient Workspace</span>
            </div>
            <div className="space-y-1">
              {managementNav.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>
        </div>

        {/* Patient Profile Card at bottom */}
        <div className="p-3 border-t border-[var(--surface-border)]">
          <Link href="/dashboard/settings" title="Click to edit your profile details" className="p-3 rounded-xl flex items-center gap-3 bg-[var(--bg-card-subtle)] border border-[var(--surface-border)] hover:brightness-105 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm shrink-0 bg-[#5B42F3]">
              {activeProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold truncate text-[#1E1B2E] dark:text-[#F8FAFC]">{activeProfile.name}</div>
              <div className="text-[10px] text-[#5E5A73] dark:text-[#CBD5E1] truncate">{activeProfile.relationship} · {activeProfile.bloodGroup || 'O+'}</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  );
};

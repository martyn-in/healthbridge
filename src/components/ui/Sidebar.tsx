'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Stethoscope, FileText, ScanLine, Pill,
  MapPin, FolderHeart, Calendar, Users, Syringe, Bot,
  HeartPulse, Settings, Activity, ChevronRight, Zap,
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
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine,    color: '#0066FF', bg: 'rgba(0,102,255,0.12)' },
    { name: t(language, 'navMeds'),          path: '/dashboard/medications',   icon: Pill,        color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
    { name: t(language, 'navCare'),          path: '/dashboard/care',          icon: MapPin,      color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
  ];

  const managementNav = [
    { name: t(language, 'navHome'),         path: '/dashboard',                icon: LayoutDashboard, color: '#0066FF', bg: 'rgba(0,102,255,0.12)' },
    { name: 'Progress & Insights',          path: '/dashboard/progress',       icon: Activity,        color: '#8C73FF', bg: '#EEEAFE' },
    { name: t(language, 'navRecords'),      path: '/dashboard/records',        icon: FolderHeart,     color: '#7C5CFC', bg: 'rgba(124,92,252,0.12)' },
    { name: t(language, 'navAppointments'), path: '/dashboard/appointments',   icon: Calendar,        color: '#FF9500', bg: 'rgba(255,149,0,0.12)' },
    { name: t(language, 'navFamily'),       path: '/dashboard/family',         icon: Users,           color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
    { name: t(language, 'navVaccines'),     path: '/dashboard/vaccinations',   icon: Syringe,         color: '#FF3366', bg: 'rgba(255,51,102,0.12)' },
    { name: t(language, 'navAssistant'),    path: '/dashboard/assistant',      icon: Bot,             color: '#0066FF', bg: 'rgba(0,102,255,0.12)' },
    { name: t(language, 'navWellness'),     path: '/dashboard/wellness',       icon: HeartPulse,      color: '#00C875', bg: 'rgba(0,200,117,0.12)' },
    { name: t(language, 'navSettings'),     path: '/dashboard/settings',       icon: Settings,        color: '#8896A7', bg: 'rgba(136,150,167,0.12)' },
  ];

  const NavItem = ({ item }: { item: typeof clinicalNav[0] }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;
    return (
      <Link
        href={item.path}
        className="group flex items-center justify-between px-3 py-2.5 rounded-2xl text-[12px] font-semibold transition-all duration-200"
        style={{
          background: isActive ? item.bg : 'transparent',
          color: isActive ? item.color : '#4A5568',
          border: isActive ? `1px solid ${item.color}25` : '1px solid transparent',
          boxShadow: isActive ? `0 2px 8px ${item.color}18` : 'none',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: isActive ? item.bg : 'transparent',
              color: isActive ? item.color : '#8896A7',
            }}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span>{item.name}</span>
        </div>
        {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
      </Link>
    );
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 z-20"
        style={{
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(200,215,235,0.50)',
          boxShadow: '4px 0 24px rgba(10,20,60,0.05)',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#6E56CF]/10">
          <Link href="/dashboard">
            <Logo size="md" showText={true} />
          </Link>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {/* Clinical Tools */}
          <div>
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Activity className="h-2.5 w-2.5" style={{ color: '#0066FF' }} />
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Clinical Tools</span>
            </div>
            <div className="space-y-0.5">
              {clinicalNav.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>

          {/* Patient Workspace */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Patient Workspace</span>
            </div>
            <div className="space-y-0.5">
              {managementNav.map(item => <NavItem key={item.path} item={item} />)}
            </div>
          </div>
        </div>

        {/* Patient Profile Card at bottom */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(200,215,235,0.40)' }}>
          <Link href="/dashboard/settings" title="Click to edit your profile details" className="p-3 rounded-2xl flex items-center gap-3 hover:bg-[#0066FF]/10 transition-colors cursor-pointer"
            style={{ background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.12)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #0066FF, #7C5CFC)', boxShadow: '0 3px 8px rgba(0,102,255,0.30)' }}>
              {activeProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-extrabold truncate" style={{ color: '#0D1B2A' }}>{activeProfile.name}</div>
              <div className="text-[9px] font-medium" style={{ color: '#9BAABF' }}>
                {activeProfile.relationship} · {activeProfile.bloodGroup}
              </div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#00C875', boxShadow: '0 0 0 2px rgba(0,200,117,0.25)' }} />
          </Link>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-2 py-2"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(200,215,235,0.50)',
          boxShadow: '0 -4px 24px rgba(10,20,60,0.08)',
        }}>
        {[
          { href: '/dashboard',            icon: LayoutDashboard, label: 'Overview' },
          { href: '/dashboard/symptoms',   icon: Stethoscope,     label: 'Symptoms' },
          { href: '/dashboard/assistant',  icon: Bot,             label: 'AI Chat' },
          { href: '/dashboard/medications',icon: Pill,            label: 'Meds' },
          { href: '/dashboard/records',    icon: FolderHeart,     label: 'Records' },
        ].map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all"
              style={{
                background: isActive ? 'rgba(0,102,255,0.10)' : 'transparent',
                color: isActive ? '#0066FF' : '#8896A7',
              }}>
              <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

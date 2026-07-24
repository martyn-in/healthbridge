'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  FileText,
  ScanLine,
  Pill,
  MapPin,
  FolderHeart,
  Calendar,
  Users,
  Syringe,
  Bot,
  HeartPulse,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { language } = useApp();

  const flagshipNav = [
    { name: t(language, 'navSymptoms'), path: '/dashboard/symptoms', icon: Stethoscope, badge: 'Flagship' },
    { name: t(language, 'navReports'), path: '/dashboard/reports', icon: FileText, badge: 'Flagship' },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine, badge: 'Flagship' },
    { name: t(language, 'navMeds'), path: '/dashboard/medications', icon: Pill, badge: 'Flagship' },
    { name: t(language, 'navCare'), path: '/dashboard/care', icon: MapPin, badge: 'Flagship' },
  ];

  const supportingNav = [
    { name: t(language, 'navHome'), path: '/dashboard', icon: LayoutDashboard },
    { name: t(language, 'navRecords'), path: '/dashboard/records', icon: FolderHeart },
    { name: t(language, 'navAppointments'), path: '/dashboard/appointments', icon: Calendar },
    { name: t(language, 'navFamily'), path: '/dashboard/family', icon: Users },
    { name: t(language, 'navVaccines'), path: '/dashboard/vaccinations', icon: Syringe },
    { name: t(language, 'navAssistant'), path: '/dashboard/assistant', icon: Bot },
    { name: t(language, 'navWellness'), path: '/dashboard/wellness', icon: HeartPulse },
    { name: t(language, 'navSettings'), path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Collapsible Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0 z-20 transition-colors">
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <Link href="/">
            <Logo size="md" />
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Flagship Workflows Section */}
          <div>
            <div className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-cyan-400 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Flagship Workflows
            </div>
            <div className="space-y-1">
              {flagshipNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-navy-900 to-teal-700 text-white shadow-md shadow-teal-500/10'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : 'text-teal-600 dark:text-teal-400'}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Core Modules Section */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Health Platform
            </div>
            <div className="space-y-1">
              {supportingNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-cyan-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex justify-around items-center text-[10px] font-medium">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard' ? 'text-teal-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/dashboard/symptoms"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard/symptoms' ? 'text-teal-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Stethoscope className="h-5 w-5" />
          <span>Symptoms</span>
        </Link>
        <Link
          href="/dashboard/assistant"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard/assistant' ? 'text-teal-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bot className="h-5 w-5 text-teal-600" />
          <span>Aira AI</span>
        </Link>
        <Link
          href="/dashboard/medications"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard/medications' ? 'text-teal-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Pill className="h-5 w-5" />
          <span>Meds</span>
        </Link>
        <Link
          href="/dashboard/records"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard/records' ? 'text-teal-600 dark:text-cyan-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FolderHeart className="h-5 w-5" />
          <span>Records</span>
        </Link>
      </nav>
    </>
  );
};

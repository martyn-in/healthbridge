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
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { language } = useApp();

  const primaryNav = [
    { name: t(language, 'navSymptoms'), path: '/dashboard/symptoms', icon: Stethoscope },
    { name: t(language, 'navReports'), path: '/dashboard/reports', icon: FileText },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine },
    { name: t(language, 'navMeds'), path: '/dashboard/medications', icon: Pill },
    { name: t(language, 'navCare'), path: '/dashboard/care', icon: MapPin },
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
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 backdrop-blur-md h-screen sticky top-0 shrink-0 z-20 transition-colors">
        {/* Top Logo */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/" className="focus-visible:ring-1 focus-visible:ring-teal-500 rounded-lg outline-none block">
            <Logo size="md" />
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Primary Workflows */}
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Primary Workflows
            </div>
            <div className="space-y-0.5">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 outline-none ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold border-l-2 border-teal-500'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Supporting Modules */}
          <div>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Platform Tools
            </div>
            <div className="space-y-0.5">
              {supportingNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 outline-none ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold border-l-2 border-teal-500'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/40 font-medium'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex justify-around items-center text-[10px] font-medium">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            pathname === '/dashboard' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/dashboard/symptoms"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            pathname === '/dashboard/symptoms' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          <span>Symptoms</span>
        </Link>
        <Link
          href="/dashboard/assistant"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            pathname === '/dashboard/assistant' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bot className="h-4 w-4 text-teal-500" />
          <span>Assistant</span>
        </Link>
        <Link
          href="/dashboard/medications"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            pathname === '/dashboard/medications' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Pill className="h-4 w-4" />
          <span>Meds</span>
        </Link>
        <Link
          href="/dashboard/records"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            pathname === '/dashboard/records' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FolderHeart className="h-4 w-4" />
          <span>Records</span>
        </Link>
      </nav>
    </>
  );
};

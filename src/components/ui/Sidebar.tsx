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
  Activity,
  UserCheck,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { language, currentUser } = useApp();

  const isDoctor = currentUser?.role === 'Physician';
  const isAdmin = currentUser?.role === 'Admin';

  // Role-specific navigation arrays
  const doctorPrimaryNav = [
    { name: 'Physician Command Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patient Lab OCR Reviews', path: '/dashboard/reports', icon: FileText },
    { name: 'Prescription Generator', path: '/dashboard/prescriptions', icon: ScanLine },
    { name: 'Consultation Schedule', path: '/dashboard/appointments', icon: Calendar },
    { name: 'Clinical Decision Support', path: '/dashboard/assistant', icon: Bot },
  ];

  const doctorSecondaryNav = [
    { name: 'Patient Directory', path: '/dashboard/family', icon: Users },
    { name: 'Hospital & Clinic Network', path: '/dashboard/care', icon: MapPin },
    { name: 'Clinical Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const patientPrimaryNav = [
    { name: t(language, 'navSymptoms'), path: '/dashboard/symptoms', icon: Stethoscope },
    { name: t(language, 'navReports'), path: '/dashboard/reports', icon: FileText },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine },
    { name: t(language, 'navMeds'), path: '/dashboard/medications', icon: Pill },
    { name: t(language, 'navCare'), path: '/dashboard/care', icon: MapPin },
  ];

  const patientSecondaryNav = [
    { name: t(language, 'navHome'), path: '/dashboard', icon: LayoutDashboard },
    { name: t(language, 'navRecords'), path: '/dashboard/records', icon: FolderHeart },
    { name: t(language, 'navAppointments'), path: '/dashboard/appointments', icon: Calendar },
    { name: t(language, 'navFamily'), path: '/dashboard/family', icon: Users },
    { name: t(language, 'navVaccines'), path: '/dashboard/vaccinations', icon: Syringe },
    { name: t(language, 'navAssistant'), path: '/dashboard/assistant', icon: Bot },
    { name: t(language, 'navWellness'), path: '/dashboard/wellness', icon: HeartPulse },
    { name: t(language, 'navSettings'), path: '/dashboard/settings', icon: Settings },
  ];

  const primaryNav = isDoctor ? doctorPrimaryNav : patientPrimaryNav;
  const secondaryNav = isDoctor ? doctorSecondaryNav : patientSecondaryNav;

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0 z-20 transition-colors">
        {/* Top Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold uppercase text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700">
            {currentUser?.role || 'Patient'}
          </span>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-6">
          {/* Section 1 */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-teal-600 dark:text-teal-400" />
              <span>{isDoctor ? 'Physician Workspaces' : 'Clinical Workflows'}</span>
            </div>
            <div className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold border border-teal-200/80 dark:border-teal-800/60'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {isDoctor ? 'Clinical Operations' : 'Patient Workspace'}
            </div>
            <div className="space-y-1">
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border border-slate-200 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
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
            pathname === '/dashboard' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>{isDoctor ? 'Clinical' : 'Overview'}</span>
        </Link>
        <Link
          href="/dashboard/reports"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard/reports' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Reports</span>
        </Link>
        <Link
          href="/dashboard/assistant"
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
            pathname === '/dashboard/assistant' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Bot className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>AI Assistant</span>
        </Link>
      </nav>
    </>
  );
};

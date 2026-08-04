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
  LogOut,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { language, currentUser, logout } = useApp();
  const router = useRouter();

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

  const adminPrimaryNav = [
    { name: 'Hospital Command Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctor Management', path: '/dashboard/clinic-admin', icon: Users },
    { name: 'Hospital Management', path: '/dashboard/super-admin', icon: Building2 },
    { name: 'Appointments & Schedule', path: '/dashboard/appointments', icon: Calendar },
  ];

  const adminSecondaryNav = [
    { name: 'Departments & Staffing', path: '/dashboard/receptionist', icon: Stethoscope },
    { name: 'Analytics & Audits', path: '/dashboard/reports', icon: FileSpreadsheet },
    { name: 'Administrative Settings', path: '/dashboard/settings', icon: Settings },
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

  const primaryNav = isDoctor ? doctorPrimaryNav : isAdmin ? adminPrimaryNav : patientPrimaryNav;
  const secondaryNav = isDoctor ? doctorSecondaryNav : isAdmin ? adminSecondaryNav : patientSecondaryNav;

  const roleColor = isDoctor
    ? 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800'
    : isAdmin
    ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800'
    : 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';

  const NavItem = ({ item, secondary = false }: { item: any; secondary?: boolean }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;
    return (
      <Link
        key={item.path}
        href={item.path}
        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
          isActive
            ? secondary
              ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-700 nav-active-accent'
              : 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/80 dark:border-teal-800/60 nav-active-accent'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent'
        }`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 transition-colors ${
            isActive
              ? secondary
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-teal-600 dark:text-teal-400'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
          }`}
        />
        <span className="truncate">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0 z-20 transition-colors">
        {/* Top Logo Area */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <span className={`chip text-[10px] uppercase font-extrabold tracking-wide border ${roleColor}`}>
            {currentUser?.role || 'Patient'}
          </span>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section 1 — Primary */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 px-3 mb-3">
              <Activity className="h-3 w-3 text-teal-500 dark:text-teal-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isDoctor ? 'Physician Workspaces' : 'Clinical Workflows'}
              </span>
            </div>
            {primaryNav.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 dark:bg-slate-800 mx-1" />

          {/* Section 2 — Secondary */}
          <div className="space-y-1">
            <div className="px-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isDoctor ? 'Clinical Operations' : 'Patient Workspace'}
              </span>
            </div>
            {secondaryNav.map((item) => (
              <NavItem key={item.path} item={item} secondary />
            ))}
          </div>
        </div>

        {/* Bottom Identity Card */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-xs shrink-0">
              {currentUser?.avatarInitials || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Guest'}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {currentUser?.email || ''}
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/96 dark:bg-slate-900/96 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex justify-around items-center safe-area-pb">
        {(isAdmin
          ? [
              { href: '/dashboard', label: 'Command', icon: LayoutDashboard },
              { href: '/dashboard/clinic-admin', label: 'Doctors', icon: Users },
              { href: '/dashboard/super-admin', label: 'Wards', icon: Building2 },
            ]
          : isDoctor
          ? [
              { href: '/dashboard', label: 'Clinical', icon: LayoutDashboard },
              { href: '/dashboard/reports', label: 'Reports', icon: FileText },
              { href: '/dashboard/assistant', label: 'AI Assistant', icon: Bot },
            ]
          : [
              { href: '/dashboard/symptoms', label: 'Symptoms', icon: Stethoscope },
              { href: '/dashboard/reports', label: 'Reports', icon: FileText },
              { href: '/dashboard/assistant', label: 'AI Assistant', icon: Bot },
            ]
        ).map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all text-[10px] font-semibold ${
                active
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? 'text-teal-600 dark:text-teal-400' : ''}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

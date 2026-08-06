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
  Box,
  Layers,
  Sliders,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export function Max3DSidebar() {
  const pathname = usePathname();
  const { language } = useApp();

  const clinicalNav = [
    { name: t(language, 'navSymptoms'), path: '/dashboard/symptoms', icon: Stethoscope },
    { name: t(language, 'navReports'), path: '/dashboard/reports', icon: FileText },
    { name: t(language, 'navPrescriptions'), path: '/dashboard/prescriptions', icon: ScanLine },
    { name: t(language, 'navMeds'), path: '/dashboard/medications', icon: Pill },
    { name: t(language, 'navCare'), path: '/dashboard/care', icon: MapPin },
  ];

  const managementNav = [
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
    <aside className="hidden lg:flex flex-col w-64 border-r border-cyan-500/30 bg-[#0a0d13] text-slate-100 h-screen sticky top-0 shrink-0 z-20 cad-viewport-grid">
      {/* 3ds Max Modifier Stack Header */}
      <div className="p-4 border-b border-cyan-500/30 cad-header-strip flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-400">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span>MODIFIER STACK</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          CAD 3D
        </span>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Clinical 3D Tools Section */}
        <div>
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-cyan-400" />
              <span>3D Clinical Modifiers</span>
            </span>
            <span className="text-[9px] text-slate-500">[Viewport #1]</span>
          </div>

          <div className="space-y-1 font-mono">
            {clinicalNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/80 shadow-md glow-cyan'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Patient Workspace Section */}
        <div>
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Box className="h-3 w-3 text-teal-400" />
              <span>Patient CAD Node</span>
            </span>
            <span className="text-[9px] text-slate-500">[Stack #2]</span>
          </div>

          <div className="space-y-1 font-mono">
            {managementNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-950/80 text-teal-300 font-bold border border-teal-500/80 shadow-md glow-emerald'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

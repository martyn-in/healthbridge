'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, QrCode, ShieldAlert, FileText, Stethoscope, Pill, Activity } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const JudgeDemoBar: React.FC<{ onOpenHealthCard?: () => void }> = ({ onOpenHealthCard }) => {
  const { triggerSos } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-slate-900 text-slate-200 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px]">
            <Activity className="h-3.5 w-3.5 text-teal-400" /> System Status: Operational
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            · End-to-end clinical workflow suite
          </span>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => router.push('/dashboard/symptoms')}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-200 font-medium transition-colors text-[11px]"
            >
              <Stethoscope className="h-3 w-3 text-teal-400" /> Triage
            </button>
            <button
              onClick={() => router.push('/dashboard/reports')}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-200 font-medium transition-colors text-[11px]"
            >
              <FileText className="h-3 w-3 text-teal-400" /> Lab OCR
            </button>
            <button
              onClick={() => router.push('/dashboard/prescriptions')}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-200 font-medium transition-colors text-[11px]"
            >
              <Pill className="h-3 w-3 text-teal-400" /> Rx Scan
            </button>
            <button
              onClick={() => triggerSos()}
              className="flex items-center gap-1 bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 px-2.5 py-1 rounded-lg font-semibold transition-colors text-[11px]"
            >
              <ShieldAlert className="h-3 w-3 text-red-400" /> Emergency SOS
            </button>
            {onOpenHealthCard && (
              <button
                onClick={onOpenHealthCard}
                className="flex items-center gap-1 bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-800/60 px-2.5 py-1 rounded-lg font-semibold transition-colors text-[11px]"
              >
                <QrCode className="h-3 w-3 text-teal-400" /> Digital ID
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-slate-200 p-0.5"
        >
          {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

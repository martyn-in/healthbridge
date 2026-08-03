'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, QrCode, ShieldAlert, FileText, Stethoscope, Pill, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export const JudgeDemoBar: React.FC<{ onOpenHealthCard?: () => void }> = ({ onOpenHealthCard }) => {
  const { clearAllDataToFreshState, loadSamplePresets, triggerSos } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-navy-900 via-teal-900 to-navy-900 text-white shadow-md border-b border-teal-500/30 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-wide text-teal-300 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-cyan-300" /> Live Application Active
          </span>
          <span className="hidden md:inline text-slate-300">
            • Ready for real user entries & live OCR/GPS execution
          </span>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => router.push('/dashboard/symptoms')}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-white font-medium transition-colors"
            >
              <Stethoscope className="h-3.5 w-3.5 text-cyan-300" /> Symptoms
            </button>
            <button
              onClick={() => router.push('/dashboard/reports')}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-white font-medium transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-300" /> Upload Report
            </button>
            <button
              onClick={() => router.push('/dashboard/prescriptions')}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md text-white font-medium transition-colors"
            >
              <Pill className="h-3.5 w-3.5 text-cyan-300" /> Scan Rx
            </button>
            <button
              onClick={() => triggerSos()}
              className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 px-2.5 py-1 rounded-md text-white font-semibold transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-white" /> Emergency SOS
            </button>
            {onOpenHealthCard && (
              <button
                onClick={onOpenHealthCard}
                className="flex items-center gap-1 bg-teal-600/80 hover:bg-teal-600 px-2.5 py-1 rounded-md text-white font-semibold transition-colors"
              >
                <QrCode className="h-3.5 w-3.5 text-teal-200" /> Live QR Pass
              </button>
            )}
            <button
              onClick={clearAllDataToFreshState}
              className="flex items-center gap-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-1 rounded-md font-semibold transition-colors border border-amber-500/40"
              title="Reset application to clean live state"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear Live State
            </button>
            <button
              onClick={loadSamplePresets}
              className="flex items-center gap-1 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30 px-2 py-1 rounded-md font-semibold transition-colors border border-cyan-500/40"
              title="Load sample reference data for evaluation"
            >
              <Sparkles className="h-3.5 w-3.5" /> Load Clinical Data
            </button>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-0.5"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

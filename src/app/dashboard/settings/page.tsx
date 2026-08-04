'use client';

import React from 'react';
import { Settings as SettingsIcon, Shield, Lock, Download, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { qrSharingEnabled, setQrSharingEnabled, clearAllDataToFreshState, showToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <SettingsIcon className="h-3.5 w-3.5" /> Governance & Security
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Privacy Center & Platform Settings
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Control medical data visibility, manage privacy consent, export health record archives, and configure emergency access passes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* QR Access Control */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Digital Health Pass Security
          </h3>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Emergency QR Pass Authorization
              </span>
              <span className="text-slate-500">
                When enabled, verified first responders can scan your QR code to view critical blood group and allergy alerts.
              </span>
            </div>
            <button
              onClick={() => {
                setQrSharingEnabled(!qrSharingEnabled);
                showToast(qrSharingEnabled ? 'QR Access Disabled' : 'QR Access Enabled');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                qrSharingEnabled
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              {qrSharingEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Data Export & Reset */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Data Portability & System Reset
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => showToast('Exporting complete patient JSON record archive...')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-4 w-4" /> Export Complete Health Archive
            </button>

            <button
              onClick={clearAllDataToFreshState}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Reset Application State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

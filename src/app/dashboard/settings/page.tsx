'use client';

import React from 'react';
import { Settings as SettingsIcon, Shield, Lock, Download, RotateCcw, QrCode, Database, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { qrSharingEnabled, setQrSharingEnabled, clearAllDataToFreshState, showToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <SettingsIcon className="h-3 w-3" /> Governance & Security
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Privacy Center & Platform Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Control medical data visibility, manage privacy consent, export health record archives, and configure emergency access passes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-4">
        {/* QR Access Control */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Digital Health Pass Security
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 shrink-0">
                  <QrCode className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">
                    Emergency QR Pass Authorization
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                    When enabled, verified first responders can scan your QR code to view critical blood group and allergy alerts.
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setQrSharingEnabled(!qrSharingEnabled);
                  showToast(qrSharingEnabled ? 'QR Access Disabled' : 'QR Access Enabled');
                }}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  qrSharingEnabled
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}
              >
                {qrSharingEnabled ? '✓ Enabled' : '✗ Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Export & Reset */}
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Data Portability & System Reset
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Database className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">Export Complete Health Archive</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Download a complete JSON archive of all your health records, medications, lab reports, and appointments.</span>
              </div>
              <button
                onClick={() => showToast('Exporting complete patient JSON record archive...')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold transition-all shrink-0"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
              <RotateCcw className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-red-800 dark:text-red-300 text-xs block">Reset Application State</span>
                <span className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5 block">Clear all locally stored data and return the application to its initial fresh state. This action cannot be undone.</span>
              </div>
              <button
                onClick={clearAllDataToFreshState}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold transition-all shrink-0 border border-red-200 dark:border-red-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

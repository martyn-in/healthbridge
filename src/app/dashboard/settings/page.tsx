'use client';

import React from 'react';
import { Settings as SettingsIcon, Shield, Lock, Download, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { qrSharingEnabled, setQrSharingEnabled, clearAllDataToFreshState, showToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Privacy Center & Platform Settings
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Control your medical data visibility, manage AI consent, export stored records, and adjust QR emergency passes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* QR Access Control */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-teal-600" /> Digital Health Pass Security
          </h3>
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Public QR Code Access
              </span>
              <span className="text-slate-500">
                When enabled, first responders can scan your QR code to read limited emergency data.
              </span>
            </div>
            <button
              onClick={() => {
                setQrSharingEnabled(!qrSharingEnabled);
                showToast(qrSharingEnabled ? 'QR Access Disabled' : 'QR Access Enabled');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                qrSharingEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
              }`}
            >
              {qrSharingEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Data Export & Reset */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-600" /> Data Ownership & Demo Controls
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => showToast('Exporting all health JSON data...')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700 flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" /> Download Complete Health Archive
            </button>

            <button
              onClick={clearAllDataToFreshState}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" /> Clear All Data & Reset State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

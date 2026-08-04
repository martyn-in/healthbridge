'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, ShieldAlert, X, Download, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Logo } from './Logo';

export const DigitalHealthCardModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { activeProfile, emergencyContacts, qrSharingEnabled, setQrSharingEnabled, showToast } = useApp();

  const [shareBloodGroup, setShareBloodGroup] = useState(true);
  const [shareAllergies, setShareAllergies] = useState(true);
  const [shareContacts, setShareContacts] = useState(true);
  const [shareConditions, setShareConditions] = useState(true);

  if (!isOpen) return null;

  const primaryContact = emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0];

  const qrPayload = JSON.stringify({
    cardId: `HB-QR-${activeProfile.id}`,
    name: activeProfile.name,
    bloodGroup: shareBloodGroup ? activeProfile.bloodGroup : 'Restricted',
    allergies: shareAllergies ? activeProfile.allergies : ['Restricted'],
    conditions: shareConditions ? activeProfile.conditions : ['Restricted'],
    emergencyPhone: shareContacts ? primaryContact?.phone : 'Restricted',
    status: qrSharingEnabled ? 'ACTIVE' : 'DISABLED',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-modal border border-slate-200 dark:border-slate-800 animate-fade-in-up">
        {/* Top Accent Strip */}
        <div className="h-1 w-full bg-teal-600" />

        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Card Preview */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-850 p-5 text-white shadow-card space-y-4 border border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] tracking-widest text-teal-400 font-extrabold uppercase block mb-1">
                  Emergency Digital Health Pass
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">{activeProfile.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {activeProfile.age} yrs • {activeProfile.gender}
                </p>
              </div>
              <div className="rounded-lg bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-teal-400 border border-teal-500/20">
                {activeProfile.bloodGroup}
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex items-center justify-center bg-white p-3 rounded-lg shadow-inner">
              {qrSharingEnabled ? (
                <QRCodeSVG value={qrPayload} size={140} level="M" />
              ) : (
                <div className="flex flex-col items-center justify-center h-[140px] w-[140px] bg-slate-50 text-slate-400 rounded">
                  <Lock className="h-8 w-8 text-red-500 mb-1" />
                  <span className="text-[10px] font-bold text-red-600">QR DISABLED</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-center text-slate-400 leading-normal">
              {qrSharingEnabled
                ? 'Scan with camera in an emergency to access limited medical pass.'
                : 'QR code access is currently disabled.'}
            </p>
          </div>

          {/* QR Safety Controls */}
          <div className="space-y-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-teal-500" /> QR Access Status
              </span>
              <button
                onClick={() => {
                  setQrSharingEnabled(!qrSharingEnabled);
                  showToast(qrSharingEnabled ? 'QR Access Disabled' : 'QR Access Enabled');
                }}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  qrSharingEnabled
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                }`}
              >
                {qrSharingEnabled ? 'Disable Access' : 'Enable Access'}
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                Information Shared on QR Code:
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareBloodGroup}
                  onChange={(e) => setShareBloodGroup(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500/20"
                />
                <span>Blood Group ({activeProfile.bloodGroup})</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareAllergies}
                  onChange={(e) => setShareAllergies(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500/20"
                />
                <span>Allergies ({activeProfile.allergies.join(', ') || 'None'})</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareContacts}
                  onChange={(e) => setShareContacts(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500/20"
                />
                <span>Emergency Contact Phone</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                showToast('Health Card downloaded as PNG.');
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 active:scale-[0.98] transition-all"
            >
              <Download className="h-4 w-4" /> Download Card
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

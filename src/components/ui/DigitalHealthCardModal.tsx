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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-700 to-teal-700 p-5 text-white flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Preview */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-navy-900 p-5 text-white shadow-lg space-y-4 border border-teal-500/30">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] tracking-widest text-teal-400 font-bold uppercase">
                  Emergency Digital Health Pass
                </span>
                <h3 className="text-xl font-bold">{activeProfile.name}</h3>
                <p className="text-xs text-slate-300">
                  {activeProfile.age} yrs • {activeProfile.gender}
                </p>
              </div>
              <div className="rounded-lg bg-teal-500/20 px-2.5 py-1 text-xs font-bold text-teal-300 border border-teal-500/40">
                {activeProfile.bloodGroup}
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex items-center justify-center bg-white p-3 rounded-lg shadow-inner">
              {qrSharingEnabled ? (
                <QRCodeSVG value={qrPayload} size={150} level="M" />
              ) : (
                <div className="flex flex-col items-center justify-center h-[150px] w-[150px] bg-slate-100 text-slate-400 rounded">
                  <Lock className="h-10 w-10 text-red-500 mb-1" />
                  <span className="text-[10px] font-bold text-red-600">QR DISABLED</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-center text-slate-300">
              {qrSharingEnabled
                ? 'Scan with camera in an emergency to access limited medical pass.'
                : 'QR code access is currently disabled.'}
            </p>
          </div>

          {/* QR Safety Controls */}
          <div className="space-y-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-teal-600" /> QR Access Status
              </span>
              <button
                onClick={() => {
                  setQrSharingEnabled(!qrSharingEnabled);
                  showToast(qrSharingEnabled ? 'QR Access Disabled' : 'QR Access Enabled');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  qrSharingEnabled
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {qrSharingEnabled ? 'Disable QR Access' : 'Enable QR Access'}
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-900 dark:text-white block">
                Information Shared on QR Code:
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareBloodGroup}
                  onChange={(e) => setShareBloodGroup(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Blood Group ({activeProfile.bloodGroup})
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareAllergies}
                  onChange={(e) => setShareAllergies(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Allergies ({activeProfile.allergies.join(', ') || 'None'})
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareContacts}
                  onChange={(e) => setShareContacts(e.target.checked)}
                  className="rounded text-teal-600"
                />
                Emergency Contact Phone
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                showToast('Health Card downloaded as PNG.');
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
            >
              <Download className="h-4 w-4" /> Download Card
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

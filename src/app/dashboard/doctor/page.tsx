'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Scan,
  ShieldCheck,
  UserCheck,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Activity,
  Calendar,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DoctorQrScannerModal } from '@/components/ui/DoctorQrScannerModal';

export default function DoctorDashboard() {
  const { showToast } = useApp();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [verifiedSessions, setVerifiedSessions] = useState<any[]>([]);

  const handlePatientVerified = (patientData: any) => {
    setVerifiedSessions((prev) => [
      {
        id: `sess-${Date.now()}`,
        patient: patientData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Active Clinical Session',
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-8 pb-12 anim-fade-up">
      {/* Hero Banner */}
      <div className="relative frosted-card rounded-3xl p-8 overflow-hidden border border-white/90">
        <div className="absolute inset-0 bg-slate-900/[0.02] bg-[length:16px_16px] [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl neu-card flex items-center justify-center bg-teal-50 text-teal-600 border border-teal-100">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tight">
                  Doctor Clinical Portal
                </h1>
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-black border border-teal-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Practitioner
                </span>
              </div>
              <p className="text-sm font-medium text-[#9BAABF] mt-1">
                Scan patient Health Pass QR tokens or enter Pass Codes for authorized clinical access.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="pill-btn pill-btn-primary flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all"
          >
            <Scan className="h-5 w-5" />
            <span>Scan Patient QR</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Clinical Access Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="frosted-card rounded-3xl p-8 border border-white/90 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-extrabold text-[#0D1B2A]">
                  Active Patient Access Sessions
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {verifiedSessions.length} Authorized
              </span>
            </div>

            {verifiedSessions.length === 0 ? (
              <div className="neu-card rounded-2xl p-8 text-center bg-white/40 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0D1B2A]">No Active Patient QR Scans</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                    Click "Scan Patient QR" above to request camera access or enter a manual pass code. Patient records are retrieved only upon explicit authorization.
                  </p>
                </div>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="pill-btn pill-btn-ghost text-xs font-bold inline-flex items-center gap-2"
                >
                  <Scan className="w-4 h-4 text-teal-600" /> Start Scanner
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {verifiedSessions.map((sess) => (
                  <div key={sess.id} className="neu-card rounded-2xl p-5 bg-white/60 space-y-4 border border-teal-100">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                          {sess.status} • {sess.timestamp}
                        </span>
                        <h3 className="text-lg font-black text-[#0D1B2A] mt-1">{sess.patient.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {sess.patient.age} yrs • {sess.patient.gender} • Blood: <span className="font-bold text-red-600">{sess.patient.bloodGroup}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => showToast(`Consultation record saved for ${sess.patient.name}`)}
                        className="pill-btn pill-btn-ghost text-xs font-bold"
                      >
                        Add Clinical Note
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-400 block text-[10px] uppercase">Allergies</span>
                        <span className="font-bold text-slate-800">{sess.patient.allergies.join(', ')}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-400 block text-[10px] uppercase">Emergency Contact</span>
                        <span className="font-bold text-slate-800">{sess.patient.emergencyContact.name} ({sess.patient.emergencyContact.phone})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doctor Quick Actions & Guidelines */}
        <div className="space-y-6">
          <div className="frosted-card rounded-3xl p-6 border border-white/90 space-y-5">
            <h3 className="font-extrabold text-[#0D1B2A] text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" /> Clinical Security Protocols
            </h3>
            
            <ul className="space-y-3 text-xs font-medium text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>QR tokens are opaque and contain no raw medical data in plain text.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Camera access activates only when you explicitly click "Start Scanner".</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Camera stream stops immediately upon QR code recognition.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Doctor QR Scanner Modal */}
      <DoctorQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onPatientVerified={handlePatientVerified}
      />
    </div>
  );
}

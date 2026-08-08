import React from 'react';
import { QrCode, Camera } from 'lucide-react';
import Link from 'next/link';

export default function DoctorScanPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
          Scan Patient QR Code
        </h1>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mt-2">
          Request emergency or clinical access to a patient's medical records by scanning their HealthBridge ID.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center aspect-square flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/5 z-0"></div>
        <div className="relative z-10 w-full max-w-sm mx-auto aspect-square border-4 border-dashed border-[#4D50A2]/30 rounded-3xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
          <QrCode className="w-16 h-16 text-[#4D50A2] mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Scanner Ready</h3>
          <p className="text-sm font-semibold text-slate-500 mt-1 mb-6 px-8">
            Position the patient's QR code within the frame to request access.
          </p>
          <button className="px-6 py-3 bg-[#4D50A2] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#3B3E8C] transition-colors shadow-md shadow-[#4D50A2]/20">
            <Camera className="w-5 h-5" />
            Enable Camera
          </button>
        </div>
      </div>
      
      <div className="text-center">
         <Link href="/doctor" className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
            Cancel
         </Link>
      </div>
    </div>
  );
}

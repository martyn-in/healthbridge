'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function DoctorVerificationPage() {
  const [verifying, setVerifying] = useState(false);

  const handleDevVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/auth/dev-verify', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/doctor';
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
            Verification Pending
          </h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] leading-relaxed">
            Your HealthBridge doctor account is currently under administrative review.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold text-slate-700">Google Identity Verified</div>
          </div>
          <div className="flex items-start gap-3 opacity-50">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold text-slate-700">Professional License Verification</div>
          </div>
        </div>

        <p className="text-xs font-semibold text-[var(--text-muted)] pt-4">
          For security and patient confidentiality, clinical access requires manual verification of your medical credentials. You will receive an email once approved.
        </p>

        {/* Hidden Developer Override - to be removed in real production */}
        <div className="pt-8 mt-8 border-t border-slate-100">
          <button 
            onClick={handleDevVerify}
            disabled={verifying}
            className="text-[10px] font-bold text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-widest"
          >
            {verifying ? 'Verifying...' : '[Dev Override: Verify Account]'}
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-400">
        <Logo size="sm" showText={false} />
        <span>HealthBridge Clinical</span>
      </div>
    </div>
  );
}

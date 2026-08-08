'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Stethoscope, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  const handleGoogleLogin = () => {
    // Navigate to server-side Google OAuth 2.0 Authorization Code flow with doctor intent
    window.location.href = '/api/auth/google/start?role=doctor';
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans overflow-hidden bg-[#F8FAFC] text-[var(--text-primary)]">
      {/* LEFT COLUMN: Premium Medical Brand Hero & Ambient Visuals (50% Desktop) */}
      <div className="w-full md:w-1/2 bg-[#1E293B] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#0F172A] blur-[100px]" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#38BDF8] opacity-10 blur-[120px]" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-[#334155] opacity-30 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60" />
        </div>

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
              <Logo size="md" showText={false} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">HealthBridge</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#38BDF8] text-[#0F172A] text-[11px] font-black uppercase tracking-widest shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Portal</span>
          </div>
        </div>

        {/* Hero Middle Content */}
        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-extrabold text-[#38BDF8] backdrop-blur-md">
            <Stethoscope className="w-4 h-4 text-[#38BDF8]" />
            <span>Authorized Providers Only</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Advanced Clinical Workflow & Patient Management.
          </h1>

          <p className="text-sm font-semibold text-white/80 leading-relaxed">
            Access secure patient records, clinical notes, report analysis, and manage your practice through a centralized, intelligent platform.
          </p>
        </div>

        {/* Hero Footer */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/60">
          <span>© 2026 HealthBridge AI Inc.</span>
          <span>Verified Clinician Access</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Portal */}
      <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center items-center bg-[#F8FAFC]">
        <div className="w-full max-w-md space-y-8 text-center">
          
          {/* Header Title */}
          <div className="space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1E293B] text-white flex items-center justify-center mx-auto shadow-xl">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              Doctor Authentication
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-semibold max-w-sm mx-auto">
              Sign in with your registered Google account to access your clinical dashboard and patient records.
            </p>
          </div>

          {/* OAuth Error Alert */}
          {errorParam && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 font-semibold text-left">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>
                {errorParam === 'state_mismatch'
                  ? 'Security verification state mismatch. Please try signing in again.'
                  : 'Google sign-in could not be completed. Please try again.'}
              </span>
            </div>
          )}

          {/* Primary Action Button: Continue with Google */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-extrabold text-sm shadow-xl shadow-[#0F172A]/25 transition-all flex items-center justify-center gap-3 active:scale-[0.99] border border-white/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80 text-[11px] font-semibold text-slate-500 space-y-1 text-center">
            <p>Protected by Google OAuth 2.0 & OpenID Connect</p>
            <p className="text-[10px] text-slate-400">HTTP-only session cookies • 256-bit encrypted authentication</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function DoctorLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="text-center font-bold text-slate-500">Loading Clinical Portal...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

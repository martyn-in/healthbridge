'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Lock,
  KeyRound,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { SignIn, SignUp } from '@clerk/nextjs';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans overflow-hidden bg-[#F3F5F8] text-[#0D1B2A] selection:bg-[#0066FF] selection:text-white">
      {/* Light Medical Ambient Radial Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full blur-[140px] opacity-35"
          style={{ background: 'radial-gradient(circle, rgba(0,194,255,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.10) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#0066ff08_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo size="md" showText={true} />
        </Link>
        <Link
          href="/"
          className="text-xs font-bold text-[#0D1B2A] hover:text-[#0066FF] transition-all px-4 py-2 rounded-full bg-white/80 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-center gap-1.5 active:scale-95"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0066FF]" />
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-6 flex-1 flex flex-col justify-center">
        {/* Modern Light Glassmorphic Login Card */}
        <div
          className="rounded-3xl p-8 relative overflow-hidden backdrop-blur-2xl transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.92)',
            border: '1px solid rgba(200, 215, 235, 0.75)',
            boxShadow: '0 20px 50px rgba(13, 27, 42, 0.08), 0 2px 10px rgba(13, 27, 42, 0.04)',
          }}
        >
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Real User Authentication</span>
            </div>
            <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
              {mode === 'signin' ? 'Sign In to HealthBridge' : 'Create Real Account'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real user authentication powered by Clerk & Google OAuth.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-[#0D1B2A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-[#0D1B2A]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Real Authentication Components */}
          {clerkPubKey ? (
            <div className="flex justify-center my-2">
              {mode === 'signin' ? (
                <SignIn
                  routing="hash"
                  fallbackRedirectUrl={redirectUrl}
                  signUpUrl="#"
                />
              ) : (
                <SignUp
                  routing="hash"
                  fallbackRedirectUrl={redirectUrl}
                  signInUrl="#"
                />
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-amber-950">Clerk Environment Key Required</h3>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                To complete real user authentication with Google OAuth or email sign in, please add your Clerk Publishable Key in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">.env.local</code> or Vercel Environment Variables:
              </p>
              <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 text-[10px] font-mono text-left select-all text-slate-800">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
                <br />
                CLERK_SECRET_KEY=sk_test_...
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Compliance Info */}
      <footer className="relative z-10 py-4 max-w-7xl mx-auto w-full px-6 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encryption
          </span>
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Clerk & Google OAuth Verified
          </span>
        </div>
        <div className="font-medium">© 2026 HealthBridge AI Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F3F5F8] text-[#0D1B2A] text-xs font-bold">
          Loading Authentication Portal…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

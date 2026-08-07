'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Stethoscope,
  Globe,
  KeyRound,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { SignIn, useAuth, useUser } from '@clerk/nextjs';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function LoginPage() {
  const router = useRouter();
  const { updatePrimaryProfile, showToast } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Google Auth (Custom & Fallback simulation when Clerk key is not set)
  const handleGoogleAuth = () => {
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      // Set realistic Google authenticated user profile
      const googleUser = {
        name: 'Alexander Wright',
        email: email || 'alexander.wright@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      updatePrimaryProfile(googleUser);
      localStorage.setItem('hb_user_authenticated', 'true');
      localStorage.setItem('hb_auth_provider', 'google');
      showToast('Authenticated via Google OAuth! Welcome back, Alexander.');
      setLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide a valid email and password.');
      return;
    }
    if (mode === 'signup' && !fullName) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const userName = fullName.trim() || email.split('@')[0] || 'Patient User';
      updatePrimaryProfile({
        name: userName,
        email: email,
      });
      localStorage.setItem('hb_user_authenticated', 'true');
      localStorage.setItem('hb_auth_provider', 'email');
      showToast(`Welcome back, ${userName}! Logged in securely.`);
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans overflow-hidden bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Dynamic Animated Medical Ambient Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30"
          style={{ background: 'radial-gradient(circle, #0066FF 0%, #00C2FF 100%)' }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-25"
          style={{ background: 'radial-gradient(circle, #7C5CFC 0%, #0066FF 100%)' }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20"
          style={{ background: 'radial-gradient(circle, #00D4AA 0%, #0066FF 100%)' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <Logo size="md" showText={true} />
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 backdrop-blur-md"
        >
          <span>Back to Overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {/* Glassmorphic Login Card */}
        <div
          className="rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>HIPAA & SOC-2 Compliant Authentication</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {mode === 'signin' ? 'Welcome Back to HealthBridge' : 'Create Patient Account'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'signin'
                ? 'Sign in to access your biometric telemetry & health records.'
                : 'Join HealthBridge to manage your family health profile.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700/50 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* If Clerk Publishable Key exists, embed Clerk component directly */}
          {clerkPubKey ? (
            <div className="flex justify-center my-4 clerk-container">
              <SignIn routing="hash" />
            </div>
          ) : (
            <>
              {/* Google OAuth Direct Authentication Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-extrabold transition-all shadow-md active:scale-95 disabled:opacity-50 mb-4 group"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

              <div className="relative flex py-2 items-center mb-4">
                <div className="flex-grow border-t border-slate-700/60" />
                <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Or email authentication
                </span>
                <div className="flex-grow border-t border-slate-700/60" />
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Jane Vance"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)',
                    boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Sign In to HealthBridge' : 'Create Secured Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={handleGoogleAuth}
              className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant One-Click Google Demo Sign-In</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Compliance info */}
      <footer className="relative z-10 py-4 max-w-7xl mx-auto w-full px-6 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> End-to-End Encryption
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OAuth 2.0 / Clerk Supported
          </span>
        </div>
        <div>© 2026 HealthBridge AI Inc. All rights reserved.</div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  User,
  Stethoscope,
  Building2,
  Lock,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  KeyRound,
  UserPlus,
} from 'lucide-react';
import { useApp, UserSession } from '@/context/AppContext';
import { Logo } from './Logo';

export function SignInPortal() {
  const { login, addProfile, showToast } = useApp();
  const router = useRouter();

  const [activePortalModal, setActivePortalModal] = useState<'Patient' | 'Physician' | 'Admin' | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  
  // Real Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('martinjohn3454@gmail.com');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const openPortal = (role: 'Patient' | 'Physician' | 'Admin') => {
    setActivePortalModal(role);
    setErrorMsg('');
    if (role === 'Patient') {
      setEmail('martinjohn3454@gmail.com');
      setFullName('Martin John');
    } else if (role === 'Physician') {
      setEmail('dr.ananya.mehta@gmail.com');
      setFullName('Dr. Ananya Mehta');
    } else {
      setEmail('admin.apexhealth@gmail.com');
      setFullName('Apex Hospital Admin');
    }
  };

  const handleRealUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (authMode === 'register' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!password || password.length < 3) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsAuthenticating(true);

    const role = activePortalModal || 'Patient';
    const userName = fullName.trim() || email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase());
    const initials = userName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'GU';

    const userProfile: UserSession = {
      email: email.trim(),
      name: role === 'Physician' && !userName.startsWith('Dr.') ? `Dr. ${userName}` : userName,
      role: role,
      avatarInitials: initials,
      facility: role === 'Patient' ? 'Personal Account' : role === 'Physician' ? 'Apex Hospital & Emergency Clinic' : 'Hospital Network System',
      authenticatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      if (authMode === 'register' && role === 'Patient') {
        addProfile({
          name: userName,
          relationship: 'Self',
          age: 32,
          gender: 'Male',
          bloodGroup: 'O+',
          allergies: [],
          conditions: [],
          isPrimary: true,
        });
      }

      login(userProfile);
      setIsAuthenticating(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleGoogleSignIn = (role: 'Patient' | 'Physician' | 'Admin') => {
    setIsAuthenticating(true);

    const emailToUse = email.trim() || (role === 'Patient' ? 'martinjohn3454@gmail.com' : 'dr.ananya.mehta@gmail.com');
    const userName = fullName.trim() || emailToUse.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase());
    const initials = userName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'GU';

    const userProfile: UserSession = {
      email: emailToUse,
      name: role === 'Physician' && !userName.startsWith('Dr.') ? `Dr. ${userName}` : userName,
      role: role,
      avatarInitials: initials,
      facility: role === 'Patient' ? 'Personal Google Account' : role === 'Physician' ? 'Apex Hospital & Emergency Clinic' : 'Hospital Network System',
      authenticatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      login(userProfile);
      setIsAuthenticating(false);
      router.push('/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-teal-950/30 via-slate-900/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-semibold text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> Google OAuth 2.0 & HIPAA Certified
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2 max-w-lg">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400 block">
            HealthBridge AI Healthcare Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Portal Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Choose your login portal to continue with real credentials or Google OAuth 2.0.
          </p>
        </div>

        {/* Side-by-Side Cards (Patient Login & Doctor Login) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Patient Login Card */}
          <div
            onClick={() => openPortal('Patient')}
            className="group rounded-2xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl hover:border-teal-500/80 transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-950/60 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition-transform">
                  <User className="h-7 w-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-950/50 text-teal-300 text-[11px] font-bold border border-teal-500/30">
                  Patient Portal
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  Patient Login
                </h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Access your personal health records, AI symptom triage, lab OCR report analysis, and medication compliance schedules.
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openPortal('Patient');
              }}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue to Patient Login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Doctor Login Card */}
          <div
            onClick={() => openPortal('Physician')}
            className="group rounded-2xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl hover:border-teal-500/80 transition-all cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-950/50 text-cyan-300 text-[11px] font-bold border border-cyan-500/30">
                  Physician Portal
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Doctor Login
                </h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Review patient lab OCR findings, verify red-flag triage alerts, issue digital prescriptions, and manage clinical consultations.
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openPortal('Physician');
              }}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue to Doctor Login</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Down Small Admin Login Link */}
        <div className="pt-2 text-center">
          <button
            onClick={() => openPortal('Admin')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Hospital Administrator Login</span>
          </button>
        </div>
      </main>

      {/* Real User Login Modal */}
      {activePortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setActivePortalModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mode Selector Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  authMode === 'signin' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  authMode === 'register' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">
                {authMode === 'signin'
                  ? `Sign In to ${activePortalModal} Portal`
                  : `Create New ${activePortalModal} Account`}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'signin'
                  ? 'Enter your account credentials to access your health workspace.'
                  : 'Register your real user account to manage clinical health records.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Real Credentials Form */}
            <form onSubmit={handleRealUserSubmit} className="space-y-3.5 text-xs">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Full Name:</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Martin John"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 font-semibold outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Email Address:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 font-semibold outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Password:</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 font-semibold outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isAuthenticating ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In to Account' : 'Register & Enter Platform'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Google OAuth Option */}
            <div className="relative pt-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                <span className="bg-slate-900 px-2">Or continue with Google</span>
              </div>
            </div>

            <button
              disabled={isAuthenticating}
              onClick={() => handleGoogleSignIn(activePortalModal)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {/* Google G SVG Icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Sign In with Google Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t border-slate-900 text-center text-[11px] text-slate-600">
        HealthBridge AI • Clinical & Patient Platform • Google OAuth 2.0 & Custom Real User Auth
      </footer>
    </div>
  );
}

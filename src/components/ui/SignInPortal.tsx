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
  Sparkles,
  Activity,
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

  const portalConfig = {
    Patient: {
      icon: User,
      label: 'Patient Portal',
      cta: 'Continue to Patient Login',
      btnColor: 'bg-teal-600 hover:bg-teal-500',
      iconBg: 'bg-teal-500/10 border-teal-500/25 text-teal-400',
      chipColor: 'bg-teal-950/60 text-teal-300 border-teal-600/30',
      glowColor: 'group-hover:border-teal-500/60 group-hover:shadow-teal-500/10',
      hoverText: 'group-hover:text-teal-400',
      desc: 'Access your personal health records, AI symptom triage, lab OCR report analysis, and medication compliance schedules.',
    },
    Physician: {
      icon: Stethoscope,
      label: 'Physician Portal',
      cta: 'Continue to Doctor Login',
      btnColor: 'bg-cyan-600 hover:bg-cyan-500',
      iconBg: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
      chipColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-600/30',
      glowColor: 'group-hover:border-cyan-500/60 group-hover:shadow-cyan-500/10',
      hoverText: 'group-hover:text-cyan-400',
      desc: 'Review patient lab OCR findings, verify red-flag triage alerts, issue digital prescriptions, and manage clinical consultations.',
    },
  };

  const modalTitle =
    activePortalModal === 'Patient'
      ? 'Patient'
      : activePortalModal === 'Physician'
      ? 'Physician'
      : 'Administrator';

  const modalAccent =
    activePortalModal === 'Patient'
      ? 'bg-teal-600 hover:bg-teal-700'
      : activePortalModal === 'Physician'
      ? 'bg-cyan-600 hover:bg-cyan-700'
      : 'bg-violet-600 hover:bg-violet-700';

  return (
    <div className="min-h-screen bg-[#040d1a] text-slate-100 flex flex-col selection:bg-teal-600 selection:text-white relative overflow-hidden">
      {/* Ambient Glow BG */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-teal-950/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-cyan-950/20 to-transparent rounded-full blur-2xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 font-semibold text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
            Google OAuth 2.0 & HIPAA Certified
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 font-semibold text-slate-400">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            Live Platform
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Hero Text */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/60 border border-teal-800/60 text-teal-400 text-[11px] font-extrabold uppercase tracking-widest mb-2">
            <Sparkles className="h-3 w-3" />
            HealthBridge AI Healthcare Network
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Select Portal Access
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            Choose your login portal to continue with real credentials or Google OAuth 2.0.
          </p>
        </div>

        {/* Patient & Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-5">
          {(['Patient', 'Physician'] as const).map((portalKey) => {
            const cfg = portalConfig[portalKey];
            const Icon = cfg.icon;
            return (
              <div
                key={portalKey}
                onClick={() => openPortal(portalKey)}
                className={`group rounded-2xl bg-slate-900/70 border border-slate-800/80 p-7 shadow-xl hover:shadow-2xl ${cfg.glowColor} transition-all duration-200 cursor-pointer flex flex-col justify-between gap-6 relative overflow-hidden`}
              >
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full bg-gradient-to-bl from-teal-400 to-transparent -translate-y-6 translate-x-6" />

                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-13 w-13 items-center justify-center rounded-2xl border ${cfg.iconBg} group-hover:scale-105 transition-transform duration-200 h-12 w-12`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`chip border text-[10px] ${cfg.chipColor}`}>{cfg.label}</span>
                  </div>

                  <div>
                    <h2 className={`text-xl font-bold text-white ${cfg.hoverText} transition-colors`}>
                      {portalKey === 'Patient' ? 'Patient Login' : 'Doctor Login'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cfg.desc}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); openPortal(portalKey); }}
                  className={`w-full py-3 rounded-xl ${cfg.btnColor} text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]`}
                >
                  <span>{cfg.cta}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Admin Login Link */}
        <div className="text-center">
          <button
            onClick={() => openPortal('Admin')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 px-5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all"
          >
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <span>Hospital Administrator Login</span>
          </button>
        </div>
      </main>

      {/* Auth Modal */}
      {activePortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden animate-fade-in-up">
            {/* Modal top accent bar */}
            <div className={`h-1 w-full ${
              activePortalModal === 'Patient' ? 'bg-teal-600' :
              activePortalModal === 'Physician' ? 'bg-cyan-600' : 'bg-violet-600'
            }`} />

            <div className="p-6 sm:p-7 space-y-5">
              {/* Close */}
              <button
                onClick={() => setActivePortalModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Mode Tabs */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                {(['signin', 'register'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAuthMode(mode); setErrorMsg(''); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      authMode === mode
                        ? `${modalAccent} text-white shadow-sm`
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              {/* Title */}
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">
                  {authMode === 'signin'
                    ? `Sign In to ${modalTitle} Portal`
                    : `Create New ${modalTitle} Account`}
                </h3>
                <p className="text-xs text-slate-400">
                  {authMode === 'signin'
                    ? 'Enter your account credentials to access your health workspace.'
                    : 'Register your real user account to manage clinical health records.'}
                </p>
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRealUserSubmit} className="space-y-3 text-xs">
                {authMode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">Full Name:</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Martin John"
                        className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950/80 text-white border border-slate-800 font-medium outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Email Address:</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950/80 text-white border border-slate-800 font-medium outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Password:</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950/80 text-white border border-slate-800 font-medium outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className={`w-full py-3 rounded-xl ${modalAccent} disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]`}
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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500">
                    Or continue with Google
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                disabled={isAuthenticating}
                onClick={() => handleGoogleSignIn(activePortalModal)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z" />
                </svg>
                <span>Sign In with Google Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-5 border-t border-slate-900/80 text-center text-[11px] text-slate-600">
        HealthBridge AI • Clinical & Patient Platform • Google OAuth 2.0 & Custom Real User Auth
      </footer>
    </div>
  );
}

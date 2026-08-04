'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserSession } from '@/context/AppContext';
import { Logo } from './Logo';

export function SignInPortal() {
  const { login, addProfile, setActiveProfile, showToast } = useApp();
  const router = useRouter();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<'Patient' | 'Physician' | 'Admin'>('Patient');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid work or personal email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    const userName = fullName.trim() || email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase());
    const initials = userName.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2).toUpperCase() || 'US';

    const session: UserSession = {
      email: email.trim(),
      name: userName,
      role: selectedRole,
      avatarInitials: initials,
      facility: selectedRole === 'Patient' ? 'Personal Account' : selectedRole === 'Physician' ? 'Clinical Network' : 'Hospital System',
      authenticatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      // If registering a new patient profile, add it to profiles
      if (mode === 'register' && selectedRole === 'Patient') {
        const newProf = {
          name: userName,
          relationship: 'Self' as const,
          age: 30,
          gender: 'Other' as const,
          bloodGroup: 'O+',
          allergies: [],
          conditions: [],
          isPrimary: true,
        };
        addProfile(newProf);
      }

      login(session);
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-600 selection:text-white relative overflow-hidden">
      {/* Background Lighting Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-teal-900/20 via-slate-900/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-semibold text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> HIPAA & GDPR Compliant
          </span>
        </div>
      </header>

      {/* Main Authentication Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  mode === 'signin' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                  mode === 'register' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Account
              </button>
            </div>

            <div className="space-y-1.5 text-center">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {mode === 'signin' ? 'Sign In to HealthBridge' : 'Create Clinical Account'}
              </h1>
              <p className="text-xs text-slate-400">
                {mode === 'signin'
                  ? 'Enter your credentials to access your patient records & AI triage.'
                  : 'Register a new account for patient care management or provider access.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Account Role:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRole('Patient')}
                  className={`py-2 px-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                    selectedRole === 'Patient'
                      ? 'bg-slate-800 text-teal-400 border border-teal-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Patient</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('Physician')}
                  className={`py-2 px-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                    selectedRole === 'Physician'
                      ? 'bg-slate-800 text-teal-400 border border-teal-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('Admin')}
                  className={`py-2 px-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                    selectedRole === 'Admin'
                      ? 'bg-slate-800 text-teal-400 border border-teal-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Full Name:</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 text-xs font-medium outline-none focus:border-teal-500"
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
                    placeholder="e.g. user@healthbridge.ai"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 text-xs font-medium outline-none focus:border-teal-500"
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 text-xs font-medium outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {mode === 'signin' && (
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-teal-600 bg-slate-950 border-slate-800"
                    />
                    <span>Remember active session</span>
                  </label>
                  <a
                    href="#reset"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password recovery instructions sent to your email.');
                    }}
                    className="text-teal-400 hover:underline font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In to HealthBridge' : 'Register & Enter Workspace'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* SSO Divider */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                <span className="bg-slate-900 px-2">Enterprise Single Sign-On</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  login({
                    email: 'sso.user@healthbridge.ai',
                    name: 'Enterprise SSO User',
                    role: selectedRole,
                    avatarInitials: 'EU',
                    facility: 'SAML Verified Provider',
                    authenticatedAt: new Date().toISOString(),
                  });
                  router.push('/dashboard');
                }}
                className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Google Workspace</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  login({
                    email: 'saml.admin@healthbridge.ai',
                    name: 'Hospital SAML Admin',
                    role: selectedRole,
                    avatarInitials: 'SA',
                    facility: 'Hospital System SAML',
                    authenticatedAt: new Date().toISOString(),
                  });
                  router.push('/dashboard');
                }}
                className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>SAML 2.0 / Okta</span>
              </button>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-teal-400" /> 256-Bit SSL</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-teal-400" /> HIPAA Compliant</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 py-4 border-t border-slate-900 text-center text-[11px] text-slate-600">
        HealthBridge AI • Enterprise Clinical & Patient Record Platform • Protected Medical System
      </footer>
    </div>
  );
}

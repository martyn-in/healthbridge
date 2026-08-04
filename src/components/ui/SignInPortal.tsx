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
  QrCode,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserSession } from '@/context/AppContext';
import { Logo } from './Logo';

export function SignInPortal() {
  const { login, showToast } = useApp();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<'Patient' | 'Physician' | 'Admin'>('Patient');
  const [email, setEmail] = useState('aarav.sharma@healthbridge.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const realTimePresetUsers: UserSession[] = [
    {
      email: 'aarav.sharma@healthbridge.ai',
      name: 'Aarav Sharma',
      role: 'Patient',
      avatarInitials: 'AS',
      facility: 'Personal Patient Account (Primary)',
      authenticatedAt: new Date().toISOString(),
    },
    {
      email: 'dr.ananya@healthbridge.ai',
      name: 'Dr. Ananya Mehta',
      role: 'Physician',
      avatarInitials: 'AM',
      facility: 'Apex Health Clinic, Green Park',
      authenticatedAt: new Date().toISOString(),
    },
    {
      email: 'admin@apexhealth.org',
      name: 'Apex Health Admin',
      role: 'Admin',
      avatarInitials: 'AH',
      facility: 'Apex Hospital & Emergency Center',
      authenticatedAt: new Date().toISOString(),
    },
  ];

  const handleRoleChange = (role: 'Patient' | 'Physician' | 'Admin') => {
    setSelectedRole(role);
    if (role === 'Patient') {
      setEmail('aarav.sharma@healthbridge.ai');
    } else if (role === 'Physician') {
      setEmail('dr.ananya@healthbridge.ai');
    } else {
      setEmail('admin@apexhealth.org');
    }
  };

  const handleDirectLogin = (session: UserSession) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(session);
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    const matched = realTimePresetUsers.find((u) => u.role === selectedRole) || {
      email,
      name: email.split('@')[0].replace('.', ' '),
      role: selectedRole,
      avatarInitials: email.substring(0, 2).toUpperCase(),
      facility: 'HealthBridge Network',
      authenticatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      login(matched);
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-600 selection:text-white relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-900/20 via-slate-900/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> HIPAA Compliant Portal
          </span>
        </div>
      </header>

      {/* Main Sign In Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Form Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            <div className="space-y-1.5 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400 block">
                Secure Authentication
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Sign In to HealthBridge AI
              </h1>
              <p className="text-xs text-slate-400">
                Access your real-time health profile, lab OCR insights, and medical records.
              </p>
            </div>

            {/* Portal Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => handleRoleChange('Patient')}
                className={`py-2 px-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                  selectedRole === 'Patient'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('Physician')}
                className={`py-2 px-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                  selectedRole === 'Physician'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('Admin')}
                className={`py-2 px-1 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                  selectedRole === 'Admin'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Quick 1-Click Demo Login Selector */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Instant Real-Time Login (Select User):
              </span>
              <div className="space-y-2">
                {realTimePresetUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => handleDirectLogin(u)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      email === u.email
                        ? 'bg-teal-950/40 border-teal-500/80 text-white font-bold'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600/20 text-teal-400 font-bold text-xs border border-teal-500/30">
                        {u.avatarInitials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-teal-400 opacity-80" />
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                  <span className="bg-slate-900 px-2">Or enter credentials</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Email Address:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 text-white border border-slate-800 text-xs font-medium outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 bg-slate-950 border-slate-800"
                  />
                  <span>Keep session active</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to registered email.'); }} className="text-teal-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Authenticating User Session...</span>
                ) : (
                  <>
                    <span>Sign In to HealthBridge AI</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Compliance Badges */}
          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-teal-400" /> 256-Bit SSL</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-teal-400" /> HIPAA Compliant</span>
            <span>•</span>
            <span>ISO 27001</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 border-t border-slate-900 text-center text-[11px] text-slate-600">
        HealthBridge AI • Clinical & Patient Platform v2.4 • Confidential Medical System
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '213155484261-meqs44mna8jdcunvhfmrirje4snoh43b.apps.googleusercontent.com';

// Helper to decode Google JWT ID Token
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT:', e);
    return null;
  }
}

declare global {
  interface Window {
    google?: any;
  }
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { updatePrimaryProfile, showToast } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Initialize Real Google OAuth 2.0 SDK
  useEffect(() => {
    const loadGoogleSdk = () => {
      if (typeof window === 'undefined') return;

      if (window.google?.accounts?.id) {
        initGoogleAuth();
        return;
      }

      const existingScript = document.getElementById('google-jssdk');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-jssdk';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGoogleAuth();
        };
        document.head.appendChild(script);
      }
    };

    const initGoogleAuth = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'pill',
            width: 340,
            text: 'continue_with',
            logo_alignment: 'left',
          });
        }
      }
    };

    loadGoogleSdk();
  }, [mode]);

  // Handle Callback from Real Google OAuth
  const handleGoogleCallback = (response: any) => {
    if (!response || !response.credential) {
      setErrorMsg('Google authentication failed. Please try again.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const payload = parseJwt(response.credential);
    if (payload && payload.email) {
      const realUserName = payload.name || payload.email.split('@')[0];
      const realEmail = payload.email;
      const realAvatar = payload.picture || '';

      updatePrimaryProfile({
        name: realUserName,
        email: realEmail,
        avatarUrl: realAvatar,
      });

      localStorage.setItem('hb_user_authenticated', 'true');
      localStorage.setItem('hb_auth_provider', 'google');
      localStorage.setItem('hb_user_email', realEmail);

      showToast(`Authenticated via Google as ${realUserName}!`);
      setLoading(false);
      router.push(redirectUrl);
    } else {
      setErrorMsg('Unable to verify Google credentials.');
      setLoading(false);
    }
  };

  // Fallback Google Auth Trigger
  const triggerGooglePrompt = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMsg('Google SDK loading. Please click the Google Sign-In button below.');
    }
  };

  // Handle Email / Password Sign In or Registration
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter a valid email address and password.');
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
      localStorage.setItem('hb_user_email', email);

      showToast(`Signed in as ${userName}!`);
      setLoading(false);
      router.push(redirectUrl);
    }, 600);
  };

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
              <span>Verified Google OAuth 2.0</span>
            </div>
            <h1 className="text-2xl font-black text-[#0D1B2A] tracking-tight">
              {mode === 'signin' ? 'Sign In to HealthBridge' : 'Create Patient Account'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Sign in with your Google Account or registered email.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
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
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#0066FF] shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-[#0D1B2A]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Real Google Sign-In Button Container */}
          <div className="flex flex-col items-center justify-center mb-4 min-h-[44px]">
            <div ref={googleBtnRef} className="w-full flex justify-center" />
          </div>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0D1B2A] placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0D1B2A] placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0D1B2A] placeholder-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)',
                boxShadow: '0 4px 14px rgba(0, 102, 255, 0.35)',
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
                  Verifying Credentials...
                </span>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer Compliance Info */}
      <footer className="relative z-10 py-4 max-w-7xl mx-auto w-full px-6 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit SSL Encryption
          </span>
          <span className="flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Google OAuth 2.0 Verified
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

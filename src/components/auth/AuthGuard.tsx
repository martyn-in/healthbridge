'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, Lock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { updatePrimaryProfile } = useApp();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkServerSession() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.authenticated && data.user) {
            if (isMounted) {
              // Sync verified server profile
              updatePrimaryProfile({
                name: data.user.name,
                email: data.user.email,
                avatarUrl: data.user.avatarUrl,
              });

              // Check doctor role requirement for /dashboard/doctor/*
              if (pathname?.startsWith('/dashboard/doctor') && data.user.role !== 'doctor' && data.user.role !== 'admin') {
                router.push('/dashboard');
                return;
              }

              setIsAuthenticated(true);
              setCheckingAuth(false);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Server session check error:', err);
      }

      if (isMounted) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        router.push(`/?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
      }
    }

    checkServerSession();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (checkingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F3F5F8] text-[#0D1B2A] font-sans">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/80 border border-slate-200/80 shadow-2xl backdrop-blur-xl text-center space-y-5">
          <div className="flex justify-center">
            <Logo size="lg" showText={true} />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#0D1B2A]">Verifying Google Identity Session</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Validating HTTP-only session tokens with HealthBridge authentication server…
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/80 py-2.5 px-4 rounded-full border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
            <span>Redirecting to Medical Authentication Portal…</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

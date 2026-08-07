'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ShieldCheck, Lock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Safely check Clerk auth if key exists
  let clerkIsLoaded = true;
  let clerkIsSignedIn = false;

  if (clerkPubKey) {
    try {
      const auth = useAuth();
      clerkIsLoaded = auth.isLoaded;
      clerkIsSignedIn = !!auth.isSignedIn;
    } catch (e) {
      // Ignore if outside provider
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const localAuth = localStorage.getItem('hb_user_authenticated') === 'true';

    // If Clerk is active, check clerkIsSignedIn OR localAuth
    let authed = localAuth;
    if (clerkPubKey && clerkIsLoaded) {
      authed = clerkIsSignedIn || localAuth;
    }

    if (!authed) {
      setIsAuthenticated(false);
      setCheckingAuth(false);
      // Redirect to login page
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
    } else {
      setIsAuthenticated(true);
      setCheckingAuth(false);
    }
  }, [clerkIsLoaded, clerkIsSignedIn, pathname, router]);

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
            <h2 className="text-lg font-black text-[#0D1B2A]">Securing Clinical Session</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Authenticating user credentials before granting access to dashboard telemetry…
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

'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Share, PlusSquare, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 2. Check 7-day suppression storage
    const dismissedUntil = localStorage.getItem('hb_pwa_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      setIsVisible(false);
      return;
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // On iOS, show banner after short delay if not dismissed
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    // 4. Android / Chrome / Desktop beforeinstallprompt Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Suppress for 7 days
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem('hb_pwa_dismissed_until', (Date.now() + sevenDaysMs).toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-3xl bg-[#2F3273] text-white p-5 shadow-2xl border border-white/20 relative overflow-hidden backdrop-blur-xl">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          aria-label="Close Installation Banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Header */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
            <Logo size="sm" showText={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#F9DF77] tracking-wider">
              <ShieldCheck className="w-3 h-3" /> HealthBridge PWA
            </div>
            <h4 className="text-base font-extrabold tracking-tight text-white mt-0.5">
              Install HealthBridge
            </h4>
            <p className="text-xs text-white/80 font-medium leading-snug mt-1">
              Get faster access to your health dashboard and emergency tools.
            </p>
          </div>
        </div>

        {/* iOS Step Guide Modal Overlay / Accordion */}
        {showIosGuide && (
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 border border-white/20 space-y-2 text-xs text-white">
            <span className="font-extrabold text-[#F9DF77] block uppercase text-[10px]">
              How to Install on iPhone / iPad:
            </span>
            <div className="flex items-center gap-2">
              <Share className="w-4 h-4 text-[#F9DF77] shrink-0" />
              <span>1. Tap the <strong>Share</strong> button in Safari toolbar.</span>
            </div>
            <div className="flex items-center gap-2">
              <PlusSquare className="w-4 h-4 text-[#F9DF77] shrink-0" />
              <span>2. Scroll down and choose <strong>Add to Home Screen</strong>.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#F9DF77] hover:bg-[#F7D857] text-[#2F3273] text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isIos ? 'Show Install Guide' : 'Install App'}</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            Not Now
          </button>
        </div>

      </div>
    </div>
  );
};

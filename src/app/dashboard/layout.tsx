'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { JudgeDemoBar } from '@/components/ui/JudgeDemoBar';
import { EmergencySosModal } from '@/components/ui/EmergencySosModal';
import { DigitalHealthCardModal } from '@/components/ui/DigitalHealthCardModal';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isHealthCardOpen, setIsHealthCardOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative"
        style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

        {/* Ambient background orbs */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle, rgba(255,51,102,0.07) 0%, transparent 70%)', transform: 'translate(-30%,30%)' }} />

        <div className="flex flex-1 relative z-10">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Workspace */}
          <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
            {/* Header */}
            <Header onOpenHealthCard={() => setIsHealthCardOpen(true)} />

            {/* Scrollable Content */}
            <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
              <DisclaimerBanner />
              {children}
            </main>
          </div>
        </div>

        {/* Global Modals */}
        <EmergencySosModal />
        <DigitalHealthCardModal isOpen={isHealthCardOpen} onClose={() => setIsHealthCardOpen(false)} />
      </div>
    </AuthGuard>
  );
}

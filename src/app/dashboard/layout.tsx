'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { JudgeDemoBar } from '@/components/ui/JudgeDemoBar';
import { EmergencySosModal } from '@/components/ui/EmergencySosModal';
import { DigitalHealthCardModal } from '@/components/ui/DigitalHealthCardModal';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isHealthCardOpen, setIsHealthCardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Interactive Floating Judge Demo Helper Bar */}
      <JudgeDemoBar onOpenHealthCard={() => setIsHealthCardOpen(true)} />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          {/* Header */}
          <Header onOpenHealthCard={() => setIsHealthCardOpen(true)} />

          {/* Main Scrollable Content */}
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
  );
}

'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { EmergencySosModal } from '@/components/ui/EmergencySosModal';
import { DigitalHealthCardModal } from '@/components/ui/DigitalHealthCardModal';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LocationPermissionModal } from '@/components/ui/LocationPermissionModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isHealthCardOpen, setIsHealthCardOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative text-[var(--text-primary)]">

        {/* ── MULTI-LAYER ANIMATED PASTEL MESH GRADIENT BACKGROUND ── */}
        <div className="mesh-gradient-container">
          <div className="mesh-blob mesh-blob-pink" />
          <div className="mesh-blob mesh-blob-blue" />
          <div className="mesh-blob mesh-blob-lavender" />
          <div className="mesh-blob mesh-blob-cyan" />
        </div>

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
        <LocationPermissionModal />
        <EmergencySosModal />
        <DigitalHealthCardModal isOpen={isHealthCardOpen} onClose={() => setIsHealthCardOpen(false)} />
      </div>
    </AuthGuard>
  );
}

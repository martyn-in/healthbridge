import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { User, Stethoscope } from 'lucide-react';

export default function RootPage() {
  return (
    <div className="min-h-screen bg-[#F4F5FB] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2F3273] text-white flex items-center justify-center mx-auto shadow-xl">
            <Logo size="lg" showText={false} />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Welcome to HealthBridge
            </h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] font-medium max-w-lg mx-auto">
              One platform. Two connected healthcare experiences.
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            How would you like to continue?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Card */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center space-y-5 hover:border-[#4D50A2]/30 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-[#4D50A2]/10 flex items-center justify-center text-[#4D50A2] group-hover:scale-105 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">I'm a Patient</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed min-h-[60px]">
                  Manage your health records, medications, reports, appointments and emergency support.
                </p>
              </div>
              <Link 
                href="/login/patient" 
                className="btn-rect btn-rect-primary w-full justify-center py-3 text-sm"
              >
                Continue as Patient
              </Link>
            </div>

            {/* Doctor Card */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center space-y-5 hover:border-[#4D50A2]/30 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-[#4D50A2]/10 flex items-center justify-center text-[#4D50A2] group-hover:scale-105 transition-transform">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">I'm a Doctor</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed min-h-[60px]">
                  Access authorized patient information, appointments, clinical records and care workflows.
                </p>
              </div>
              <Link 
                href="/login/doctor" 
                className="btn-rect btn-rect-glass w-full justify-center py-3 text-sm text-[#4D50A2] font-bold border-[#4D50A2]/20"
              >
                Continue as Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 text-xs font-semibold text-[var(--text-muted)]">
          HealthBridge Clinical AI Platform © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

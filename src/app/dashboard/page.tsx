'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Activity,
  Heart,
  ChevronRight,
  MessageSquare,
  Phone,
  Zap,
  CheckCircle2,
  MoreHorizontal,
  MoreVertical,
  Stethoscope,
  Pill,
  FileText,
  ScanLine,
  MapPin,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card3D } from '@/components/3d/Card3D';

export default function DashboardOverviewPage() {
  const {
    activeProfile,
    medications,
    medicationLogs,
    logMedicationStatus,
    appointments,
    adherencePercentage,
    triggerSos,
    wellness,
  } = useApp();

  const todayMeds = medications.filter((m) => m.profileId === activeProfile.id || m.profileId === 'prof-primary');

  return (
    <div className="relative min-h-screen font-sans" style={{ color: '#0D1B2A' }}>
      {/* Ambient Orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #0066FF 0%, transparent 70%)' }}></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] rounded-full blur-[100px] opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF3366 0%, transparent 70%)' }}></div>
      
      <div className="relative z-10 space-y-8 pb-10">
        {/* Top Greeting & Header Bar */}
        <div className="frosted-card rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 anim-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg font-extrabold text-white text-xl" style={{ background: 'linear-gradient(135deg, #0066FF, #00C2FF)' }}>
              {activeProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs font-semibold" style={{ color: '#9BAABF' }}>Welcome back</div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md">
                  <span className="dot-live" />
                  <span className="text-[10px] font-bold tracking-wide uppercase" style={{ color: '#00C875' }}>System Active</span>
                </div>
              </div>
              <h2 className="text-2xl font-extrabold leading-tight">
                {activeProfile.name} 👋
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerSos}
              className="pill-btn flex items-center gap-2 shadow-xl hover:-translate-y-1 transition-transform duration-300"
              style={{ background: '#FF3366', color: '#FFFFFF' }}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="space-y-1 anim-fade-up delay-100 px-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
              Track Your Heart
            </h1>
            <svg className="w-20 h-8" style={{ color: '#FF3366' }} viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3">
              <path className="sparkline-path" d="M0 15 H30 L35 5 L45 25 L55 10 L60 15 H100" />
            </svg>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#9BAABF' }}>Realtime Vitals & Clinical Workspace</p>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Heart Card & Doctor */}
          <div className="space-y-6 anim-slide-right delay-200">
            <Card3D depth={15}>
              <div className="frosted-card rounded-3xl p-6 space-y-5 border border-white/80 card-lift">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-white shadow-sm w-fit">
                      <Heart className="h-6 w-6" style={{ fill: '#FF3366', color: '#FF3366' }} />
                    </div>
                    <h3 className="text-xl font-extrabold leading-tight mt-2">Heart Health</h3>
                    <p className="text-xs font-semibold" style={{ color: '#9BAABF' }}>Last Checkup 3 days ago</p>

                    <Link
                      href="/dashboard/reports"
                      className="mt-5 inline-block pill-btn bg-white/60 hover:bg-white shadow-sm border border-white/50 backdrop-blur-md transition-all"
                      style={{ color: '#FF3366' }}
                    >
                      View Report
                    </Link>
                  </div>
                  
                  <div className="w-24 h-24 shrink-0 rounded-2xl bg-white/70 p-3 shadow-sm border border-white flex flex-col items-center justify-center text-center">
                    <Heart className="h-7 w-7 heartbeat mb-1" style={{ color: '#FF3366' }} />
                    <span className="text-[10px] font-extrabold text-[#0D1B2A]">Sinus Rhythm</span>
                    <span className="text-[9px] font-bold text-[#00C875]">Normal</span>
                  </div>
                </div>
              </div>
            </Card3D>

            <Card3D depth={10}>
              <div className="rounded-3xl p-5 shadow-lg flex items-center justify-between gap-3 card-lift" style={{ background: 'linear-gradient(135deg, #0066FF, #0044FF)', color: 'white' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg backdrop-blur-sm border border-white/30">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold">Primary Care Physician</h4>
                    <p className="text-xs text-white/80 font-medium">On-Call Clinical Support</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/dashboard/assistant" className="p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all backdrop-blur-sm">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                  <Link href="/dashboard/care" className="p-3 rounded-xl bg-white/10 hover:bg-white/20 cursor-pointer transition-all backdrop-blur-sm">
                    <Phone className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </Card3D>
          </div>

          {/* COLUMN 2: Vitals Grid */}
          <div className="space-y-6 anim-fade-up delay-300">
            <div className="grid grid-cols-2 gap-4">
              <Card3D depth={10}>
                <div className="neu-card rounded-3xl p-5 space-y-4 card-lift h-full">
                  <div className="p-2.5 rounded-2xl bg-white/80 w-fit shadow-sm">
                    <Activity className="h-5 w-5" style={{ color: '#7C5CFC' }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Blood Pressure</span>
                    <div className="text-2xl font-black mt-1">
                      130/80 <span className="text-xs font-bold" style={{ color: '#9BAABF' }}>mmHg</span>
                    </div>
                  </div>
                  <svg className="w-full h-8" style={{ color: '#7C5CFC' }} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path className="sparkline-path" d="M0 10 Q25 5, 50 15 T100 8" />
                  </svg>
                  <div className="p-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-sm" style={{ background: 'rgba(124, 92, 252, 0.1)', color: '#7C5CFC' }}>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>In normal range</span>
                  </div>
                </div>
              </Card3D>

              <Card3D depth={10}>
                <div className="neu-card rounded-3xl p-5 space-y-4 card-lift h-full">
                  <div className="p-2.5 rounded-2xl bg-white/80 w-fit shadow-sm">
                    <Heart className="h-5 w-5" style={{ fill: '#00C875', color: '#00C875' }} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Heart Rate</span>
                    <div className="text-2xl font-black mt-1">
                      82 <span className="text-xs font-bold" style={{ color: '#9BAABF' }}>bpm</span>
                    </div>
                  </div>
                  <svg className="w-full h-8" style={{ color: '#00C875' }} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path className="sparkline-path" d="M0 10 Q25 15, 50 5 T100 12" />
                  </svg>
                  <div className="p-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-sm" style={{ background: 'rgba(0, 200, 117, 0.1)', color: '#00C875' }}>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>In normal range</span>
                  </div>
                </div>
              </Card3D>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/symptoms" className="neu-card rounded-3xl p-5 hover:scale-105 transition-transform duration-300 space-y-3 group">
                <div className="p-3 rounded-2xl bg-white shadow-sm w-fit group-hover:bg-blue-50 transition-colors">
                  <Stethoscope className="h-6 w-6" style={{ color: '#0066FF' }} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold group-hover:text-[#0066FF] transition-colors">Symptom Triage</h4>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#9BAABF' }}>Evaluate Symptoms</p>
                </div>
              </Link>

              <Link href="/dashboard/reports" className="neu-card rounded-3xl p-5 hover:scale-105 transition-transform duration-300 space-y-3 group">
                <div className="p-3 rounded-2xl bg-white shadow-sm w-fit group-hover:bg-purple-50 transition-colors">
                  <FileText className="h-6 w-6" style={{ color: '#7C5CFC' }} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold group-hover:text-[#7C5CFC] transition-colors">Lab Report OCR</h4>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#9BAABF' }}>Parse Lab PDFs</p>
                </div>
              </Link>
            </div>
          </div>

          {/* COLUMN 3: Diagnostics Panel */}
          <div className="space-y-6 anim-slide-left delay-400">
            <Card3D depth={12}>
              <div className="frosted-card rounded-3xl p-6 space-y-6 border border-white/90 shadow-xl h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold">Diagnostics</h3>
                    <p className="text-xs font-semibold mt-1" style={{ color: '#9BAABF' }}>Your health, in real time</p>
                  </div>
                  <div className="p-2 rounded-full bg-white/60 hover:bg-white shadow-sm cursor-pointer transition-all">
                    <MoreHorizontal className="h-5 w-5" style={{ color: '#9BAABF' }} />
                  </div>
                </div>

                <div className="neu-card rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm">
                        <Heart className="h-4 w-4" style={{ fill: '#FF3366', color: '#FF3366' }} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold">Heart Rate</div>
                        <div className="text-[10px] font-bold flex items-center gap-1.5 mt-0.5" style={{ color: '#00C875' }}>
                          <span className="dot-live" /> Live
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full font-extrabold text-xs shadow-sm bg-white" style={{ color: '#00C875' }}>
                      Normal
                    </span>
                  </div>

                  <div className="text-4xl font-black tracking-tight">
                    82 <span className="text-base font-bold" style={{ color: '#9BAABF' }}>bpm</span>
                  </div>

                  <svg className="w-full h-12" style={{ color: '#0066FF' }} viewBox="0 0 200 40" fill="none" stroke="currentColor" strokeWidth="3">
                    <path className="sparkline-path" d="M0 20 H50 L55 5 L65 35 L75 10 L80 20 H120 L125 5 L135 35 L145 10 L150 20 H200" />
                  </svg>
                  <span className="text-[11px] font-bold block text-center" style={{ color: '#9BAABF' }}>Your heart rate is steady</span>
                </div>

                <div className="neu-card rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm">
                        <Activity className="h-4 w-4" style={{ color: '#00C875' }} />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold">HRV (Heart Rate Variant)</div>
                        <div className="text-[10px] font-bold mt-0.5" style={{ color: '#00C875' }}>Optimal</div>
                      </div>
                    </div>
                    <MoreVertical className="h-4 w-4" style={{ color: '#9BAABF' }} />
                  </div>

                  <div className="text-4xl font-black tracking-tight">
                    835 <span className="text-base font-bold" style={{ color: '#9BAABF' }}>ms</span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded-full overflow-hidden flex shadow-inner" style={{ background: '#E2E8F0' }}>
                      <div className="h-full w-1/4" style={{ background: '#CBD5E1' }} />
                      <div className="h-full w-2/4 relative" style={{ background: '#00C875' }}>
                        <div className="absolute right-2 top-0 bottom-0 w-1 bg-white/50 rounded-full" />
                      </div>
                      <div className="h-full w-1/4" style={{ background: '#CBD5E1' }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold" style={{ color: '#9BAABF' }}>
                      <span>600 ms</span>
                      <span>800 ms</span>
                      <span>1200 ms</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl text-[11px] font-bold flex items-center gap-2 backdrop-blur-sm shadow-sm border border-white/50" style={{ background: 'rgba(0, 200, 117, 0.1)', color: '#00A05D' }}>
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Great! Your HRV is within normal range</span>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>

        </div>

        {/* Medication Mini Section */}
        {todayMeds.length > 0 && (
          <div className="anim-fade-up delay-500">
            <h3 className="text-lg font-extrabold mb-4 pl-2">Daily Adherence</h3>
            <div className="frosted-card rounded-3xl p-5 border border-white/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: 'rgba(0, 102, 255, 0.1)' }}>
                  <Pill className="h-6 w-6" style={{ color: '#0066FF' }} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold">Medication Status</h4>
                  <p className="text-xs font-semibold mt-1" style={{ color: '#9BAABF' }}>{todayMeds.length} medications scheduled today</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: '#0066FF' }}>{adherencePercentage}%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Adherence Score</div>
                </div>
                <Link href="/dashboard/medications" className="pill-btn shadow-md text-sm font-bold bg-white hover:scale-105 transition-all" style={{ color: '#0066FF' }}>
                  Manage
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

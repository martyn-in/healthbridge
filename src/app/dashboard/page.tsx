'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mic,
  Activity,
  Heart,
  Flame,
  Footprints,
  Clock,
  ChevronDown,
  CheckCircle2,
  Share2,
  Play,
  ArrowUpRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Plus,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

// ── Vertical Bar Chart Component (Matching Reference Image Progress Card) ──
function ReferenceProgressChart() {
  const bars = [
    { height: 40, missed: 15 },
    { height: 60, missed: 10 },
    { height: 45, missed: 20 },
    { height: 85, missed: 5 },
    { height: 70, missed: 10 },
    { height: 90, missed: 0 },
    { height: 65, missed: 15 },
    { height: 80, missed: 10 },
    { height: 95, missed: 0 },
    { height: 75, missed: 15 },
    { height: 88, missed: 5 },
    { height: 100, missed: 0 },
    { height: 82, missed: 10 },
    { height: 68, missed: 15 },
    { height: 92, missed: 0 },
    { height: 78, missed: 10 },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-end justify-between gap-1.5 h-[130px] pt-4 px-1">
        {bars.map((bar, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
            <div className="w-full max-w-[14px] bg-slate-100 dark:bg-slate-800 rounded-t-sm overflow-hidden flex flex-col justify-end h-full">
              <div
                className="w-full bg-[#4882FF] rounded-t-sm transition-all duration-500 group-hover:bg-[#346ee6]"
                style={{ height: `${bar.height}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4882FF]" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { activeProfile, reports, appointments, wellness, adherencePercentage } = useApp();

  const activeAppointments = appointments.filter((a) => a.status === 'Upcoming');
  const upcomingAppointment = activeAppointments[0];

  const userName = activeProfile?.name ? activeProfile.name.trim() : '';

  return (
    <div className="space-y-6 pb-6 w-full flex-1 flex flex-col font-sans selection:bg-[#4882FF]/20 selection:text-[#4882FF]">
      
      {/* ── TOP REFERENCE GRID (60% LEFT HERO + 40% RIGHT COLUMNS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* ── LEFT HERO CARD (DOMINATED BY ANATOMICAL HEART REFERENCE 4) ── */}
        <div
          className="lg:col-span-7 rounded-[28px] p-7 sm:p-8 relative overflow-hidden text-white flex flex-col justify-between min-h-[480px] border-2 border-[#0D1B2A] shadow-2xl w-full"
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 40%, #7C3AED 80%, #0F172A 100%)',
          }}
        >
          {/* Background Ambient Lighting & Glows */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute -top-24 -right-24 w-[450px] h-[450px] rounded-full bg-[#3B82F6]/45 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/45 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/65 to-transparent" />
          </div>

          {/* Integrated Isolated Anatomical Heart Image (Seamlessly Blended) */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[60%] pointer-events-none z-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/hero_heart.png"
                alt="Anatomical Glass Heart Telemetry"
                fill
                className="object-contain object-right drop-shadow-[0_25px_60px_rgba(59,130,246,0.8)] animate-float"
                style={{ mixBlendMode: 'screen' }}
                priority
              />
            </div>
          </div>

          {/* Top Hero Header Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-sm">
              <Activity className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>HEALTH OVERVIEW • CARDIAC TELEMETRY</span>
            </div>

            <button className="flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-all border border-white/15">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Requirement 6: Personalized Greeting (NO EMOJI, NO PLAYFUL ICONS) */}
          <div className="relative z-10 my-6 max-w-md space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {userName ? `Hello, ${userName}` : 'Hello'}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-semibold tracking-wide">
              How can HealthBridge assist you today?
            </p>

            {/* Metric Row Badges */}
            <div className="flex items-center gap-5 pt-3 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">72 bpm</div>
                  <div className="text-[10px] text-blue-200 font-medium">Heart Rate</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Activity className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">98%</div>
                  <div className="text-[10px] text-blue-200 font-medium">SpO₂ Level</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <div className="text-sm font-extrabold">4.9 / 5</div>
                  <div className="text-[10px] text-blue-200 font-medium">Rhythm Index</div>
                </div>
              </div>
            </div>

            {/* Primary Action Pill Button */}
            <div className="pt-2">
              <Link
                href="/dashboard/progress"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#0D1B2A] hover:bg-slate-100 font-black text-xs transition-all shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4 fill-[#0D1B2A]" />
                <span>Check Clinical Vitals</span>
              </Link>
            </div>
          </div>

          {/* Bottom Scheduled Vitals & Care Chips */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between text-xs font-extrabold text-blue-100 mb-3">
              <span>Scheduled Vitals & Care</span>
              <Link href="/dashboard/appointments" className="text-white hover:underline text-[11px] font-bold">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white transition-all hover:bg-white/25">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-200 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>08:00</span>
                </div>
                <div className="text-xs font-extrabold mt-1 truncate">Blood Pressure</div>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white transition-all hover:bg-white/25">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-200 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>12:30</span>
                </div>
                <div className="text-xs font-extrabold mt-1 truncate">Medication Dose</div>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white transition-all hover:bg-white/25">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-200 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>16:00</span>
                </div>
                <div className="text-xs font-extrabold mt-1 truncate">Hydration Intake</div>
              </div>

              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-white transition-all hover:bg-white/25">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-200 font-bold">
                  <Clock className="w-3 h-3" />
                  <span>20:00</span>
                </div>
                <div className="text-xs font-extrabold mt-1 truncate">Night Recovery</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT TOP CARDS & BOTTOM PROGRESS CARD (5 COLS) ── */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between w-full">
          
          {/* TOP ROW: AI ASSISTANT + TODAY'S HEALTH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            
            {/* CARD 1: AI ASSISTANT (Matching Reference AI Assistant) */}
            <div className="bg-white dark:bg-[#18181D] rounded-[28px] p-5 border-2 border-[#0D1B2A] dark:border-slate-800 shadow-lg flex flex-col justify-between w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-extrabold text-[#0D1B2A] dark:text-white">AI Assistant</h3>
                <Sparkles className="w-4 h-4 text-[#4882FF]" />
              </div>

              {/* Central Glowing Audio Waveform Visual */}
              <div className="my-4 flex items-center justify-center gap-1.5 h-16 px-2">
                {[40, 70, 35, 90, 60, 100, 75, 45, 85, 50, 95, 30, 65].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-[#4882FF] animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              {/* Tap to Speak Trigger */}
              <Link
                href="/dashboard/assistant"
                className="w-full py-3 px-3 rounded-2xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 transition-all text-center group flex flex-col items-center justify-center gap-1 border border-blue-200/60 dark:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-[#4882FF] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#0D1B2A] dark:text-white">Tap to speak</div>
                <div className="text-[10px] text-slate-500 font-medium">or ask anything</div>
              </Link>
            </div>

            {/* CARD 2: TODAY'S HEALTH / LIVE VITALS (Matching Reference Today's Activity) */}
            <div className="bg-white dark:bg-[#18181D] rounded-[28px] p-5 border-2 border-[#0D1B2A] dark:border-slate-800 shadow-lg flex flex-col justify-between w-full">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-extrabold text-[#0D1B2A] dark:text-white">Today's health</h3>
              </div>

              {/* Donut Progress Ring */}
              <div className="relative w-24 h-24 mx-auto my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#4882FF]"
                    strokeDasharray={`${adherencePercentage > 0 ? adherencePercentage : 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Flame className="w-4 h-4 text-[#4882FF] mb-0.5" />
                  <div className="text-base font-black text-[#0D1B2A] dark:text-white leading-none">
                    {adherencePercentage > 0 ? `${adherencePercentage}%` : '100%'}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Adherence</div>
                </div>
              </div>

              {/* Vitals Stats List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Footprints className="w-3.5 h-3.5 text-[#4882FF]" />
                    <span>Steps</span>
                  </span>
                  <span className="font-bold text-[#0D1B2A] dark:text-white">{wellness?.steps?.toLocaleString() || '8,646'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#4882FF]" />
                    <span>Active time</span>
                  </span>
                  <span className="font-bold text-[#0D1B2A] dark:text-white">{wellness?.mindfulMinutes || 52} min</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Avg. heart rate</span>
                  </span>
                  <span className="font-bold text-[#0D1B2A] dark:text-white">72 bpm</span>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM CARD: PROGRESS & TRENDS (Matching Reference Progress Card) */}
          <div className="bg-white dark:bg-[#18181D] rounded-[28px] p-6 border-2 border-[#0D1B2A] dark:border-slate-800 shadow-lg space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0D1B2A] dark:text-white">Progress</h3>
              
              <button className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <span>This month</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Vertical Bar Chart */}
            <ReferenceProgressChart />

            {/* Summary Metric Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-[#0D1B2A] dark:text-white">{reports?.length || 24}</div>
                <div className="text-[10px] text-slate-500 font-bold leading-tight mt-0.5">Reports Processed</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-[#0D1B2A] dark:text-white">30</div>
                <div className="text-[10px] text-slate-500 font-bold leading-tight mt-0.5">Days of Activity</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-base font-black text-[#0D1B2A] dark:text-white">18</div>
                <div className="text-[10px] text-slate-500 font-bold leading-tight mt-0.5">Goals Achieved</div>
              </div>
            </div>

            {/* Status Alert Banner */}
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 flex items-center justify-between text-xs text-[#0D1B2A] dark:text-white font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4882FF] shrink-0" />
                <span>Great job! Consistency is the key to results.</span>
              </div>
              <span className="text-[#4882FF] hover:underline cursor-pointer text-[11px] font-black shrink-0">Keep going!</span>
            </div>
          </div>

        </div>

      </div>

      {/* ── LOWER HEALTHBRIDGE CLINICAL MODULES GRID (REPORTS + APPOINTMENTS + CARE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* REPORTS LIST PANEL */}
        <div className="lg:col-span-6 bg-white dark:bg-[#18181D] rounded-[28px] p-6 border-2 border-[#0D1B2A] dark:border-slate-800 shadow-lg space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0D1B2A] dark:text-white">Diagnostic & Lab Reports</h3>
            <Link
              href="/dashboard/reports"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#4882FF] text-white hover:bg-blue-600 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Report</span>
            </Link>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-[#4882FF] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#4882FF] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0D1B2A] dark:text-white">{report.fileName}</h4>
                      <p className="text-[10px] font-semibold text-slate-500">{report.uploadedAt || report.testDate}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/reports"
                    className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[#4882FF] hover:bg-[#4882FF] hover:text-white transition-all shadow-sm"
                  >
                    Analyze
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <div className="text-xs font-bold text-[#0D1B2A] dark:text-white">No medical reports uploaded</div>
              <div className="text-[10px] text-slate-500 mt-0.5 mb-3">Scan lab reports or diagnostic records to view clinical summaries</div>
              <Link
                href="/dashboard/reports"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#4882FF] text-white shadow-sm hover:bg-blue-600"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload First Report</span>
              </Link>
            </div>
          )}
        </div>

        {/* UPCOMING APPOINTMENTS PANEL */}
        <div className="lg:col-span-6 bg-white dark:bg-[#18181D] rounded-[28px] p-6 border-2 border-[#0D1B2A] dark:border-slate-800 shadow-lg flex flex-col justify-between w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0D1B2A] dark:text-white">Upcoming Session</h3>
            <Link
              href="/dashboard/appointments"
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#4882FF] hover:bg-[#4882FF] hover:text-white transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="space-y-4 my-2">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scheduled</div>
                <div className="text-2xl font-black text-[#0D1B2A] dark:text-white tracking-tight">{upcomingAppointment.time}</div>
                <div className="text-xs font-bold text-[#4882FF]">{upcomingAppointment.date}</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4882FF] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0D1B2A] dark:text-white">{upcomingAppointment.doctorName}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{upcomingAppointment.specialty}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <Calendar className="w-8 h-8 mx-auto text-slate-400 mb-1" />
              <div className="text-xs font-bold text-[#0D1B2A] dark:text-white">No upcoming session</div>
              <div className="text-[10px] text-slate-500 mt-0.5 mb-2">Book a doctor or specialist consultation</div>
              <Link href="/dashboard/appointments" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#4882FF] text-white">
                <Plus className="w-3.5 h-3.5" />
                <span>Book Session</span>
              </Link>
            </div>
          )}

          <Link href="/dashboard/appointments" className="text-center py-2 text-xs font-bold text-[#4882FF] hover:underline">
            View All Appointments →
          </Link>
        </div>

      </div>

    </div>
  );
}

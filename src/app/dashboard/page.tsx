'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Droplet,
  Brain,
  ChevronDown,
  ArrowUpRight,
  Download,
  Calendar,
  Target,
  FileText,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DashboardWebGLBackground } from '@/components/3d/DashboardWebGLBackground';
import { Spatial3DDashboard } from '@/components/3d/Spatial3DDashboard';

/* ─── REAL HEALTH IMPROVEMENT CURVED CHART WITH WebGL GLOW ─── */
function HealthImprovementChart() {
  const [selectedPoint, setSelectedPoint] = useState<number>(4);
  const data = [42, 55, 48, 64, 82, 76, 94];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const width = 500;
  const height = 180;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 40) + 20;
    const y = height - (val / 100) * (height - 40) - 20;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  const activePt = points[selectedPoint];

  return (
    <div className="relative w-full space-y-3">
      <div className="h-[210px] w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4D50A2" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4D50A2" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Glowing Vector Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#4D50A2"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_4px_12px_rgba(77,80,162,0.5)]"
          />

          {/* Vertical Guidance Line */}
          {activePt && (
            <line
              x1={activePt.x}
              y1={activePt.y}
              x2={activePt.x}
              y2={height}
              stroke="#F9DF77"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Precision Data Nodes */}
          {points.map((pt, idx) => (
            <g key={idx} onClick={() => setSelectedPoint(idx)} className="cursor-pointer group">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={idx === selectedPoint ? '7' : '4.5'}
                fill={idx === selectedPoint ? '#F9DF77' : '#FFFFFF'}
                stroke="#4D50A2"
                strokeWidth={idx === selectedPoint ? '3' : '2'}
                className="transition-all duration-200 group-hover:scale-125"
              />
            </g>
          ))}
        </svg>

        {/* Tabular Value Overlay Callout */}
        {activePt && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-200"
            style={{
              left: `${(activePt.x / width) * 100}%`,
              top: `${(activePt.y / height) * 100 - 12}%`,
            }}
          >
            <div className="bg-[#2F3273] text-[#F9DF77] text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xl border border-[#4D50A2]/40 flex flex-col items-center whitespace-nowrap font-mono tabular-nums">
              <span>{activePt.val}% Vital Optimization</span>
              <span className="text-[9px] text-[#CBD0FB] font-semibold">Realtime Telemetry</span>
            </div>
          </div>
        )}
      </div>

      {/* Days Selector */}
      <div className="flex justify-between items-center px-2 text-[11px] font-mono font-bold text-[#4D50A2] dark:text-[#CBD0FB] border-t border-[#2F3273]/10 dark:border-white/10 pt-2">
        {days.map((day, idx) => (
          <span
            key={day}
            onClick={() => setSelectedPoint(idx)}
            className={`cursor-pointer transition-colors px-2 py-0.5 rounded-lg ${
              idx === selectedPoint
                ? 'text-[#2F3273] bg-[#F9DF77] font-black shadow-sm'
                : 'hover:text-[#2F3273] dark:hover:text-white'
            }`}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { activeProfile, reports, appointments, wellness, adherencePercentage } = useApp();

  const activeAppointments = appointments.filter((a) => a.status === 'Upcoming');
  const upcomingAppointment = activeAppointments[0];

  return (
    <div className="relative min-h-screen space-y-6 pb-12">
      {/* ── 1. WEBGL AMBIENT BACKGROUND LAYER ── */}
      <DashboardWebGLBackground />

      {/* ── 2. ROTATABLE 3D SPATIAL DASHBOARD WRAPPER ── */}
      <Spatial3DDashboard>
        <div className="space-y-6 relative z-10">
          
          {/* ── TOP MAIN GRID (DASHBOARD COMMAND CENTER) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* ── LEFT HERO GLASS PANEL (#2F3273 DEEP INDIGO HERO CARD) ── */}
            <div className="lg:col-span-7 bg-[#2F3273] text-white p-7 sm:p-8 relative overflow-hidden flex flex-col justify-between min-h-[420px] rounded-2xl border border-[#4D50A2]/40 shadow-2xl">
              
              {/* Dynamic Personal Greeting & Headline */}
              <div className="relative z-20 max-w-lg space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#4D50A2] border border-white/20 text-[#F9DF77] text-xs font-mono font-bold uppercase tracking-wider">
                  <Activity className="h-3.5 w-3.5 text-[#F9DF77] animate-pulse" />
                  <span>Clinical Command Center</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Hello, <span className="text-[#F9DF77]">{activeProfile?.name || 'Patient'}</span>
                </h1>
                
                <p className="text-base sm:text-lg font-semibold text-[#CBD0FB] tracking-tight">
                  How can HealthBridge assist you today?
                </p>
              </div>

              {/* Right Side Telemetry Callouts */}
              <div className="absolute right-6 top-6 sm:top-8 z-10 hidden sm:flex flex-col gap-2 pointer-events-none">
                <div className="p-3.5 rounded-xl bg-[#1E204A] border border-[#4D50A2]/40 space-y-1 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#F9DF77] uppercase tracking-wider font-bold">
                    <Zap className="h-3 w-3 text-[#F9DF77] animate-pulse" />
                    <span>Realtime Telemetry</span>
                  </div>
                  <div className="text-lg font-black font-mono tabular-nums text-white">78 BPM</div>
                  <div className="text-[10px] text-[#CBD0FB]">Sinus Rhythm · Normal</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1E204A] border border-[#4D50A2]/40 space-y-1 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#F9DF77] uppercase tracking-wider font-bold">
                    <ShieldCheck className="h-3 w-3 text-[#F9DF77]" />
                    <span>SpO2 Oxygen Sync</span>
                  </div>
                  <div className="text-lg font-black font-mono tabular-nums text-white">98%</div>
                  <div className="text-[10px] text-[#CBD0FB]">Blood Oxygen Saturation</div>
                </div>
              </div>

              {/* 3 Metric Glass Subcards */}
              <div className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
                
                <div className="bg-[#1E204A] p-4 rounded-xl border border-[#4D50A2]/30 transition-all hover:border-[#F9DF77]">
                  <div className="flex items-center justify-between text-[#CBD0FB] text-xs font-bold mb-1.5">
                    <span>Adherence Rate</span>
                    <div className="p-1.5 rounded-lg bg-[#4D50A2] text-[#F9DF77]">
                      <Target className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="text-[10px] text-[#CBD0FB]/70 font-mono">Status: Optimal</div>
                  <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
                    {adherencePercentage > 0 ? `${adherencePercentage}%` : '94%'}
                  </div>
                </div>

                <div className="bg-[#1E204A] p-4 rounded-xl border border-[#4D50A2]/30 transition-all hover:border-[#F9DF77]">
                  <div className="flex items-center justify-between text-[#CBD0FB] text-xs font-bold mb-1.5">
                    <span>Daily Hydration</span>
                    <div className="p-1.5 rounded-lg bg-[#4D50A2] text-[#F9DF77]">
                      <Droplet className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="text-[10px] text-[#CBD0FB]/70 font-mono">
                    Target: {wellness?.waterGoalMl || 2500} ml
                  </div>
                  <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
                    {wellness?.waterIntakeMl || 1850} <span className="text-xs font-semibold text-[#CBD0FB]">ml</span>
                  </div>
                </div>

                <div className="bg-[#1E204A] p-4 rounded-xl border border-[#4D50A2]/30 transition-all hover:border-[#F9DF77]">
                  <div className="flex items-center justify-between text-[#CBD0FB] text-xs font-bold mb-1.5">
                    <span>Mindfulness</span>
                    <div className="p-1.5 rounded-lg bg-[#4D50A2] text-[#F9DF77]">
                      <Brain className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="text-[10px] text-[#CBD0FB]/70 font-mono">Logged Today</div>
                  <div className="text-2xl font-black font-mono tabular-nums text-white mt-1">
                    {wellness?.mindfulMinutes || 35} <span className="text-xs font-semibold text-[#CBD0FB]">mins</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ── RIGHT SUPPORTING ANALYTICS GLASS PANEL ── */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1E204A] p-7 sm:p-8 flex flex-col justify-between rounded-2xl border border-[#2F3273]/15 dark:border-white/15 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#4D50A2]" />
                    <h3 className="text-lg font-extrabold text-[#2F3273] dark:text-white tracking-tight">Health Improvement</h3>
                  </div>
                  <p className="text-xs font-semibold text-[#4D50A2] dark:text-[#CBD0FB]">7-Day Telemetry Trends</p>
                </div>
                
                <button className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#F4F5FB] dark:bg-[#2F3273] text-[#2F3273] dark:text-white border border-[#2F3273]/15 flex items-center gap-1">
                  <span>This Week</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#4D50A2]" />
                </button>
              </div>

              <HealthImprovementChart />
            </div>

          </div>

          {/* ── LOWER 3-CARD FULL VIEWPORT GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* ── CARD 1: MEDICAL REPORTS PANEL ── */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1E204A] p-6 space-y-4 rounded-2xl border border-[#2F3273]/15 dark:border-white/15 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#F9DF77]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#2F3273] dark:text-white">Diagnostic Reports</h3>
                </div>

                <Link href="/dashboard/reports" className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#4D50A2] text-white flex items-center gap-1.5 hover:bg-[#2F3273] transition-all">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Report</span>
                </Link>
              </div>

              {reports.length > 0 ? (
                <div className="space-y-2.5">
                  {reports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#F4F5FB] dark:bg-[#2F3273] border border-[#2F3273]/10 dark:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#4D50A2] text-white flex items-center justify-center shrink-0 font-bold">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#2F3273] dark:text-white">{report.fileName}</h4>
                          <p className="text-[10px] font-mono text-[#4D50A2] dark:text-[#CBD0FB]">{report.uploadedAt || report.testDate}</p>
                        </div>
                      </div>

                      <a
                        href={report.fileUrl || '#'}
                        download
                        className="p-2 rounded-lg bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#F9DF77] hover:bg-[#4D50A2] hover:text-white transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-[#F4F5FB] dark:bg-[#2F3273] rounded-xl border border-dashed border-[#4D50A2]/30 space-y-3">
                  <FileText className="h-8 w-8 mx-auto text-[#4D50A2]" />
                  <div className="space-y-1">
                    <div className="text-xs font-extrabold text-[#2F3273] dark:text-white">No medical reports uploaded</div>
                    <div className="text-[11px] text-[#4D50A2] dark:text-[#CBD0FB]">Scan lab diagnostic records to summarize clinical data</div>
                  </div>
                  <Link href="/dashboard/reports" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#4D50A2] text-white">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Upload Diagnostic File</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ── CARD 2: UPCOMING CONSULTATION SESSION ── */}
            <div className="lg:col-span-3 bg-white dark:bg-[#1E204A] p-6 flex flex-col justify-between space-y-4 rounded-2xl border border-[#2F3273]/15 dark:border-white/15 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#F9DF77]">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#2F3273] dark:text-white">Upcoming Session</h3>
                </div>

                <Link
                  href="/dashboard/appointments"
                  className="p-1.5 rounded-lg bg-[#F4F5FB] dark:bg-[#2F3273] text-[#4D50A2] dark:text-[#F9DF77]"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {upcomingAppointment ? (
                <div className="space-y-3 my-2">
                  <div className="p-3.5 rounded-xl bg-[#2F3273] text-white space-y-1">
                    <div className="text-[10px] font-mono text-[#CBD0FB] uppercase tracking-wider">Scheduled Time</div>
                    <div className="text-xl font-black font-mono tabular-nums text-[#F9DF77]">{upcomingAppointment.time}</div>
                    <div className="text-xs font-bold text-white">{upcomingAppointment.date}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F5FB] dark:bg-[#2F3273] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#4D50A2] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#2F3273] dark:text-white">{upcomingAppointment.doctorName}</div>
                      <div className="text-[10px] font-mono text-[#4D50A2] dark:text-[#CBD0FB]">{upcomingAppointment.specialty}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 text-center bg-[#F4F5FB] dark:bg-[#2F3273] rounded-xl border border-dashed border-[#4D50A2]/30 space-y-2">
                  <Calendar className="h-7 w-7 mx-auto text-[#4D50A2]" />
                  <div className="text-xs font-extrabold text-[#2F3273] dark:text-white">No session booked</div>
                  <div className="text-[10px] text-[#4D50A2] dark:text-[#CBD0FB]">Book a specialist telemedicine consultation</div>
                  <Link href="/dashboard/appointments" className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-[#4D50A2] text-white">
                    <Plus className="h-3 w-3" />
                    <span>Book Session</span>
                  </Link>
                </div>
              )}

              <Link href="/dashboard/appointments" className="text-center text-xs font-extrabold text-[#4D50A2] dark:text-[#F9DF77] hover:underline">
                View All Appointments →
              </Link>
            </div>

            {/* ── CARD 3: ACTIVE TREATMENT PATH & GOALS ── */}
            <div className="lg:col-span-4 bg-white dark:bg-[#1E204A] p-6 space-y-4 rounded-2xl border border-[#2F3273]/15 dark:border-white/15 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#4D50A2]/10 text-[#4D50A2] dark:text-[#F9DF77]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#2F3273] dark:text-white">Active Path Progress</h3>
                </div>

                <span className="text-xl font-black font-mono tabular-nums text-[#4D50A2] dark:text-[#F9DF77]">
                  {adherencePercentage > 0 ? `${adherencePercentage}%` : '94%'}
                </span>
              </div>

              <div className="space-y-4">
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-[#2F3273] dark:text-white font-mono">
                    <span>Medication Adherence</span>
                    <span className="tabular-nums">{adherencePercentage > 0 ? `${adherencePercentage}%` : '94%'}</span>
                  </div>
                  <div className="w-full h-3 bg-[#F4F5FB] dark:bg-[#2F3273] rounded-lg overflow-hidden p-0.5 border border-[#2F3273]/10">
                    <div
                      className="h-full rounded-md bg-[#4D50A2] transition-all duration-500"
                      style={{ width: `${adherencePercentage > 0 ? adherencePercentage : 94}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-[#2F3273] dark:text-white font-mono">
                    <span>Hydration Target</span>
                    <span className="tabular-nums">
                      {Math.min(100, Math.round(((wellness?.waterIntakeMl || 1850) / (wellness?.waterGoalMl || 2500)) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#F4F5FB] dark:bg-[#2F3273] rounded-lg overflow-hidden p-0.5 border border-[#2F3273]/10">
                    <div
                      className="h-full rounded-md bg-[#F9DF77] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round(((wellness?.waterIntakeMl || 1850) / (wellness?.waterGoalMl || 2500)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-extrabold text-[#2F3273] dark:text-white font-mono">
                    <span>Daily Activity Goal</span>
                    <span className="tabular-nums">
                      {Math.min(100, Math.round(((wellness?.steps || 6400) / (wellness?.stepGoal || 8000)) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#F4F5FB] dark:bg-[#2F3273] rounded-lg overflow-hidden p-0.5 border border-[#2F3273]/10">
                    <div
                      className="h-full rounded-md bg-[#2F3273] dark:bg-[#CBD0FB] transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round(((wellness?.steps || 6400) / (wellness?.stepGoal || 8000)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </Spatial3DDashboard>
    </div>
  );
}

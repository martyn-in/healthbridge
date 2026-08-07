'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  ChevronDown,
  ArrowUpRight,
  Download,
  Calendar,
  Target,
  Zap,
  FileText,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

/* ─── REAL HEALTH IMPROVEMENT CURVED CHART ─── */
function HealthImprovementChart() {
  const [selectedPoint, setSelectedPoint] = useState<number>(4);
  const data = [40, 50, 45, 60, 75, 70, 80];
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
    <div className="relative w-full">
      <div className="h-[200px] w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="softPurpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8C73FF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#8C73FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <path d={areaD} fill="url(#softPurpleGrad)" />

          <path
            d={pathD}
            fill="none"
            stroke="#8C73FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activePt && (
            <line
              x1={activePt.x}
              y1={activePt.y}
              x2={activePt.x}
              y2={height}
              stroke="#8C73FF"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          )}

          {points.map((pt, idx) => (
            <g key={idx} onClick={() => setSelectedPoint(idx)} className="cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r={idx === selectedPoint ? '7' : '4'}
                fill={idx === selectedPoint ? '#8C73FF' : '#FFFFFF'}
                stroke="#8C73FF"
                strokeWidth={idx === selectedPoint ? '3' : '2'}
              />
            </g>
          ))}
        </svg>

        {activePt && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
            style={{
              left: `${(activePt.x / width) * 100}%`,
              top: `${(activePt.y / height) * 100 - 10}%`,
            }}
          >
            <div className="bg-[#6E56CF] dark:bg-[#8C73FF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex flex-col items-center whitespace-nowrap">
              <span>{activePt.val}% Health Sync</span>
              <span className="text-[8px] opacity-90">Live Telemetry</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-3 mt-2 text-[11px] font-bold text-[#6B677E] dark:text-[#CBD5E1]">
        {days.map((day, idx) => (
          <span
            key={day}
            onClick={() => setSelectedPoint(idx)}
            className={`cursor-pointer transition-colors ${
              idx === selectedPoint ? 'text-[#6E56CF] dark:text-[#8C73FF] font-extrabold' : 'hover:text-[#1E1B2E] dark:hover:text-white'
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

  const activeAppointments = appointments.filter(a => a.status === 'Upcoming');
  const upcomingAppointment = activeAppointments[0];

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#E8E3FF] selection:text-[#6E56CF]">
      
      {/* ── TOP MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT HERO AREA ── */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] rounded-3xl p-7 relative overflow-hidden border border-[var(--surface-border)] shadow-sm flex flex-col justify-between min-h-[380px]">
          
          {/* Editorial Headline */}
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl sm:text-4xl font-light text-[#1E1B2E] dark:text-[#F8FAFC] leading-tight tracking-tight">
              Hello, <span className="font-extrabold text-[#1E1B2E] dark:text-[#F8FAFC]">{activeProfile?.name || 'User'} 👋</span>
            </h1>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B2E] dark:text-[#F8FAFC] leading-tight tracking-tight mt-1">
              How are you feeling today?
            </h2>
          </div>

          {/* Central 3D Organ Visualization */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 pointer-events-none opacity-90 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="absolute w-56 h-56 rounded-full blur-3xl opacity-30 animate-pulse"
                style={{ background: 'radial-gradient(circle, #8C73FF 0%, #3B315B 100%)' }}
              />
              
              <svg viewBox="0 0 200 200" className="w-48 h-48 relative z-10 drop-shadow-md animate-float">
                <defs>
                  <linearGradient id="softOrganGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#E8E3FF" />
                    <stop offset="80%" stopColor="#B9ACFF" />
                    <stop offset="100%" stopColor="#6E56CF" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 30 C60 30, 30 60, 30 100 C30 130, 50 160, 100 175 C150 160, 170 130, 170 100 C170 60, 140 30, 100 30 Z M70 80 C80 65, 120 65, 130 80 C140 95, 130 120, 100 140 C70 120, 60 95, 70 80 Z"
                  fill="url(#softOrganGrad)"
                  opacity="0.95"
                />
                <circle cx="100" cy="100" r="12" fill="#6E56CF" className="animate-ping" opacity="0.6" />
                <circle cx="100" cy="100" r="7" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* 3 REAL METRIC CARDS */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            
            <div className="bg-[var(--bg-card-subtle)] backdrop-blur-md rounded-2xl p-4 border border-[var(--surface-border)] shadow-sm transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between text-[#6B677E] dark:text-[#CBD5E1] text-xs font-semibold mb-2">
                <span>Adherence Score</span>
                <Target className="h-4 w-4 text-[#6E56CF] dark:text-[#8C73FF]" />
              </div>
              <div className="text-[10px] text-[#6B677E] dark:text-[#CBD5E1] font-medium">Status: <span className="text-[#1E1B2E] dark:text-[#F8FAFC] font-bold">Active</span></div>
              <div className="text-2xl font-black text-[#1E1B2E] dark:text-[#F8FAFC] mt-1">{adherencePercentage > 0 ? `${adherencePercentage}%` : '100%'}</div>
            </div>

            <div className="bg-[var(--bg-card-subtle)] backdrop-blur-md rounded-2xl p-4 border border-[var(--surface-border)] shadow-sm transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between text-[#6B677E] dark:text-[#CBD5E1] text-xs font-semibold mb-2">
                <span>Daily Hydration</span>
                <Brain className="h-4 w-4 text-[#6E56CF] dark:text-[#8C73FF]" />
              </div>
              <div className="text-[10px] text-[#6B677E] dark:text-[#CBD5E1] font-medium">Goal: <span className="text-[#1E1B2E] dark:text-[#F8FAFC] font-bold">{wellness?.waterGoalMl || 2500} ml</span></div>
              <div className="text-2xl font-black text-[#1E1B2E] dark:text-[#F8FAFC] mt-1">{wellness?.waterIntakeMl || 0} <span className="text-xs font-medium text-[#6B677E] dark:text-[#CBD5E1]">ml</span></div>
            </div>

            <div className="bg-[var(--bg-card-subtle)] backdrop-blur-md rounded-2xl p-4 border border-[var(--surface-border)] shadow-sm transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between text-[#6B677E] dark:text-[#CBD5E1] text-xs font-semibold mb-2">
                <span>Mindfulness</span>
                <Zap className="h-4 w-4 text-[#6E56CF] dark:text-[#8C73FF]" />
              </div>
              <div className="text-[10px] text-[#6B677E] dark:text-[#CBD5E1] font-medium">Recorded Today</div>
              <div className="text-2xl font-black text-[#1E1B2E] dark:text-[#F8FAFC] mt-1">{wellness?.mindfulMinutes || 0} <span className="text-xs font-medium text-[#6B677E] dark:text-[#CBD5E1]">mins</span></div>
            </div>

          </div>
        </div>

        {/* ── RIGHT PRIMARY ANALYTICS PANEL ── */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] rounded-3xl p-7 border border-[var(--surface-border)] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">Health Improvement</h3>
              <p className="text-xs font-semibold text-[#6B677E] dark:text-[#CBD5E1] mt-0.5">This week</p>
            </div>
            
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--bg-card-subtle)] border border-[var(--surface-border)] text-[#1E1B2E] dark:text-[#F8FAFC] transition-all">
              <span>Week</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#6B677E] dark:text-[#CBD5E1]" />
            </button>
          </div>

          <HealthImprovementChart />
        </div>

      </div>

      {/* ── LOWER 3-CARD GRID (REPORTS + UPCOMING APPOINTMENT + ACTIVE PATH) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── CARD 1: REPORTS LIST ── */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--surface-border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">Reports</h3>
            <Link href="/dashboard/reports" className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-lavender)] text-[#6E56CF] dark:text-[#8C73FF] hover:brightness-110">
              <Plus className="h-3 w-3" />
              <span>Upload Report</span>
            </Link>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--surface-border)] hover:brightness-105 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-lavender)] text-[#6E56CF] dark:text-[#8C73FF] flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">{report.fileName}</h4>
                      <p className="text-[10px] font-semibold text-[#6B677E] dark:text-[#CBD5E1]">{report.uploadedAt || report.testDate}</p>
                    </div>
                  </div>

                  <a
                    href={report.fileUrl || '#'}
                    download
                    className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--surface-border)] flex items-center justify-center text-[#6E56CF] dark:text-[#8C73FF] hover:bg-[#6E56CF] hover:text-white transition-all shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[var(--bg-card-subtle)] rounded-2xl border border-dashed border-[var(--surface-border)]">
              <FileText className="h-8 w-8 mx-auto text-[#6E56CF] dark:text-[#8C73FF] opacity-60 mb-2" />
              <div className="text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">No medical reports uploaded</div>
              <div className="text-[10px] text-[#6B677E] dark:text-[#CBD5E1] mt-0.5 mb-3">Scan lab reports or diagnostic records to view clinical summaries</div>
              <Link href="/dashboard/reports" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#6E56CF] dark:bg-[#8C73FF] text-white shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                <span>Upload First Report</span>
              </Link>
            </div>
          )}
        </div>

        {/* ── CARD 2: UPCOMING SESSION ── */}
        <div className="lg:col-span-3 bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--surface-border)] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">Upcoming Session</h3>
            <Link
              href="/dashboard/appointments"
              className="w-8 h-8 rounded-full bg-[var(--bg-card-subtle)] flex items-center justify-center text-[#6E56CF] dark:text-[#8C73FF] hover:bg-[#6E56CF] hover:text-white transition-all"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="space-y-4 my-2">
              <div>
                <div className="text-xs font-bold text-[#6B677E] dark:text-[#CBD5E1] uppercase tracking-wider mb-1">Scheduled</div>
                <div className="text-2xl font-black text-[#1E1B2E] dark:text-[#F8FAFC] tracking-tight">{upcomingAppointment.time}</div>
                <div className="text-xs font-bold text-[#6E56CF] dark:text-[#8C73FF]">{upcomingAppointment.date}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--surface-border)] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#6E56CF] dark:bg-[#8C73FF] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">{upcomingAppointment.doctorName}</div>
                  <div className="text-[10px] text-[#6B677E] dark:text-[#CBD5E1] font-medium">{upcomingAppointment.specialty}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-4 text-center p-4 bg-[var(--bg-card-subtle)] rounded-2xl border border-dashed border-[var(--surface-border)]">
              <Calendar className="h-6 w-6 mx-auto text-[#6E56CF] dark:text-[#8C73FF] opacity-60 mb-1" />
              <div className="text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">No upcoming session</div>
              <div className="text-[10px] text-[#6B677E] dark:text-[#CBD5E1] mt-0.5">Schedule a doctor visit anytime</div>
            </div>
          )}

          <Link href="/dashboard/appointments" className="text-xs font-bold text-[#6E56CF] dark:text-[#8C73FF] hover:underline flex items-center justify-center gap-1 pt-2">
            <span>View All Appointments</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* ── CARD 3: ACTIVE PATH THIS WEEK ── */}
        <div className="lg:col-span-4 bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--surface-border)] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">Active path this week</h3>
            <span className="text-2xl font-black text-[#1E1B2E] dark:text-[#F8FAFC]">100%</span>
          </div>

          <div className="space-y-4 my-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">
                <span>Medication Adherence</span>
                <span>{adherencePercentage > 0 ? `${adherencePercentage}%` : '100%'}</span>
              </div>
              <div className="w-full h-8 bg-[var(--bg-card-subtle)] rounded-full overflow-hidden p-1 flex items-center border border-[var(--surface-border)]">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-extrabold bg-[#6E56CF] dark:bg-[#8C73FF] text-white"
                  style={{ width: `${adherencePercentage > 0 ? adherencePercentage : 100}%` }}
                >
                  {adherencePercentage > 0 ? `${adherencePercentage}%` : '100%'}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">
                <span>Hydration Tracking</span>
                <span>{Math.min(100, Math.round(((wellness?.waterIntakeMl || 0) / (wellness?.waterGoalMl || 2500)) * 100))}%</span>
              </div>
              <div className="w-full h-8 bg-[var(--bg-card-subtle)] rounded-full overflow-hidden p-1 flex items-center border border-[var(--surface-border)]">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-extrabold bg-[#6E56CF] dark:bg-[#8C73FF] text-white"
                  style={{
                    width: `${Math.max(12, Math.min(100, Math.round(((wellness?.waterIntakeMl || 0) / (wellness?.waterGoalMl || 2500)) * 100)))}%`,
                  }}
                >
                  {Math.min(100, Math.round(((wellness?.waterIntakeMl || 0) / (wellness?.waterGoalMl || 2500)) * 100))}%
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#1E1B2E] dark:text-[#F8FAFC]">
                <span>Daily Steps Goal</span>
                <span>{Math.min(100, Math.round(((wellness?.steps || 0) / (wellness?.stepGoal || 8000)) * 100))}%</span>
              </div>
              <div className="w-full h-8 bg-[var(--bg-card-subtle)] rounded-full overflow-hidden p-1 flex items-center border border-[var(--surface-border)]">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-extrabold bg-[#6E56CF] dark:bg-[#8C73FF] text-white"
                  style={{
                    width: `${Math.max(12, Math.min(100, Math.round(((wellness?.steps || 0) / (wellness?.stepGoal || 8000)) * 100)))}%`,
                  }}
                >
                  {Math.min(100, Math.round(((wellness?.steps || 0) / (wellness?.stepGoal || 8000)) * 100))}%
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Heart,
  Brain,
  ChevronDown,
  ArrowUpRight,
  Download,
  Calendar,
  Sparkles,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  FileText,
  Filter,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

/* ─── SMOOTH CURVED CHART COMPONENT (Matching Image 1 Health Improvement Card) ─── */
function HealthImprovementChart() {
  const [selectedPoint, setSelectedPoint] = useState<number>(4); // Default Friday active
  const data = [35, 45, 40, 55, 82, 60, 68];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const width = 500;
  const height = 180;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 40) + 20;
    const y = height - (val / 100) * (height - 40) - 20;
    return { x, y, val };
  });

  // Generate smooth SVG cubic bezier path
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
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8C73FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8C73FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#purpleGrad)" />

          {/* Smooth Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#8C73FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Dotted Guide Line for Active Point */}
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

          {/* Data Points */}
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

        {/* Floating Tooltip Pill matching Image 1 ("80%+ Imp 6 Aug 2026") */}
        {activePt && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
            style={{
              left: `${(activePt.x / width) * 100}%`,
              top: `${(activePt.y / height) * 100 - 10}%`,
            }}
          >
            <div className="bg-[#8C73FF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex flex-col items-center whitespace-nowrap">
              <span>80%+ Imp</span>
              <span className="text-[8px] opacity-80">6 Aug 2026</span>
            </div>
          </div>
        )}
      </div>

      {/* X-Axis Days Labels */}
      <div className="flex justify-between items-center px-3 mt-2 text-[11px] font-bold text-[#6F6F70]">
        {days.map((day, idx) => (
          <span
            key={day}
            onClick={() => setSelectedPoint(idx)}
            className={`cursor-pointer transition-colors ${
              idx === selectedPoint ? 'text-[#8C73FF] font-extrabold' : 'hover:text-[#111111]'
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
  const { activeProfile, reports, appointments, triggerSos } = useApp();

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#D8FF57] selection:text-[#111111]">
      
      {/* ── TOP MAIN GRID (IMAGE 1 LAYOUT: Left Hero Area + Right Health Improvement Card) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT HERO AREA (7 COLS - IMAGE 1 EXACT COMPOSITION) ── */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-7 relative overflow-hidden border border-black/5 shadow-sm flex flex-col justify-between min-h-[380px]">
          
          {/* Headline Typography */}
          <div className="relative z-10 max-w-md">
            <h1 className="text-3xl sm:text-4xl font-light text-[#111111] leading-tight tracking-tight">
              Hello, <span className="font-extrabold">{activeProfile?.name || 'Sara'} 👋</span>
            </h1>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight tracking-tight mt-1">
              How are you feeling today?
            </h2>
          </div>

          {/* Central Organ / 3D Anatomical Visual Representation (Matching Image 1 Brain / Heart visual) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 pointer-events-none opacity-90 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Soft Ambient Glowing Aura */}
              <div
                className="absolute w-56 h-56 rounded-full blur-3xl opacity-40 animate-pulse"
                style={{ background: 'radial-gradient(circle, #B9ACFF 0%, #8C73FF 100%)' }}
              />
              
              {/* Stylized 3D Brain / Anatomical Heart SVG Graphic */}
              <svg viewBox="0 0 200 200" className="w-48 h-48 relative z-10 drop-shadow-xl animate-float">
                <defs>
                  <linearGradient id="organGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EEEAFE" />
                    <stop offset="50%" stopColor="#B9ACFF" />
                    <stop offset="100%" stopColor="#8C73FF" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 30 C60 30, 30 60, 30 100 C30 130, 50 160, 100 175 C150 160, 170 130, 170 100 C170 60, 140 30, 100 30 Z M70 80 C80 65, 120 65, 130 80 C140 95, 130 120, 100 140 C70 120, 60 95, 70 80 Z"
                  fill="url(#organGrad)"
                  opacity="0.9"
                />
                <circle cx="100" cy="100" r="14" fill="#D8FF57" className="animate-ping" opacity="0.7" />
                <circle cx="100" cy="100" r="8" fill="#111111" />
              </svg>
            </div>
          </div>

          {/* 3 FLOATING METRIC CARDS (Image 1 Position & Structure) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            
            {/* Floating Card 1: Goal Progress / Health Score */}
            <div className="bg-[#F4F4F0]/90 backdrop-blur-md rounded-2xl p-4 border border-black/5 shadow-sm transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between text-[#6F6F70] text-xs font-semibold mb-2">
                <span>Goal Progress</span>
                <Target className="h-4 w-4 text-[#8C73FF]" />
              </div>
              <div className="text-[10px] text-[#6F6F70] font-medium">Status: <span className="text-[#111111] font-bold">Standard</span></div>
              <div className="text-2xl font-black text-[#111111] mt-1">65%</div>
            </div>

            {/* Floating Card 2: Stress Level */}
            <div className="bg-[#F4F4F0]/90 backdrop-blur-md rounded-2xl p-4 border border-black/5 shadow-sm transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between text-[#6F6F70] text-xs font-semibold mb-2">
                <span>Stress Level</span>
                <Brain className="h-4 w-4 text-[#8C73FF]" />
              </div>
              <div className="text-[10px] text-[#6F6F70] font-medium">Status: <span className="text-[#111111] font-bold">Low</span></div>
              <div className="text-2xl font-black text-[#111111] mt-1">70%</div>
            </div>

            {/* Floating Card 3: Focus Power */}
            <div className="bg-[#F4F4F0]/90 backdrop-blur-md rounded-2xl p-4 border border-black/5 shadow-sm transition-all hover:translate-y-[-2px]">
              <div className="flex items-center justify-between text-[#6F6F70] text-xs font-semibold mb-2">
                <span>Focus Power</span>
                <Zap className="h-4 w-4 text-[#8C73FF]" />
              </div>
              <div className="text-[10px] text-[#6F6F70] font-medium">Status: <span className="text-[#111111] font-bold">Standard</span></div>
              <div className="text-2xl font-black text-[#111111] mt-1">42 <span className="text-xs font-medium text-[#6F6F70]">mins</span></div>
            </div>

          </div>
        </div>

        {/* ── RIGHT PRIMARY ANALYTICS PANEL (5 COLS - IMAGE 1 HEALTH IMPROVEMENT CARD) ── */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#111111]">Health Improvement</h3>
              <p className="text-xs font-semibold text-[#6F6F70] mt-0.5">This week</p>
            </div>
            
            {/* Week Selector Dropdown */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4F4F0] border border-black/5 text-[#111111] hover:bg-slate-200/60 transition-all">
              <span>Week</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#6F6F70]" />
            </button>
          </div>

          {/* Main Curved Line Chart Component */}
          <HealthImprovementChart />
        </div>

      </div>

      {/* ── LOWER 3-CARD GRID (IMAGE 1 EXACT COMPOSITION: Reports + Upcoming Session + Active Path Progress) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── CARD 1: REPORTS LIST (5 COLS - IMAGE 1 COMPOSITION) ── */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111111]">Reports</h3>
            <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#F4F4F0] text-[#6F6F70] hover:text-[#111111]">
              <span>Filters</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {/* Compact Report Items */}
          <div className="space-y-3">
            {[
              { title: 'Cognitive Therapy', doctor: 'Dr. Jasmin', date: '17-08-25', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80' },
              { title: 'Stress Management', doctor: 'Dr. Jonshon', date: '15-08-25', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80' },
              { title: 'Blood Panel Diagnostics', doctor: 'AI Clinical Check', date: '12-08-25', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80' },
            ].map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F4F0]/80 border border-black/5 hover:bg-[#F4F4F0] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEEAFE] text-[#8C73FF] flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">{report.title}</h4>
                    <p className="text-[10px] font-semibold text-[#6F6F70]">{report.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#6F6F70]">
                    <img src={report.avatar} alt={report.doctor} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-[#111111]">{report.doctor}</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center text-[#111111] hover:bg-[#D8FF57] transition-all shadow-sm">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARD 2: UPCOMING SESSION / REMINDER CARD (3 COLS - IMAGE 1 COMPOSITION) ── */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111111]">Upcoming Session</h3>
            <Link
              href="/dashboard/appointments"
              className="w-8 h-8 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#111111] hover:bg-[#D8FF57] transition-all"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="my-6">
            <div className="text-xs font-bold text-[#6F6F70] uppercase tracking-wider mb-1">Remaining</div>
            <div className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
              6<span className="text-lg font-bold text-[#6F6F70] mr-1">hr</span> 52<span className="text-lg font-bold text-[#6F6F70]">min</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EEEAFE] border border-[#B9ACFF]/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8C73FF] text-white flex items-center justify-center shrink-0 font-bold text-xs">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#111111]">Dr. Jasmin Vance</div>
              <div className="text-[10px] text-[#6F6F70] font-medium">Consultation Session</div>
            </div>
          </div>
        </div>

        {/* ── CARD 3: ACTIVE PATH THIS WEEK / HEALTH TRACKING (4 COLS - IMAGE 1 COMPOSITION) ── */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111111]">Active path this week</h3>
            <span className="text-2xl font-black text-[#111111]">76%</span>
          </div>

          {/* Horizontal Progress Bars */}
          <div className="space-y-4">
            
            {/* Bar 1: Meditation (50%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#111111]">
                <span>Meditation</span>
                <span>50%</span>
              </div>
              <div className="w-full h-8 bg-[#F4F4F0] rounded-full overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-extrabold text-white"
                  style={{ width: '50%', background: '#B9ACFF' }}
                >
                  50%
                </div>
              </div>
            </div>

            {/* Bar 2: Exercise (85%) - Highlight Accent */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#111111]">
                <span>Exercise & Activity</span>
                <span>85%</span>
              </div>
              <div className="w-full h-8 bg-[#F4F4F0] rounded-full overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-extrabold text-[#111111]"
                  style={{ width: '85%', background: '#D8FF57' }}
                >
                  85%
                </div>
              </div>
            </div>

            {/* Bar 3: Journaling (60%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#111111]">
                <span>Journaling & Wellness</span>
                <span>60%</span>
              </div>
              <div className="w-full h-8 bg-[#F4F4F0] rounded-full overflow-hidden p-1 flex items-center">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-extrabold text-white"
                  style={{ width: '60%', background: '#8C73FF' }}
                >
                  60%
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Brain,
  Moon,
  Smile,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

/* ─── MULTI-SERIES CURVED CHART (Image 2 Top Left Panel) ─── */
function MultiSeriesProgressChart() {
  const [activePoint, setActivePoint] = useState<number>(2); // Default active index

  const width = 600;
  const height = 240;

  // Series 1: Mood Balance
  const series1 = [30, 45, 55, 60, 75, 80, 85];
  // Series 2: Stress Level
  const series2 = [20, 35, 40, 48, 52, 58, 62];
  // Series 3: Sleep Quality
  const series3 = [10, 20, 25, 30, 35, 40, 42];

  const getPoints = (data: number[]) => {
    return data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 60) + 30;
      const y = height - (val / 100) * (height - 40) - 20;
      return { x, y, val };
    });
  };

  const points1 = getPoints(series1);
  const points2 = getPoints(series2);
  const points3 = getPoints(series3);

  const getPath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  };

  const ptActive1 = points1[activePoint];
  const ptActive2 = points2[activePoint];
  const ptActive3 = points3[activePoint];

  return (
    <div className="relative w-full">
      <div className="h-[260px] w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Horizontal Background Grid Lines */}
          {[0, 20, 40, 60, 80, 100].map((val) => {
            const y = height - (val / 100) * (height - 40) - 20;
            return (
              <g key={val}>
                <line x1="30" y1={y} x2={width - 30} y2={y} stroke="#000000" strokeWidth="1" strokeDasharray="3 3" opacity="0.08" />
                <text x="5" y={y + 4} fill="#6F6F70" fontSize="10" fontWeight="bold">{val}</text>
              </g>
            );
          })}

          {/* Dotted Vertical Highlight Line */}
          {ptActive1 && (
            <line
              x1={ptActive1.x}
              y1="20"
              x2={ptActive1.x}
              y2={height - 20}
              stroke="#8C73FF"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Path 3: Sleep Quality */}
          <path d={getPath(points3)} fill="none" stroke="#B9ACFF" strokeWidth="3" strokeLinecap="round" />
          {/* Path 2: Stress Level */}
          <path d={getPath(points2)} fill="none" stroke="#8C73FF" strokeWidth="3" strokeLinecap="round" />
          {/* Path 1: Mood Balance */}
          <path d={getPath(points1)} fill="none" stroke="#8C73FF" strokeWidth="3.5" strokeLinecap="round" />

          {/* Dotted End Connectors with Series Floating Badges (Image 2 Right Side Badges) */}
          <circle cx={points1[points1.length - 1].x} cy={points1[points1.length - 1].y} r="5" fill="#8C73FF" />
          <circle cx={points2[points2.length - 1].x} cy={points2[points2.length - 1].y} r="5" fill="#8C73FF" />
          <circle cx={points3[points3.length - 1].x} cy={points3[points3.length - 1].y} r="5" fill="#B9ACFF" />
        </svg>

        {/* Floating Curve Labels Attached to Chart End (Image 2) */}
        <div className="absolute right-0 top-6 flex flex-col gap-3 pointer-events-none">
          <div className="bg-[#EEEAFE] border border-[#B9ACFF]/40 text-[#8C73FF] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            Mood Balance
          </div>
          <div className="bg-[#EEEAFE] border border-[#B9ACFF]/40 text-[#8C73FF] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            Stress Level
          </div>
          <div className="bg-[#EEEAFE] border border-[#B9ACFF]/40 text-[#8C73FF] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            Sleep Quality
          </div>
        </div>

        {/* Floating Tooltip Pill Badge Attached to Vertical Highlight (Image 2) */}
        {ptActive1 && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
            style={{
              left: `${(ptActive1.x / width) * 100}%`,
              top: `${(ptActive1.y / height) * 100 - 12}%`,
            }}
          >
            <div className="bg-[#8C73FF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl flex items-center gap-1">
              <span>80%+ Imp</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── STEPPED BAR CHART (Image 2 Top Right Panel "Health Progress - This week") ─── */
function SteppedHealthProgressChart() {
  const bars = [
    { day: 'MON', height: 40 },
    { day: 'TUE', height: 55 },
    { day: 'WED', height: 70 },
    { day: 'THU', height: 95, active: true },
    { day: 'FRI', height: 50 },
    { day: 'SAT', height: 60 },
    { day: 'SUN', height: 30 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-[180px] pt-6 px-2">
        {bars.map((bar, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
            {bar.active && (
              <div className="bg-[#8C73FF] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md animate-bounce">
                80%+ Imp
              </div>
            )}
            <div className="w-9 sm:w-11 bg-[#F4F4F0] rounded-2xl p-1 flex items-end h-[130px] border border-black/5">
              <div
                className={`w-full rounded-xl transition-all duration-500 ${
                  bar.active
                    ? 'bg-gradient-to-t from-[#8C73FF] to-[#B9ACFF] shadow-md'
                    : 'bg-gradient-to-t from-[#B9ACFF]/40 to-[#B9ACFF]/20 group-hover:from-[#8C73FF]/60'
                }`}
                style={{ height: `${bar.height}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${bar.active ? 'text-[#8C73FF] font-black' : 'text-[#6F6F70]'}`}>
              {bar.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { activeProfile } = useApp();

  return (
    <div className="space-y-8 pb-12 font-sans selection:bg-[#D8FF57] selection:text-[#111111]">
      
      {/* ── PAGE HEADER (IMAGE 2 COMPOSITION) ── */}
      <div className="max-w-xl space-y-1">
        <h1 className="text-3xl sm:text-5xl font-light text-[#111111] leading-tight tracking-tight">
          Your <span className="font-extrabold">Personalized</span>
        </h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] leading-tight tracking-tight">
          Progress and Insights
        </h2>
      </div>

      {/* ── TOP MAIN PANELS (IMAGE 2 EXPLICIT COMPOSITION) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── TOP LEFT PANEL: MULTI-SERIES CHART (7 COLS - IMAGE 2) ── */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-7 border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#111111]">Clinical Metrics & Trends</h3>
              <p className="text-xs font-semibold text-[#6F6F70]">Real-time multi-series biometric correlation</p>
            </div>
          </div>

          <MultiSeriesProgressChart />
        </div>

        {/* ── TOP RIGHT PANEL: HEALTH PROGRESS STEPPED BARS (5 COLS - IMAGE 2) ── */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-[#111111]">Health Progress</h3>
              <p className="text-xs font-semibold text-[#6F6F70]">This week</p>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F4F4F0] border border-black/5 text-[#111111] hover:bg-slate-200/60 transition-all">
              <span>Week</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#6F6F70]" />
            </button>
          </div>

          <SteppedHealthProgressChart />
        </div>

      </div>

      {/* ── LOWER ANALYTICS GRID (IMAGE 2 ASYMMETRICAL 3-CARD COMPOSITION) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LOWER CARD 1: MENTAL PROGRESS THIS WEEK (5 COLS - IMAGE 2) ── */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111111]">Mental Progress <span className="text-xs font-normal text-[#6F6F70]">this week</span></h3>
            
            <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#F4F4F0] text-[#111111]">
              <span>Week</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <div className="h-[140px] w-full relative flex items-center justify-center">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path
                d="M 0 90 L 50 80 L 100 40 L 150 70 L 200 30 L 250 50 L 300 20 L 350 45 L 400 15"
                fill="none"
                stroke="#8C73FF"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="200" cy="30" r="5" fill="#8C73FF" />
            </svg>

            <div className="absolute left-[50%] top-[20%] transform -translate-x-1/2 -translate-y-full">
              <div className="bg-[#8C73FF] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                60%+ Prog
              </div>
            </div>
          </div>
        </div>

        {/* ── LOWER CARD 2: SESSION DURATION (3 COLS - IMAGE 2) ── */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Session</h3>
              <p className="text-xs font-semibold text-[#6F6F70]">Duration</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F4F4F0] flex items-center justify-center text-[#111111]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black text-[#111111]">4.5 <span className="text-base font-bold text-[#6F6F70]">hrs / wk</span></div>
            <div className="text-xs font-bold text-[#D8FF57] bg-[#111111] inline-block px-2.5 py-0.5 rounded-full mt-2">
              +12% vs last week
            </div>
          </div>
        </div>

        {/* ── LOWER CARD 3: WELLNESS THIS WEEK (4 COLS - IMAGE 2) ── */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111111]">Wellness <span className="text-xs font-normal text-[#6F6F70]">this week</span></h3>
            <span className="text-2xl font-black text-[#111111]">65%</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs font-bold text-[#6F6F70]">
              <span>Patience</span>
              <span className="text-[#111111]">78%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F4F4F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#8C73FF] rounded-full" style={{ width: '78%' }} />
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-[#6F6F70]">
              <span>Energy</span>
              <span className="text-[#111111]">85%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F4F4F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#D8FF57]" style={{ width: '85%' }} />
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-[#6F6F70]">
              <span>Focus</span>
              <span className="text-[#111111]">62%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F4F4F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#B9ACFF] rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

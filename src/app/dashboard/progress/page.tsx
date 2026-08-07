'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

/* ─── MULTI-SERIES CURVED CHART (Image 2 Top Left Panel with Image 1 Palette) ─── */
function MultiSeriesProgressChart() {
  const [activePoint, setActivePoint] = useState<number>(2);

  const width = 600;
  const height = 240;

  const series1 = [30, 45, 55, 60, 75, 80, 85];
  const series2 = [20, 35, 40, 48, 52, 58, 62];
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

  return (
    <div className="relative w-full">
      <div className="h-[260px] w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {[0, 20, 40, 60, 80, 100].map((val) => {
            const y = height - (val / 100) * (height - 40) - 20;
            return (
              <g key={val}>
                <line x1="30" y1={y} x2={width - 30} y2={y} stroke="#6E56CF" strokeWidth="1" strokeDasharray="3 3" opacity="0.12" />
                <text x="5" y={y + 4} fill="var(--text-secondary)" fontSize="10" fontWeight="bold">{val}</text>
              </g>
            );
          })}

          {ptActive1 && (
            <line
              x1={ptActive1.x}
              y1="20"
              x2={ptActive1.x}
              y2={height - 20}
              stroke="#6E56CF"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          <path d={getPath(points3)} fill="none" stroke="#DED8FF" strokeWidth="3" strokeLinecap="round" />
          <path d={getPath(points2)} fill="none" stroke="#B9ACFF" strokeWidth="3" strokeLinecap="round" />
          <path d={getPath(points1)} fill="none" stroke="#6E56CF" strokeWidth="3.5" strokeLinecap="round" />

          <circle cx={points1[points1.length - 1].x} cy={points1[points1.length - 1].y} r="5" fill="#6E56CF" />
          <circle cx={points2[points2.length - 1].x} cy={points2[points2.length - 1].y} r="5" fill="#B9ACFF" />
          <circle cx={points3[points3.length - 1].x} cy={points3[points3.length - 1].y} r="5" fill="#DED8FF" />
        </svg>

        <div className="absolute right-0 top-6 flex flex-col gap-3 pointer-events-none">
          <div className="glass-pill text-[#6E56CF] dark:text-[#8C73FF] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            Mood Balance
          </div>
          <div className="glass-pill text-[#6E56CF] dark:text-[#8C73FF] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            Stress Level
          </div>
          <div className="glass-pill text-[#6E56CF] dark:text-[#8C73FF] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
            Sleep Quality
          </div>
        </div>

        {ptActive1 && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300"
            style={{
              left: `${(ptActive1.x / width) * 100}%`,
              top: `${(ptActive1.y / height) * 100 - 12}%`,
            }}
          >
            <div className="bg-[#6E56CF] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl flex items-center gap-1">
              <span>80%+ Imp</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── STEPPED BAR CHART (Image 2 Top Right Panel "Health Progress") ─── */
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
              <div className="bg-[#6E56CF] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md animate-bounce">
                80%+ Imp
              </div>
            )}
            <div className="w-9 sm:w-11 glass-subcard rounded-2xl p-1 flex items-end h-[130px]">
              <div
                className={`w-full rounded-xl transition-all duration-500 ${
                  bar.active
                    ? 'bg-gradient-to-t from-[#6E56CF] to-[#B9ACFF] shadow-md'
                    : 'bg-gradient-to-t from-[#E8E3FF] to-[var(--bg-card-subtle)] group-hover:from-[#B9ACFF]'
                }`}
                style={{ height: `${bar.height}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${bar.active ? 'text-[#6E56CF] dark:text-[#8C73FF] font-black' : 'text-[var(--text-secondary)]'}`}>
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
    <div className="space-y-8 pb-12 font-sans selection:bg-[#E8E3FF] selection:text-[#6E56CF]">
      
      {/* ── PAGE HEADER (IMAGE 2 COMPOSITION) ── */}
      <div className="max-w-xl space-y-1">
        <h1 className="text-3xl sm:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight">
          Your <span className="font-extrabold">Personalized</span>
        </h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
          Progress and Insights
        </h2>
      </div>

      {/* ── TOP MAIN GLASS PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── TOP LEFT GLASS PANEL: MULTI-SERIES CHART (7 COLS) ── */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Clinical Metrics & Trends</h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">Real-time multi-series biometric correlation</p>
            </div>
          </div>

          <MultiSeriesProgressChart />
        </div>

        {/* ── TOP RIGHT GLASS PANEL: HEALTH PROGRESS STEPPED BARS (5 COLS) ── */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Health Progress</h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">This week</p>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold glass-pill text-[var(--text-primary)] hover:opacity-90 transition-all">
              <span>Week</span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            </button>
          </div>

          <SteppedHealthProgressChart />
        </div>

      </div>

      {/* ── LOWER ANALYTICS GLASS GRID (3-CARD COMPOSITION) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LOWER CARD 1: MENTAL PROGRESS THIS WEEK GLASS PANEL (5 COLS) ── */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Mental Progress <span className="text-xs font-normal text-[var(--text-secondary)]">this week</span></h3>
            
            <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold glass-pill text-[var(--text-primary)]">
              <span>Week</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          <div className="h-[140px] w-full relative flex items-center justify-center">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <path
                d="M 0 90 L 50 80 L 100 40 L 150 70 L 200 30 L 250 50 L 300 20 L 350 45 L 400 15"
                fill="none"
                stroke="#6E56CF"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="200" cy="30" r="5" fill="#6E56CF" />
            </svg>

            <div className="absolute left-[50%] top-[20%] transform -translate-x-1/2 -translate-y-full">
              <div className="bg-[#6E56CF] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                60%+ Prog
              </div>
            </div>
          </div>
        </div>

        {/* ── LOWER CARD 2: SESSION DURATION GLASS PANEL (3 COLS) ── */}
        <div className="lg:col-span-3 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Session</h3>
              <p className="text-xs font-semibold text-[var(--text-secondary)]">Duration</p>
            </div>
            <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center text-[#6E56CF] dark:text-[#8C73FF]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl font-black text-[var(--text-primary)]">4.5 <span className="text-base font-bold text-[var(--text-secondary)]">hrs / wk</span></div>
            <div className="text-xs font-bold text-[#6E56CF] dark:text-[#8C73FF] glass-pill inline-block px-2.5 py-0.5 rounded-full mt-2">
              +12% vs last week
            </div>
          </div>
        </div>

        {/* ── LOWER CARD 3: WELLNESS THIS WEEK GLASS PANEL (4 COLS) ── */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-primary)]">Wellness <span className="text-xs font-normal text-[var(--text-secondary)]">this week</span></h3>
            <span className="text-2xl font-black text-[var(--text-primary)]">65%</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs font-bold text-[var(--text-secondary)]">
              <span>Patience</span>
              <span className="text-[var(--text-primary)]">78%</span>
            </div>
            <div className="w-full h-2.5 glass-subcard rounded-full overflow-hidden">
              <div className="h-full bg-[#6E56CF] rounded-full" style={{ width: '78%' }} />
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-[var(--text-secondary)]">
              <span>Energy</span>
              <span className="text-[var(--text-primary)]">85%</span>
            </div>
            <div className="w-full h-2.5 glass-subcard rounded-full overflow-hidden">
              <div className="h-full bg-[#8C73FF] rounded-full" style={{ width: '85%' }} />
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-[var(--text-secondary)]">
              <span>Focus</span>
              <span className="text-[var(--text-primary)]">62%</span>
            </div>
            <div className="w-full h-2.5 glass-subcard rounded-full overflow-hidden">
              <div className="h-full bg-[#B9ACFF] rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

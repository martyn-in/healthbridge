'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  Compass,
  Box,
  Layers,
  Cpu,
  ShieldAlert,
  QrCode,
  Activity,
  Maximize2,
  Grid,
} from 'lucide-react';

export function MaxCommandPanelHeader({ onOpenHealthCard }: { onOpenHealthCard?: () => void }) {
  const [coords, setCoords] = useState({ x: 120, y: 450, z: 88 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        z: Math.round((e.clientX + e.clientY) / 3),
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0e1117]/95 backdrop-blur-xl border-b border-cyan-500/30 text-slate-100 shadow-2xl">
      {/* 3ds Max Viewport Top Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Brand Logo & Viewport Badge */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping glow-cyan" />
            <span className="font-bold text-cyan-400">3DS MAX VIEWPORT v2026</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">GRID: 10.0mm</span>
          </div>
        </div>

        {/* Real-time X/Y/Z Telemetry Cursor Readout */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Compass className="h-3.5 w-3.5 animate-spin-slow text-cyan-400" />
            <span>CAD TELEMETRY</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>
              X: <strong className="text-cyan-400">{coords.x}</strong>
            </span>
            <span>
              Y: <strong className="text-teal-400">{coords.y}</strong>
            </span>
            <span>
              Z: <strong className="text-emerald-400">{coords.z}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHealthCard}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-all glow-cyan"
          >
            <QrCode className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Health Card QR</span>
          </button>

          <Link
            href="/dashboard/symptoms"
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold shadow-lg glow-cyan flex items-center gap-1.5 transition-all"
          >
            <Activity className="h-4 w-4" />
            <span>3D Triage Studio</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import { Box, Layers, RotateCw, Activity, Cpu } from 'lucide-react';

interface Turnable3DCadCardProps {
  children: React.ReactNode;
  title?: string;
  viewportLabel?: string;
  cadSpecContent?: React.ReactNode;
  className?: string;
  depth?: number;
}

export function Turnable3DCadCard({
  children,
  title = 'CAD VIEWPORT NODE',
  viewportLabel = 'PERSPECTIVE [3DS MAX]',
  cadSpecContent,
  className = '',
  depth = 18,
}: Turnable3DCadCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="transition-transform duration-200 ease-out transform-style-3d relative w-full h-full"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
        }}
      >
        {/* Front Face: 3ds Max CAD Panel Container */}
        <div className="backface-hidden relative w-full h-full rounded-2xl cad-panel-bevel overflow-hidden text-slate-100 flex flex-col justify-between">
          {/* Top 3ds Max Viewport Header Toolbar */}
          <div className="cad-header-strip px-4 py-2.5 flex items-center justify-between text-xs font-mono select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
              <span className="font-bold text-cyan-400 tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5 text-cyan-400" />
                {viewportLabel}
              </span>
              <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">| {title}</span>
            </div>

            <div className="flex items-center gap-2">
              {cadSpecContent && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-[10px] font-bold font-mono transition-all flex items-center gap-1 glow-cyan"
                  title="Turn 3D Spec"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Turn 3D CAD Spec</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Card Content */}
          <div className="p-5 flex-1 relative">{children}</div>

          {/* Bottom 3ds Max Telemetry Footer */}
          <div className="bg-slate-950/80 px-4 py-1.5 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between select-none">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-cyan-500" /> GPU Mesh Accel: ON
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3 text-emerald-500" /> Render Layer #01
            </span>
          </div>
        </div>

        {/* Back Face: 3D CAD Wireframe Spec Flip Screen */}
        {cadSpecContent && (
          <div
            className="backface-hidden absolute inset-0 w-full h-full rounded-2xl bg-slate-950 border-2 border-cyan-500/80 p-6 flex flex-col justify-between text-slate-100 shadow-2xl overflow-hidden cad-viewport-grid"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/40 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold">
                  <Activity className="h-4 w-4 animate-spin-slow text-cyan-400" />
                  <span>3DS MAX CAD SPECIFICATION STACK</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-800">
                  WIREFRAME MESH
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-2">{cadSpecContent}</div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs rounded-xl self-start transition-all shadow-lg glow-cyan flex items-center gap-2"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Turn Front View ↺</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

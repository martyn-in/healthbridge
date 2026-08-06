'use client';

import React from 'react';
import { RotateCw, Eye, Box, Compass, Layers, RefreshCw } from 'lucide-react';

export type CameraPreset = 'iso' | 'front' | 'top' | 'side';

interface ViewportGizmoProps {
  currentPreset: CameraPreset;
  wireframe: boolean;
  autoRotate: boolean;
  onSetPreset: (preset: CameraPreset) => void;
  onToggleWireframe: () => void;
  onToggleAutoRotate: () => void;
  onReset: () => void;
}

export function ViewportGizmo({
  currentPreset,
  wireframe,
  autoRotate,
  onSetPreset,
  onToggleWireframe,
  onToggleAutoRotate,
  onReset,
}: ViewportGizmoProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* 3ds Max Style Viewport Panel */}
      <div className="bg-slate-900/90 dark:bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-xl text-slate-100 flex flex-col gap-2.5 min-w-[210px] border-t-teal-500/80 border-t-2">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-teal-400">
            <Compass className="h-4 w-4 animate-spin-slow text-teal-400" />
            <span>3D VIEWPORT GIZMO</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 font-bold border border-teal-800">
            3DS MAX MODE
          </span>
        </div>

        {/* View Camera Presets Grid */}
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => onSetPreset('iso')}
            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-all border ${
              currentPreset === 'iso'
                ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Isometric View (3D Perspective)"
          >
            ISO 3D
          </button>

          <button
            onClick={() => onSetPreset('front')}
            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-all border ${
              currentPreset === 'front'
                ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Front View"
          >
            FRONT
          </button>

          <button
            onClick={() => onSetPreset('top')}
            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-all border ${
              currentPreset === 'top'
                ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Top View"
          >
            TOP
          </button>

          <button
            onClick={() => onSetPreset('side')}
            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold font-mono transition-all border ${
              currentPreset === 'side'
                ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Side View"
          >
            SIDE
          </button>
        </div>

        {/* Viewport Toggles */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              autoRotate
                ? 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Turntable ON' : 'Turntable OFF'}</span>
          </button>

          <button
            onClick={onToggleWireframe}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              wireframe
                ? 'bg-cyan-600/90 border-cyan-400 text-white shadow-lg shadow-cyan-900/30'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{wireframe ? 'X-Ray Wire' : 'Shaded Model'}</span>
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <Box className="h-3 w-3 text-teal-400" /> Click & Drag to Orbit 3D Stage
          </span>
          <button
            onClick={onReset}
            className="hover:text-teal-300 flex items-center gap-1 transition-colors font-bold text-slate-300"
            title="Reset Viewport Camera"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

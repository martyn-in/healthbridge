'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CameraPreset } from './ViewportGizmo';
import { Stethoscope, Activity, ShieldAlert } from 'lucide-react';

const Medical3DScene = dynamic(
  () => import('./Medical3DScene').then((mod) => mod.Medical3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] rounded-2xl bg-slate-950 border border-cyan-500/40 flex flex-col items-center justify-center gap-3 text-cyan-400 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span>LOADING ANATOMICAL 3D CAD MESH...</span>
      </div>
    ),
  }
);

export function SymptomTriage3DViewport() {
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso');
  const [wireframe, setWireframe] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState('Thoracic / Cardiac Node');

  return (
    <div className="space-y-4">
      {/* Viewport Top Bar */}
      <div className="flex items-center justify-between text-xs font-mono bg-slate-900/90 p-3 rounded-xl border border-cyan-500/30">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-cyan-300">ANATOMICAL 3D CAD TRIAGE VIEWPORT</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
              wireframe
                ? 'bg-cyan-600 text-slate-950 border-cyan-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {wireframe ? 'X-Ray Mesh' : 'Shaded'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Medical3DScene cameraPreset={cameraPreset} wireframe={wireframe} autoRotate={true} />

      {/* Selected Node Status Readout */}
      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono flex items-center justify-between">
        <span className="text-slate-400">ACTIVE CAD NODE:</span>
        <span className="font-bold text-cyan-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
          {selectedOrgan}
        </span>
      </div>
    </div>
  );
}

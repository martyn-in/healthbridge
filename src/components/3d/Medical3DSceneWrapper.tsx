'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { CameraPreset } from './ViewportGizmo';

const Medical3DScene = dynamic(
  () => import('./Medical3DScene').then((mod) => mod.Medical3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] sm:h-[620px] rounded-3xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <span>INITIALIZING 3D WEBGL ENGINE & SHADERS...</span>
      </div>
    ),
  }
);

interface Medical3DSceneWrapperProps {
  cameraPreset: CameraPreset;
  wireframe: boolean;
  autoRotate: boolean;
}

export function Medical3DSceneWrapper(props: Medical3DSceneWrapperProps) {
  return <Medical3DScene {...props} />;
}

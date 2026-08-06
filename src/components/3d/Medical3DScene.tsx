'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { AnatomicalModel3D } from './AnatomicalModel3D';
import { BackgroundParticleGrid } from './BackgroundParticleGrid';
import { PostProcessingEffects } from './PostProcessingEffects';
import { CameraPreset } from './ViewportGizmo';

interface Medical3DSceneProps {
  cameraPreset: CameraPreset;
  wireframe: boolean;
  autoRotate: boolean;
}

const PRESET_POSITIONS: Record<CameraPreset, [number, number, number]> = {
  iso: [3.5, 2.5, 4.5],
  front: [0, 0.8, 5.2],
  top: [0, 6.0, 0.1],
  side: [5.2, 0.8, 0],
};

function CameraController({ preset }: { preset: CameraPreset }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current) {
      const targetPos = PRESET_POSITIONS[preset];
      controlsRef.current.object.position.set(...targetPos);
      controlsRef.current.target.set(0, 0.5, 0);
      controlsRef.current.update();
    }
  }, [preset]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      minDistance={2}
      maxDistance={10}
      target={[0, 0.5, 0]}
    />
  );
}

export function Medical3DScene({ cameraPreset, wireframe, autoRotate }: Medical3DSceneProps) {
  return (
    <div className="w-full h-[520px] sm:h-[620px] relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Canvas gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#020617']} />
        <PerspectiveCamera makeDefault position={PRESET_POSITIONS[cameraPreset]} fov={45} />

        {/* Ambient & Directional Dynamic Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#38bdf8" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#0d9488" />
        <pointLight position={[0, 3, 2]} intensity={2.0} color="#2dd4bf" distance={6} />

        {/* 3D Scene Components */}
        <BackgroundParticleGrid wireframe={wireframe} />
        <AnatomicalModel3D wireframe={wireframe} autoRotate={autoRotate} />

        {/* Postprocessing Shaders */}
        <PostProcessingEffects />

        {/* Camera Orbit Controls */}
        <CameraController preset={cameraPreset} />
      </Canvas>

      {/* Floating Viewport Status Banner */}
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3.5 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>3D WebGL Realtime Viewport • Drag to Orbit 360°</span>
      </div>
    </div>
  );
}

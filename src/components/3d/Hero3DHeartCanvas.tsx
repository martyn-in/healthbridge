'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── ANATOMICAL HERO 3D HEART MESH COMPONENT ───
function Anatomical3DHeart({ isHovered }: { isHovered: boolean }) {
  const heartGroupRef = useRef<THREE.Group>(null);
  const leftVentricleRef = useRef<THREE.Mesh>(null);
  const rightVentricleRef = useRef<THREE.Mesh>(null);
  const aortaRef = useRef<THREE.Mesh>(null);
  const pulseCoreRef = useRef<THREE.Mesh>(null);
  const particleRingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const clock = state.clock;
    const time = clock.getElapsedTime();

    // 1. Slow, elegant auto-rotation
    if (heartGroupRef.current) {
      heartGroupRef.current.rotation.y = Math.sin(time * 0.4) * 0.25;
      heartGroupRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
    }

    // 2. Realistic Cardiac Pulse Rhythm (~72 BPM double-beat pulse)
    const pulseFactor = Math.pow(Math.sin(time * 7.5), 8) * 0.06 + Math.pow(Math.sin(time * 7.5 - 0.3), 8) * 0.03;
    const currentScale = (isHovered ? 1.12 : 1.0) + pulseFactor;

    if (heartGroupRef.current) {
      heartGroupRef.current.scale.set(currentScale, currentScale, currentScale);
    }

    if (pulseCoreRef.current) {
      const coreMat = pulseCoreRef.current.material as THREE.MeshBasicMaterial;
      if (coreMat) {
        coreMat.opacity = 0.5 + pulseFactor * 4;
      }
    }

    if (particleRingRef.current) {
      particleRingRef.current.rotation.z = time * 0.5;
    }
  });

  return (
    <group ref={heartGroupRef}>
      {/* ── CENTRAL GLOWING SINUS NODE CORE ── */}
      <mesh ref={pulseCoreRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.6} />
      </mesh>

      {/* ── LEFT VENTRICLE & APEX (Deep Crimson / Violet Refractive Body) ── */}
      <mesh ref={leftVentricleRef} position={[-0.2, -0.3, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshPhysicalMaterial
          color="#4F46E5"
          emissive="#312E81"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.7}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* ── RIGHT VENTRICLE & ATRIUM (Electric Blue & Magenta Accent) ── */}
      <mesh ref={rightVentricleRef} position={[0.45, 0.1, 0.1]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial
          color="#818CF8"
          emissive="#4338CA"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.9}
        />
      </mesh>

      {/* ── ASCENDING AORTA ARCH (Curved Vascular Structure) ── */}
      <mesh ref={aortaRef} position={[0.1, 1.1, -0.1]} rotation={[0.2, 0, 0.3]}>
        <torusGeometry args={[0.55, 0.24, 16, 32, Math.PI * 1.2]} />
        <meshStandardMaterial
          color="#F43F5E"
          emissive="#BE123C"
          emissiveIntensity={0.7}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* ── PULMONARY ARTERY BRANCHES ── */}
      <mesh position={[-0.45, 0.8, 0.2]} rotation={[0.4, 0.2, -0.5]}>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 16]} />
        <meshStandardMaterial color="#6366F1" emissive="#3730A3" emissiveIntensity={0.5} />
      </mesh>

      {/* ── CORONARY ARTERY NETWORK NODES ── */}
      <group>
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const r = 1.05;
          const x = Math.cos(angle) * r * 0.7;
          const y = Math.sin(angle) * r * 0.9 - 0.2;
          const z = Math.sin(angle * 2) * 0.4 + 0.5;

          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#38BDF8' : '#F43F5E'} />
            </mesh>
          );
        })}
      </group>

      {/* ── VOLUMETRIC CARDIAC PARTICLE ORBIT ── */}
      <group ref={particleRingRef} position={[0, 0.1, 0]}>
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const radius = 1.8;
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          return (
            <mesh key={i} position={[px, py, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color={i % 3 === 0 ? '#F43F5E' : '#818CF8'} transparent opacity={0.7} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function Hero3DHeartCanvas() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseRef.current = { x, y };
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className="w-full h-full min-h-[260px] sm:min-h-[320px] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5.2], fov: 45 }}
      >
        {/* Dynamic Multi-Color Rim Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={2.2} color="#38BDF8" />
        <directionalLight position={[-5, -6, -3]} intensity={1.8} color="#F43F5E" />
        <pointLight position={[0, 2, 4]} intensity={2.5} color="#818CF8" distance={8} />

        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.5}>
          <Anatomical3DHeart isHovered={isHovered} />
        </Float>
      </Canvas>

      {/* Floating Spatial Vital Telemetry Badge */}
      <div className="absolute bottom-3 right-3 pointer-events-none px-3 py-1.5 rounded-xl glass-subcard border border-white/10 flex items-center gap-2 text-[11px] font-mono tracking-tight text-[var(--text-primary)] shadow-lg">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
        <span className="font-semibold text-rose-400 tabular-nums">78 BPM</span>
        <span className="text-[var(--text-muted)]">| Sinus Rhythm</span>
      </div>
    </div>
  );
}

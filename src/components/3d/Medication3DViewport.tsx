'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function FloatingPillModel() {
  const groupRef = useRef<THREE.Group>(null);
  const pillRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (pillRef.current) {
      pillRef.current.rotation.y += delta * 0.8;
      pillRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        {/* 3D Pill Capsule */}
        <group ref={pillRef} position={[0, 0, 0]}>
          {/* Top Half of Capsule */}
          <mesh position={[0, 0.45, 0]}>
            <capsuleGeometry args={[0.35, 0.45, 16, 32]} />
            <meshStandardMaterial color="#00f2fe" roughness={0.2} metalness={0.8} emissive="#00f2fe" emissiveIntensity={0.3} />
          </mesh>
          {/* Bottom Half of Capsule */}
          <mesh position={[0, -0.45, 0]}>
            <capsuleGeometry args={[0.35, 0.45, 16, 32]} />
            <meshStandardMaterial color="#0d9488" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>

        {/* Adherence Gauge 3D Ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.2, 0.03, 16, 64]} />
          <meshStandardMaterial color="#38bdf8" wireframe emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

export function Medication3DViewport() {
  return (
    <div className="w-full h-[260px] relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00f2fe" />
        <pointLight position={[-5, -5, -5]} intensity={1.0} color="#0d9488" />

        <FloatingPillModel />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>

      <div className="absolute top-3 left-3 bg-slate-900/90 px-3 py-1 rounded-lg border border-cyan-500/40 text-[10px] font-mono text-cyan-400 font-bold">
        3D DRUG DISPENSER CAD STAGE • 360° TURNTABLE
      </div>
    </div>
  );
}

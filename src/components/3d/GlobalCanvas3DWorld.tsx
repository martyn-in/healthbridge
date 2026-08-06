'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function CadGridFloor() {
  return (
    <group position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[60, 60, '#00f2fe', '#1e293b']} />
    </group>
  );
}

function FloatingCadGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.2;
      ring1Ref.current.rotation.y += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background Floating 3D Geometric CAD Shapes */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={ring1Ref} position={[-6, 2, -5]}>
          <torusGeometry args={[1.5, 0.04, 16, 64]} />
          <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.3} />
        </mesh>

        <mesh ref={ring2Ref} position={[7, -1, -6]}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshBasicMaterial color="#0d9488" wireframe transparent opacity={0.25} />
        </mesh>

        <mesh position={[0, 4, -8]}>
          <octahedronGeometry args={[2.5, 2]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

export function GlobalCanvas3DWorld() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
      <Canvas gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#07090e']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} color="#00f2fe" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#0d9488" />

        <CadGridFloor />
        <FloatingCadGeometry />
      </Canvas>
    </div>
  );
}

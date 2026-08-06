'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function BackgroundParticleGrid({ wireframe = false }: { wireframe?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const meshGroupRef = useRef<THREE.Group>(null);

  const count = 1200;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color('#0d9488'); // Teal
    const color2 = new THREE.Color('#38bdf8'); // Cyan/Sky
    const color3 = new THREE.Color('#6366f1'); // Indigo

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 3.5 + Math.random() * 2.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const mixedColor = color1.clone();
      if (i % 3 === 0) mixedColor.lerp(color2, Math.random());
      else if (i % 3 === 1) mixedColor.lerp(color3, Math.random());

      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x += delta * 0.03;
    }
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <group ref={meshGroupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {wireframe && (
        <mesh>
          <sphereGeometry args={[4.2, 24, 24]} />
          <meshBasicMaterial wireframe color="#0d9488" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}

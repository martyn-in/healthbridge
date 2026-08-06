'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

interface AnatomicalNode {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  status: string;
  metrics: string;
}

const NODES: AnatomicalNode[] = [
  {
    id: 'brain',
    name: 'Neural Cortex Matrix',
    category: 'Cognitive & CNS',
    position: [0, 1.6, 0],
    status: 'Optimal Synapse Activity',
    metrics: 'EEG Delta Sync 98.4%',
  },
  {
    id: 'heart',
    name: 'Cardiac Thoracic Node',
    category: 'Cardiovascular System',
    position: [0, 0.7, 0.45],
    status: 'Sinus Rhythm 72 BPM',
    metrics: 'BP 118/76 • SpO2 99%',
  },
  {
    id: 'lungs',
    name: 'Pulmonary Respiration',
    category: 'Respiratory Track',
    position: [-0.5, 0.7, 0.2],
    status: 'Clear Airway Capacity',
    metrics: 'Tidal Vol 500 mL',
  },
  {
    id: 'liver',
    name: 'Metabolic Hepatic System',
    category: 'Internal Biochemistry',
    position: [0.45, 0.1, 0.3],
    status: 'ALT / AST Normal Range',
    metrics: 'Bilirubin 0.8 mg/dL',
  },
  {
    id: 'spine',
    name: 'Central Vertebral Pillar',
    category: 'Musculoskeletal Integrity',
    position: [0, 0.2, -0.4],
    status: 'Lumbar Alignment Grade A',
    metrics: 'Flexibility Score 94%',
  },
];

export function AnatomicalModel3D({
  wireframe = false,
  autoRotate = true,
  onSelectNode,
}: {
  wireframe?: boolean;
  autoRotate?: boolean;
  onSelectNode?: (node: AnatomicalNode) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const dnaGroupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<AnatomicalNode | null>(NODES[1]);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.4;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.6;
      coreRef.current.rotation.x += delta * 0.2;
    }
    if (dnaGroupRef.current) {
      dnaGroupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Holographic Core Matrix */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
        {/* Outer Torso Silhouette Shield */}
        <mesh position={[0, 0.4, 0]}>
          <capsuleGeometry args={[0.75, 1.8, 16, 32]} />
          <meshStandardMaterial
            color="#0f766e"
            wireframe={wireframe}
            transparent
            opacity={wireframe ? 0.35 : 0.18}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Inner Glowing Core Organ Sphere */}
        <mesh ref={coreRef} position={[0, 0.7, 0]}>
          <octahedronGeometry args={[0.38, 2]} />
          <meshStandardMaterial
            color="#2dd4bf"
            wireframe={wireframe}
            emissive="#14b8a6"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Double Helix DNA Ring representation around torso */}
        <group ref={dnaGroupRef} position={[0, 0.4, 0]}>
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 4;
            const y = (i / 24) * 2.2 - 1.1;
            const radius = 1.0;
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            return (
              <group key={i}>
                <mesh position={[x1, y, z1]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial color={i % 2 === 0 ? '#38bdf8' : '#2dd4bf'} />
                </mesh>
                <mesh position={[x2, y, z2]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial color={i % 2 === 0 ? '#818cf8' : '#0d9488'} />
                </mesh>
              </group>
            );
          })}
        </group>

        {/* Anatomical Nodes & Interactive Hotspots */}
        {NODES.map((node) => {
          const isSelected = activeNode?.id === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <group key={node.id} position={node.position}>
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNode(node);
                  onSelectNode?.(node);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredNode(node.id);
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  setHoveredNode(null);
                  document.body.style.cursor = 'auto';
                }}
              >
                <sphereGeometry args={[isSelected ? 0.12 : 0.08, 16, 16]} />
                <meshStandardMaterial
                  color={isSelected ? '#06b6d4' : isHovered ? '#38bdf8' : '#0d9488'}
                  emissive={isSelected ? '#0891b2' : '#0d9488'}
                  emissiveIntensity={isSelected ? 1.5 : 0.5}
                />
              </mesh>

              {/* Pulsing Outer Ring */}
              <mesh>
                <ringGeometry args={[0.13, 0.16, 32]} />
                <meshBasicMaterial
                  color={isSelected ? '#22d3ee' : '#14b8a6'}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={isSelected || isHovered ? 0.9 : 0.4}
                />
              </mesh>

              {/* 3D Floating HTML Label Callout */}
              {(isSelected || isHovered) && (
                <Html distanceFactor={8} position={[0.2, 0.1, 0]}>
                  <div className="bg-slate-900/90 border border-teal-500/50 backdrop-blur-md px-3 py-2 rounded-xl text-white shadow-2xl min-w-[180px] pointer-events-none transform -translate-y-2 transition-all">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                      {node.category}
                    </div>
                    <div className="text-xs font-extrabold text-white leading-tight">
                      {node.name}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {node.status}
                    </div>
                    <div className="text-[10px] text-teal-300 font-mono mt-0.5 border-t border-slate-800 pt-1">
                      {node.metrics}
                    </div>
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </Float>
    </group>
  );
}

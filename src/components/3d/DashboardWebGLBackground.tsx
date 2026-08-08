'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function DashboardWebGLBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. Ambient & Volumetric Light Nodes
    const pointLight1 = new THREE.PointLight(0x6366f1, 3, 50); // Electric Indigo
    pointLight1.position.set(10, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xec4899, 2.5, 50); // Pink/Magenta rim
    pointLight2.position.set(-15, -10, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x06b6d4, 2, 40); // Cyan light field
    pointLight3.position.set(0, 5, 15);
    scene.add(pointLight3);

    // 3. Volumetric Particle System
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      scales[i] = Math.random() * 0.25 + 0.05;
      speeds[i] = Math.random() * 0.015 + 0.005;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(129, 140, 248, 0.6)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 4. Subtle Wireframe Geometry Floating Grid Layer
    const gridGeo = new THREE.IcosahedronGeometry(25, 2);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.position.z = -15;
    scene.add(gridMesh);

    // 5. Pointer Event Tracker
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePos.current.targetX = x;
      mousePos.current.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 6. Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with Performance Throttling
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse movement
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Rotate grid mesh slowly
      gridMesh.rotation.x = elapsedTime * 0.03 + mousePos.current.y * 0.2;
      gridMesh.rotation.y = elapsedTime * 0.05 + mousePos.current.x * 0.2;

      // Animate particles
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += speeds[i];
        if (posArray[i * 3 + 1] > 20) {
          posArray[i * 3 + 1] = -20;
        }
      }
      posAttr.needsUpdate = true;

      // Move lights with pointer
      pointLight1.position.x = 10 + mousePos.current.x * 8;
      pointLight1.position.y = 15 - mousePos.current.y * 8;
      pointLight2.position.x = -15 - mousePos.current.x * 6;
      pointLight2.position.y = -10 + mousePos.current.y * 6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

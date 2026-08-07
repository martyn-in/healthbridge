'use client';

import React, { useRef, useState, useEffect } from 'react';

interface Spatial3DDashboardProps {
  children: React.ReactNode;
}

export function Spatial3DDashboard({ children }: Spatial3DDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animFrame: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize mouse offsets (-1 to 1)
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Controlled rotational angles (Max ±2.5° for high readability)
      targetY = normX * 2.5;
      targetX = -normY * 2.5;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const updateFrame = () => {
      // Smooth lerp easing
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      setRotation({ rotateX: currentX, rotateY: currentY });
      animFrame = requestAnimationFrame(updateFrame);
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseenter', handleMouseEnter);
      animFrame = requestAnimationFrame(updateFrame);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative transition-perspective duration-300"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-full transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${rotation.rotateX.toFixed(2)}deg) rotateY(${rotation.rotateY.toFixed(2)}deg)`,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}

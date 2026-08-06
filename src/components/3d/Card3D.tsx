'use client';

import React, { useState, useRef } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  backContent?: React.ReactNode;
  className?: string;
  depth?: number;
}

export function Card3D({ children, backContent, className = '', depth = 20 }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="transition-transform duration-200 ease-out transform-style-3d relative w-full h-full"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg)`,
        }}
      >
        {/* Front Face */}
        <div className="backface-hidden relative w-full h-full">
          {children}
          {backContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-md border border-teal-500/30 transition-all flex items-center gap-1 z-20"
            >
              <span>Turn 3D Spec</span> ↻
            </button>
          )}
        </div>

        {/* Back Face (Turned Card Spec) */}
        {backContent && (
          <div
            className="backface-hidden absolute inset-0 w-full h-full bg-slate-900 text-white rounded-xl border border-teal-500/50 p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div>{backContent}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="mt-4 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-xs rounded-lg self-start transition-all"
            >
              Turn Front ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

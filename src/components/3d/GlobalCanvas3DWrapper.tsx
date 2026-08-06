'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const GlobalCanvas3DWorld = dynamic(
  () => import('./GlobalCanvas3DWorld').then((mod) => mod.GlobalCanvas3DWorld),
  { ssr: false }
);

export function GlobalCanvas3DWrapper() {
  return <GlobalCanvas3DWorld />;
}

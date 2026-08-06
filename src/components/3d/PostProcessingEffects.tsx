'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function PostProcessingEffects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.SCREEN}
      />
      <Vignette eskil={false} offset={0.1} darkness={0.6} />
      <Noise opacity={0.025} />
    </EffectComposer>
  );
}

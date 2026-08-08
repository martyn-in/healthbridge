export interface DeviceCapability {
  hasWebGpu: boolean;
  hasWasm: boolean;
  deviceMemoryGb: number;
  hardwareConcurrency: number;
  supportsLocalLlm: boolean;
  recommendedMode: 'RETRIEVAL_ONLY' | 'RETRIEVAL_PLUS_LOCAL_LLM';
}

/**
 * Detects browser hardware capabilities (WebGPU, WASM, RAM, CPU threads)
 */
export async function detectBrowserCapabilities(): Promise<DeviceCapability> {
  if (typeof window === 'undefined') {
    return {
      hasWebGpu: false,
      hasWasm: false,
      deviceMemoryGb: 4,
      hardwareConcurrency: 4,
      supportsLocalLlm: false,
      recommendedMode: 'RETRIEVAL_ONLY',
    };
  }

  // 1. WebGPU Detection
  let hasWebGpu = false;
  try {
    if ('gpu' in navigator && (navigator as any).gpu) {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter) hasWebGpu = true;
    }
  } catch (e) {
    hasWebGpu = false;
  }

  // 2. WebAssembly Detection
  const hasWasm = typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';

  // 3. Memory & Threads
  const deviceMemoryGb = (navigator as any).deviceMemory || 4;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // Local browser LLM is optional and recommended only when WebGPU + >= 6GB RAM + WebAssembly exist
  const supportsLocalLlm = hasWebGpu && hasWasm && deviceMemoryGb >= 6;

  return {
    hasWebGpu,
    hasWasm,
    deviceMemoryGb,
    hardwareConcurrency,
    supportsLocalLlm,
    recommendedMode: supportsLocalLlm ? 'RETRIEVAL_PLUS_LOCAL_LLM' : 'RETRIEVAL_ONLY',
  };
}

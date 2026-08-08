import { GoogleGenAI } from '@google/genai';

if (typeof window !== 'undefined') {
  throw new Error('src/lib/ai/gemini.ts must only be imported in server-side modules.');
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[HealthBridge Gemini AI]: WARNING - GEMINI_API_KEY environment variable is missing.');
}

export const gemini = new GoogleGenAI({
  apiKey: apiKey || '',
});

/**
 * Returns the configured Gemini model name from environment variables.
 * Defaults to 'gemini-2.5-flash' if GEMINI_MODEL is not explicitly set or invalid.
 */
export function getGeminiModel(): string {
  const model = process.env.GEMINI_MODEL?.trim();
  if (!model) {
    return 'gemini-3.6-flash';
  }
  return model;
}

/**
 * Validates whether the Gemini API key is configured.
 */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

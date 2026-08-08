import { GoogleGenAI } from '@google/genai';

if (typeof window !== 'undefined') {
  throw new Error('src/lib/ai/gemini.ts must only be imported in server-side modules.');
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not configured');
}

export const gemini = new GoogleGenAI({
  apiKey,
});

export function getGeminiModel(): string {
  const model = process.env.GEMINI_MODEL?.trim();
  if (!model) {
    return 'gemini-3.6-flash';
  }
  return model;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
}

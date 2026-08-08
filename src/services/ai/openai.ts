import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('[HealthBridge AI Server]: OPENAI_API_KEY environment variable is not defined.');
}

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-build-key-for-nextjs-compilation',
});

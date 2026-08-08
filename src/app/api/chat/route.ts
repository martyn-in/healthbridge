import { NextResponse } from 'next/server';
import { gemini, getGeminiModel } from '@/lib/ai/gemini';
import { checkDeterministicEmergency } from '@/services/ai/safety';

const SYSTEM_INSTRUCTION =
  'You are HealthBridge AI, a healthcare information assistant. ' +
  'Provide concise educational health information. ' +
  'Do not make definitive diagnoses or replace medical professionals. ' +
  'For emergencies, prioritize immediate professional help and the HealthBridge SOS workflow. ' +
  'Absolutely DO NOT use emojis in your response.';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload.' },
        { status: 400 }
      );
    }

    const message = body.message || body.query;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message field is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message length exceeds maximum limit of 2000 characters.' },
        { status: 400 }
      );
    }

    // 1. Deterministic Emergency Safety Check BEFORE AI
    const emergencyResponse = checkDeterministicEmergency(message);
    if (emergencyResponse) {
      return NextResponse.json({
        success: true,
        message: emergencyResponse.answer,
        answer: emergencyResponse.answer,
        urgency: emergencyResponse.urgency || 'emergency',
        suggestedActions: emergencyResponse.suggestedActions || [],
        route: emergencyResponse.route || null,
        emergency: true,
      });
    }

    const modelName = getGeminiModel();

    // 2. Multi-turn context handling if history is passed
    const rawHistory = Array.isArray(body.conversationHistory)
      ? body.conversationHistory
      : Array.isArray(body.history)
      ? body.history
      : [];

    let contents: any;

    if (rawHistory.length > 0) {
      const historyItems: any[] = [];
      const sliced = rawHistory.slice(-10);

      for (const item of sliced) {
        const text = typeof item.text === 'string' ? item.text : typeof item.content === 'string' ? item.content : '';
        if (!text) continue;
        const role = (item.sender === 'user' || item.role === 'user') ? 'user' : 'model';
        historyItems.push({
          role,
          parts: [{ text }],
        });
      }

      historyItems.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });

      contents = historyItems;
    } else {
      contents = message.trim();
    }

    // 3. Request Timeout (15 Seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let geminiResult;
    try {
      geminiResult = await gemini.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
          maxOutputTokens: 800,
          abortSignal: controller.signal,
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const rawText = geminiResult.text || 'I am unable to process your request at this time.';
    const cleanText = rawText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    return NextResponse.json({
      success: true,
      message: cleanText,
      answer: cleanText,
      urgency: 'routine',
      suggestedActions: [],
      route: null,
      emergency: false,
    });
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown server error';
    console.error(`[HealthBridge AI Server Failure] provider: Gemini, model: ${process.env.GEMINI_MODEL || 'gemini-3.6-flash'}, error: ${errorMsg}`);

    return NextResponse.json(
      {
        success: false,
        error: 'HealthBridge AI is temporarily unavailable. Please try again.',
        message: 'HealthBridge AI is temporarily unavailable. Please try again.',
        answer: 'HealthBridge AI is temporarily unavailable. Please try again.',
      },
      { status: 500 }
    );
  }
}

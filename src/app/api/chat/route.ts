import { NextResponse } from 'next/server';
import { gemini, getGeminiModel, isGeminiConfigured } from '@/lib/ai/gemini';
import { checkDeterministicEmergency } from '@/services/ai/safety';
import { retrieveRelevantContext } from '@/services/ai/context';

const SYSTEM_INSTRUCTION = `You are HealthBridge AI, a healthcare information assistant.

CORE GUIDELINES:
- Provide concise, accurate, and understandable healthcare information.
- Help users understand medical terminology, health concepts, lab reports, and medication details.
- NEVER claim to replace doctors or healthcare providers.
- NEVER make definitive medical diagnoses.
- NEVER invent patient medical records or medication doses.
- For possible emergencies, advise immediate professional assistance and allow the HealthBridge emergency system to handle the emergency workflow.
- Maintain a warm, empathetic, professional tone.
- Absolutely DO NOT use emojis anywhere in your responses.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload format.' },
        { status: 400 }
      );
    }

    const message = body.message || body.query;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message is required and cannot be empty.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, message: 'Message exceeds maximum length of 2000 characters.' },
        { status: 400 }
      );
    }

    const conversationHistory = Array.isArray(body.conversationHistory)
      ? body.conversationHistory
      : Array.isArray(body.history)
      ? body.history
      : [];

    if (conversationHistory.length > 20) {
      return NextResponse.json(
        { success: false, message: 'Conversation history exceeds maximum turn limit of 20.' },
        { status: 400 }
      );
    }

    const patientProfileId = typeof body.patientProfileId === 'string' ? body.patientProfileId : undefined;

    // 1. Deterministic Emergency Safety Gate BEFORE AI
    const emergencyResponse = checkDeterministicEmergency(message);
    if (emergencyResponse) {
      return NextResponse.json({
        success: true,
        answer: emergencyResponse.answer,
        message: emergencyResponse.answer,
        urgency: emergencyResponse.urgency || 'emergency',
        suggestedActions: emergencyResponse.suggestedActions || [],
        route: emergencyResponse.route || null,
        emergency: true,
      });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          success: false,
          answer: 'AI assistant is temporarily unavailable. Please try again.',
          message: 'AI assistant is temporarily unavailable. Please try again.',
          urgency: 'routine',
          suggestedActions: [],
          route: null,
          emergency: false,
        },
        { status: 503 }
      );
    }

    // 2. Patient Context Retrieval
    const relevantContext = retrieveRelevantContext(message, patientProfileId);
    const systemPrompt = `${SYSTEM_INSTRUCTION}

CURRENT AUTHENTICATED PATIENT CONTEXT:
${JSON.stringify(relevantContext, null, 2)}`;

    // 3. Construct Gemini Contents Array with Multi-Turn Conversation Memory
    const contents: any[] = [];
    const slicedHistory = conversationHistory.slice(-10);

    for (const msg of slicedHistory) {
      const text = typeof msg.text === 'string' ? msg.text : typeof msg.content === 'string' ? msg.content : '';
      if (!text) continue;
      const role = (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model';
      contents.push({
        role,
        parts: [{ text }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const modelName = getGeminiModel();

    // 4. Request Timeout (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let geminiResponse;
    try {
      geminiResponse = await gemini.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3,
          maxOutputTokens: 800,
          abortSignal: controller.signal,
        },
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const rawText = geminiResponse.text || 'I am unable to provide a response at this time.';
    const cleanText = rawText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    // 5. Determine Navigation Suggestions
    const lowerMessage = message.toLowerCase();
    const suggestedActions = [];
    if (lowerMessage.includes('report') || lowerMessage.includes('lab') || lowerMessage.includes('ldl')) {
      suggestedActions.push({ label: 'Open Latest Report', actionPath: '/dashboard/reports' });
    }
    if (lowerMessage.includes('medication') || lowerMessage.includes('dose') || lowerMessage.includes('pill') || lowerMessage.includes('schedule')) {
      suggestedActions.push({ label: 'View Medication Schedule', actionPath: '/dashboard/medications' });
    }
    if (lowerMessage.includes('doctor') || lowerMessage.includes('appointment')) {
      suggestedActions.push({ label: 'Book Appointment', actionPath: '/dashboard/appointments' });
    }

    return NextResponse.json({
      success: true,
      message: cleanText,
      answer: cleanText,
      urgency: 'routine',
      suggestedActions,
      route: suggestedActions[0]?.actionPath || null,
      emergency: false,
    });
  } catch (err: any) {
    console.error('[HealthBridge Chat API Error]:', err?.message || err);
    return NextResponse.json(
      {
        success: false,
        answer: 'AI assistant is temporarily unavailable. Please try again.',
        message: 'AI assistant is temporarily unavailable. Please try again.',
        urgency: 'routine',
        suggestedActions: [],
        route: null,
        emergency: false,
      },
      { status: 500 }
    );
  }
}

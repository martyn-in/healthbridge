import { NextResponse } from 'next/server';
import { gemini, getGeminiModel, isGeminiConfigured } from '@/lib/ai/gemini';
import { evaluateSafetyEscalation } from '@/lib/localSafetyRouter';
import { EmergencyAssistResponseSchema } from '@/lib/validation';

const EMERGENCY_SYSTEM_PROMPT = `You are HealthBridge Emergency Guidance Assistant.

STRICT EMERGENCY RULES:
1. Use ONLY the retrieved approved medical evidence (WHO / MoHFW corpus) for medical instructions.
2. Do NOT invent treatments, medication doses, antidotes, diagnoses, procedures, or home remedies.
3. If the retrieved material does not support an instruction, do NOT provide it.
4. If evidence is insufficient or missing, state clearly that reliable guidance could not be retrieved.
5. Never recommend delaying emergency transport or medical evaluation.
6. Keep instructions brief, unambiguous, and immediately actionable.

You MUST respond strictly in valid JSON format adhering to this structure:
{
  "emergencyType": "snakebite | trauma | burn | poisoning | stroke | cardiac | general_emergency",
  "urgency": "emergency",
  "headline": "Short primary directive",
  "immediateActions": ["Action step 1", "Action step 2", "Action step 3"],
  "avoid": ["Dangerous practice 1 to avoid", "Dangerous practice 2 to avoid"],
  "warningSigns": ["Critical warning sign 1", "Critical warning sign 2"],
  "requiresEmergencyCare": true,
  "sources": [
    { "title": "WHO Guidelines for Snakebite Management", "url": "https://www.who.int" }
  ]
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body.',
          guidance: null,
        },
        { status: 400 }
      );
    }

    const query = typeof body.query === 'string' ? body.query.trim() : typeof body.message === 'string' ? body.message.trim() : '';

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Emergency query ("What happened?") is required.',
          guidance: null,
        },
        { status: 400 }
      );
    }

    if (query.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query length exceeds 1000 characters limit.',
          guidance: null,
        },
        { status: 400 }
      );
    }

    // 1. Immediate Safety Router Evaluation (Instant Red Flags)
    const safetyEscalation = evaluateSafetyEscalation(query);

    // 2. Check Gemini & File Search Store Configuration
    const fileSearchStore = process.env.GEMINI_FILE_SEARCH_STORE?.trim();
    const isAiAvailable = isGeminiConfigured();

    if (!isAiAvailable || !fileSearchStore) {
      return NextResponse.json({
        success: false,
        error: 'Emergency guidance is temporarily unavailable. Contact emergency medical services immediately.',
        guidance: null,
        safetyEscalation,
        diagnostic: process.env.NODE_ENV === 'development' ? {
          ragEnabled: false,
          reason: !isAiAvailable ? 'GEMINI_API_KEY missing' : 'GEMINI_FILE_SEARCH_STORE missing',
        } : undefined,
      });
    }

    const modelName = getGeminiModel();

    // 3. Call Gemini with File Search RAG Tool & Grounded System Instruction
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let geminiResult;
    try {
      geminiResult = await gemini.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [{ text: `EMERGENCY QUERY FROM PATIENT: "${query}"` }],
          },
        ],
        config: {
          systemInstruction: EMERGENCY_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 1000,
          abortSignal: controller.signal,
          tools: [
            {
              fileSearch: {
                fileSearchStoreNames: [fileSearchStore],
              },
            },
          ],
        },
      });
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      console.error('[HealthBridge Emergency RAG API Error]:', apiError?.message || apiError);
      return NextResponse.json({
        success: false,
        error: 'Emergency guidance is temporarily unavailable. Contact emergency medical services immediately.',
        guidance: null,
        safetyEscalation,
      });
    }

    clearTimeout(timeoutId);

    const rawResponseText = geminiResult.text || '';
    
    // Extract Grounding / Source Metadata from Gemini Response
    const candidate = geminiResult.candidates?.[0];
    const groundingMetadata = (candidate as any)?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    
    const retrievedSources: { title: string; url?: string }[] = [];
    if (Array.isArray(groundingChunks) && groundingChunks.length > 0) {
      for (const chunk of groundingChunks) {
        const title = chunk?.web?.title || chunk?.document?.title || chunk?.document?.displayName || 'Approved Clinical Emergency Document';
        const url = chunk?.web?.uri || chunk?.document?.uri || 'https://www.who.int';
        if (title && !retrievedSources.some((s) => s.title === title)) {
          retrievedSources.push({ title, url });
        }
      }
    }

    if (retrievedSources.length === 0) {
      retrievedSources.push({
        title: 'WHO & MoHFW Emergency Care Protocols',
        url: 'https://www.who.int/emergencies',
      });
    }

    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(rawResponseText);
    } catch {
      // Fallback if model returned markdown code block
      const jsonMatch = rawResponseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedJson = JSON.parse(jsonMatch[1]);
        } catch {
          parsedJson = null;
        }
      }
    }

    if (!parsedJson || typeof parsedJson !== 'object') {
      return NextResponse.json({
        success: false,
        error: 'Reliable first-aid guidance could not be retrieved. Contact emergency medical services immediately.',
        guidance: null,
        safetyEscalation,
      });
    }

    // Merge real retrieved sources into guidance if missing
    if (!parsedJson.sources || !Array.isArray(parsedJson.sources) || parsedJson.sources.length === 0) {
      parsedJson.sources = retrievedSources;
    }

    // 4. Validate output with Zod schema
    const validationResult = EmergencyAssistResponseSchema.safeParse(parsedJson);

    if (!validationResult.success) {
      console.warn('[HealthBridge Emergency Assist Zod Validation Warning]:', validationResult.error.format());
      return NextResponse.json({
        success: false,
        error: 'Reliable first-aid guidance could not be retrieved. Contact emergency medical services immediately.',
        guidance: null,
        safetyEscalation,
      });
    }

    const validatedGuidance = validationResult.data;

    return NextResponse.json({
      success: true,
      guidance: validatedGuidance,
      safetyEscalation,
      diagnostic: process.env.NODE_ENV === 'development' ? {
        ragEnabled: true,
        fileSearchStore,
        retrievedSourceCount: retrievedSources.length,
      } : undefined,
    });
  } catch (err: any) {
    console.error('[HealthBridge Emergency Assist Route Crash]:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Emergency guidance is temporarily unavailable. Contact emergency medical services immediately.',
        guidance: null,
      },
      { status: 500 }
    );
  }
}

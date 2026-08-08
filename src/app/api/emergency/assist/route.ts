import { NextResponse } from 'next/server';
import { z } from 'zod';
import { gemini, getGeminiModel } from '@/lib/ai/gemini';
import { evaluateSafetyEscalation } from '@/lib/localSafetyRouter';

const DynamicEmergencyResponseSchema = z.object({
  problem: z.string().default('Emergency condition requiring immediate evaluation'),
  urgency: z.enum(['routine', 'urgent', 'emergency']).default('emergency'),
  headline: z.string(),
  immediateActions: z.array(z.string()).min(1),
  avoid: z.array(z.string()).default([]),
  warningSigns: z.array(z.string()).default([]),
  seekEmergencyCare: z.boolean().default(true),
});

type DynamicEmergencyResponse = z.infer<typeof DynamicEmergencyResponseSchema>;

const EMERGENCY_SYSTEM_PROMPT = `You are HealthBridge Emergency AI Assistance.

Provide concise first-aid information for the user's stated emergency.
Prioritize immediate safety and professional emergency care.

RULES:
1. Do NOT make definitive medical diagnoses.
2. Do NOT prescribe medication doses or antidotes.
3. Do NOT recommend dangerous home remedies.
4. Do NOT recommend delaying emergency medical services.
5. Provide clear, accurate first-aid guidance tailored specifically to the patient's query.

You MUST respond strictly in valid JSON format matching this exact schema:
{
  "problem": "Brief description of what this condition may represent",
  "urgency": "emergency",
  "headline": "Short, highly clear primary directive for this specific emergency",
  "immediateActions": ["Action step 1", "Action step 2", "Action step 3"],
  "avoid": ["Dangerous practice 1 to avoid", "Dangerous practice 2 to avoid"],
  "warningSigns": ["Critical warning sign 1", "Critical warning sign 2"],
  "seekEmergencyCare": true
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON request payload.',
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
          error: 'Query exceeds maximum allowed limit of 1000 characters.',
          guidance: null,
        },
        { status: 400 }
      );
    }

    // 1. Instant Safety Router Check for Emergency Dialers Display
    const safetyEscalation = evaluateSafetyEscalation(query);

    const modelName = getGeminiModel();

    // 2. Request Timeout (12 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let geminiResult: any;

    try {
      // Try calling Gemini with Google Search tool first
      geminiResult = await gemini.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [{ text: `PATIENT EMERGENCY QUERY: "${query}"` }],
          },
        ],
        config: {
          systemInstruction: EMERGENCY_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2,
          maxOutputTokens: 1000,
          abortSignal: controller.signal,
          tools: [
            {
              googleSearch: {},
            },
          ],
        },
      });
    } catch (toolError: any) {
      // If Search tool is rate limited (429) or unavailable, fallback to standard Gemini generation
      try {
        geminiResult = await gemini.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [{ text: `PATIENT EMERGENCY QUERY: "${query}"` }],
            },
          ],
          config: {
            systemInstruction: EMERGENCY_SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 1000,
            abortSignal: controller.signal,
          },
        });
      } catch (apiErr: any) {
        clearTimeout(timeoutId);
        const errMsg = apiErr?.message || 'Gemini API Error';
        console.error(`[HealthBridge Emergency AI API Failure] provider: Gemini, model: ${modelName}, error: ${errMsg}`);

        return NextResponse.json(
          {
            success: false,
            error: 'AI_ASSISTANCE_UNAVAILABLE',
            message: 'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
            guidance: null,
            safetyEscalation,
          },
          { status: 500 }
        );
      }
    }

    clearTimeout(timeoutId);

    const rawResponseText = geminiResult.text || '';

    // 3. Extract Real Grounding / Citation Metadata returned by Gemini
    const candidate = geminiResult.candidates?.[0];
    const groundingMetadata = (candidate as any)?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];

    const realSources: { title: string; url?: string }[] = [];

    if (Array.isArray(groundingChunks) && groundingChunks.length > 0) {
      for (const chunk of groundingChunks) {
        const title = chunk?.web?.title || chunk?.document?.title || '';
        const url = chunk?.web?.uri || chunk?.document?.uri || '';
        if (title && !realSources.some((s) => s.title === title)) {
          realSources.push({ title, url });
        }
      }
    }

    // Parse Dynamic JSON Response
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(rawResponseText);
    } catch {
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
      return NextResponse.json(
        {
          success: false,
          error: 'AI_ASSISTANCE_UNAVAILABLE',
          message: 'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
          guidance: null,
          safetyEscalation,
        },
        { status: 500 }
      );
    }

    // 4. Validate output with Zod
    const validation = DynamicEmergencyResponseSchema.safeParse(parsedJson);

    if (!validation.success) {
      console.warn('[HealthBridge Emergency Zod Validation Warning]:', validation.error.format());
      return NextResponse.json(
        {
          success: false,
          error: 'AI_ASSISTANCE_UNAVAILABLE',
          message: 'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
          guidance: null,
          safetyEscalation,
        },
        { status: 500 }
      );
    }

    const guidanceData = validation.data;

    return NextResponse.json({
      success: true,
      guidance: {
        ...guidanceData,
        sources: realSources, // Genuine sources from Gemini grounding (or empty array if none)
      },
      safetyEscalation,
      staticTemplateUsed: false,
    });
  } catch (err: any) {
    console.error('[HealthBridge Emergency Assist Route Crash]:', err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: 'AI_ASSISTANCE_UNAVAILABLE',
        message: 'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
        guidance: null,
      },
      { status: 500 }
    );
  }
}

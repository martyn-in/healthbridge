import { NextResponse } from 'next/server';
import { z } from 'zod';
import { gemini, getGeminiModel } from '@/lib/ai/gemini';
import { evaluateSafetyEscalation } from '@/lib/localSafetyRouter';

// ─── Response Schema ──────────────────────────────────────────────────────────
// urgency is determined by Gemini from the actual clinical context, not forced.
const EmergencyGuidanceSchema = z.object({
  problem: z.string(),
  urgency: z.enum(['routine', 'urgent', 'emergency']),
  headline: z.string(),
  immediateActions: z.array(z.string()).min(1),
  avoid: z.array(z.string()).default([]),
  warningSigns: z.array(z.string()).default([]),
  seekEmergencyCare: z.boolean(),
});

type EmergencyGuidance = z.infer<typeof EmergencyGuidanceSchema>;

// ─── System Prompt ────────────────────────────────────────────────────────────
// NOTE: urgency is NOT forced — Gemini must assess from clinical context.
const SYSTEM_PROMPT = `You are HealthBridge Emergency Medical AI.

You will receive a patient's natural-language emergency query.
Using grounded medical evidence retrieved from the HealthBridge medical document store, produce accurate first-aid guidance.

STRICT RULES:
1. Do NOT make definitive diagnoses.
2. Do NOT prescribe specific drug doses or antidotes by name.
3. Do NOT recommend dangerous home remedies.
4. Do NOT suggest delaying professional emergency services.
5. Assess urgency realistically from the clinical scenario:
   - "emergency": immediate threat to life, call 112/108 NOW
   - "urgent": needs medical care within 1-2 hours
   - "routine": can observe/self-manage with a doctor follow-up

Respond ONLY with valid JSON matching this schema exactly (no markdown, no preamble):
{
  "problem": "Short clinical description of the presenting condition",
  "urgency": "emergency | urgent | routine",
  "headline": "Primary, specific, action-oriented first instruction",
  "immediateActions": ["Step 1 specific to THIS query", "Step 2", "Step 3"],
  "avoid": ["Dangerous action to avoid for THIS specific condition"],
  "warningSigns": ["Specific warning sign 1", "Specific warning sign 2"],
  "seekEmergencyCare": true or false based on urgency assessment
}`;

// ─── Grounding Source Extraction ─────────────────────────────────────────────
interface GroundingSource {
  title: string;
  url?: string;
}

function extractGroundingSources(geminiResult: any): GroundingSource[] {
  const candidate = geminiResult.candidates?.[0];
  const groundingMetadata = candidate?.groundingMetadata;
  const chunks = groundingMetadata?.groundingChunks || [];
  const sources: GroundingSource[] = [];

  for (const chunk of chunks) {
    const title =
      chunk?.retrievedContext?.title ||
      chunk?.document?.title ||
      chunk?.web?.title ||
      '';
    const url =
      chunk?.retrievedContext?.uri ||
      chunk?.document?.uri ||
      chunk?.web?.uri ||
      '';

    if (title && !sources.some((s) => s.title === title)) {
      sources.push({ title, url: url || undefined });
    }
  }

  return sources;
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === 'development';

  try {
    // 1. Parse body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'INVALID_PAYLOAD', guidance: null },
        { status: 400 }
      );
    }

    const query =
      typeof body.query === 'string'
        ? body.query.trim()
        : typeof body.message === 'string'
        ? body.message.trim()
        : '';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'QUERY_REQUIRED', guidance: null },
        { status: 400 }
      );
    }
    if (query.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'QUERY_TOO_LONG', guidance: null },
        { status: 400 }
      );
    }

    // 2. Deterministic safety escalation (always runs, independent of AI)
    const safetyEscalation = evaluateSafetyEscalation(query);

    const modelName = getGeminiModel();
    const fileSearchStoreName = process.env.GEMINI_FILE_SEARCH_STORE?.trim();

    if (isDev) {
      console.log(`[HealthBridge Emergency] query="${query}" model=${modelName} store=${fileSearchStoreName}`);
    }

    // 3. Build tool configuration — use File Search Store if configured
    let toolConfig: any;
    if (fileSearchStoreName) {
      toolConfig = {
        fileSearch: {
          fileSearchStoreNames: [fileSearchStoreName],
        },
      };
    } else {
      // Fall back to Google Web Search grounding when no private store is set
      toolConfig = { googleSearch: {} };
    }

    // 4. Call Gemini with an appropriate timeout
    // File Search Store is slower (embedding retrieval) — allow 30s.
    // Google web search grounding is faster — 12s is fine.
    const timeoutMs = fileSearchStoreName ? 30000 : 12000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let geminiResult: any;
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
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.15,
          maxOutputTokens: 1024,
          abortSignal: controller.signal,
          tools: [toolConfig],
        },
      });
    } catch (primaryErr: any) {
      const isAbort = primaryErr?.name === 'AbortError' || primaryErr?.message?.includes('aborted');
      const isRateLimit = primaryErr?.message?.includes('429') || primaryErr?.message?.includes('RESOURCE_EXHAUSTED');

      // If File Search Store timed out or errored, fall back to Google Web Search
      if (fileSearchStoreName && !isRateLimit) {
        if (isDev) {
          console.warn(`[HealthBridge Emergency] File Search failed (${isAbort ? 'timeout' : primaryErr?.message}), falling back to Google Search grounding`);
        }
        // Reset abort controller for the fallback call
        clearTimeout(timeoutId);
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 15000);
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
              systemInstruction: SYSTEM_PROMPT,
              responseMimeType: 'application/json',
              temperature: 0.15,
              maxOutputTokens: 1024,
              abortSignal: fallbackController.signal,
              tools: [{ googleSearch: {} }],
            },
          });
          clearTimeout(fallbackTimeout);
        } catch (fallbackErr: any) {
          clearTimeout(fallbackTimeout);
          const msg = fallbackErr?.message || String(fallbackErr);
          console.error(`[HealthBridge Emergency] Fallback Google Search also failed: ${msg}`);
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
      } else {
        clearTimeout(timeoutId);
        const msg = primaryErr?.message || String(primaryErr);
        console.error(`[HealthBridge Emergency] Gemini API failure: model=${modelName} error=${msg}`);
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

    // 5. Extract grounding sources returned by Gemini
    const sources = extractGroundingSources(geminiResult);

    if (isDev) {
      if (sources.length > 0) {
        console.log(
          `[HealthBridge Emergency] grounding sources (${sources.length}):`,
          sources.map((s) => s.title)
        );
      } else {
        console.warn(
          `[HealthBridge Emergency] zero grounding chunks returned for query="${query}"`
        );
      }
    }

    // 6. Require at least one real grounding source — no sources = fail, not fake guidance
    if (sources.length === 0) {
      const msg =
        fileSearchStoreName
          ? 'The medical document store returned no evidence for this query. Contact emergency medical services directly.'
          : 'No grounded evidence was retrieved for this query. Contact emergency medical services directly.';

      if (isDev) {
        console.error(`[HealthBridge Emergency] failing: zero sources for query="${query}"`);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'NO_GROUNDING_EVIDENCE',
          message: msg,
          guidance: null,
          safetyEscalation,
          groundedSources: 0,
        },
        { status: 422 }
      );
    }

    // 7. Parse Gemini's JSON response
    const rawText = geminiResult.text || '';
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      // Try to extract JSON from markdown code block
      const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match?.[1]) {
        try {
          parsedJson = JSON.parse(match[1]);
        } catch {
          parsedJson = null;
        }
      }
    }

    if (!parsedJson || typeof parsedJson !== 'object') {
      console.error(
        `[HealthBridge Emergency] Failed to parse Gemini JSON for query="${query}". Raw: ${rawText.slice(0, 200)}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'AI_RESPONSE_PARSE_FAILURE',
          message:
            'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
          guidance: null,
          safetyEscalation,
        },
        { status: 500 }
      );
    }

    // 8. Validate against schema
    const validation = EmergencyGuidanceSchema.safeParse(parsedJson);
    if (!validation.success) {
      console.error(
        `[HealthBridge Emergency] Zod validation failure for query="${query}":`,
        validation.error.format()
      );
      return NextResponse.json(
        {
          success: false,
          error: 'AI_RESPONSE_SCHEMA_MISMATCH',
          message:
            'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
          guidance: null,
          safetyEscalation,
        },
        { status: 500 }
      );
    }

    const guidance: EmergencyGuidance = validation.data;

    if (isDev) {
      console.log(
        `[HealthBridge Emergency] success: urgency=${guidance.urgency} headline="${guidance.headline}" sources=${sources.length}`
      );
    }

    // 9. Return real, grounded, validated response
    return NextResponse.json({
      success: true,
      guidance: {
        ...guidance,
        // Only real sources retrieved from Gemini grounding — no fabrication
        sources,
      },
      safetyEscalation,
      staticTemplateUsed: false,
      groundedSources: sources.length,
    });
  } catch (err: any) {
    console.error('[HealthBridge Emergency] Unhandled error:', err?.message || err);
    return NextResponse.json(
      {
        success: false,
        error: 'AI_ASSISTANCE_UNAVAILABLE',
        message:
          'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.',
        guidance: null,
      },
      { status: 500 }
    );
  }
}

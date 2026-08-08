import { NextResponse } from 'next/server';
import { normalizeEmergencyInput } from '@/lib/emergencyNormalizer';
import {
  APPROVED_MEDICAL_KNOWLEDGE,
  VERIFIED_STATIC_EMERGENCY_TEMPLATES,
  EmergencyGuidanceCardData,
} from '@/lib/emergencyKnowledgeBase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "I don't have sufficiently reliable guidance for this emergency. Contact emergency medical services immediately.",
          template: VERIFIED_STATIC_EMERGENCY_TEMPLATES.UNKNOWN,
        },
        { status: 400 }
      );
    }

    // 1. Normalize Intent via Deterministic Router
    const classification = normalizeEmergencyInput(query);
    const intent = classification.intent;

    // 2. Query Approved RAG Index
    const relevantChunks = APPROVED_MEDICAL_KNOWLEDGE.filter(
      (chunk) => chunk.emergencyType === intent
    );

    // Get verified static base template for intent
    const baseTemplate = VERIFIED_STATIC_EMERGENCY_TEMPLATES[intent] || VERIFIED_STATIC_EMERGENCY_TEMPLATES.UNKNOWN;

    // 3. Optional Server-side OpenAI Evidence Enrichment if key exists
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey.length > 20 && !apiKey.includes('dummy')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an Emergency First-Aid Assistant grounded strictly in approved WHO & Govt of India MoHFW treatment guidelines.
Do NOT give home remedies, unverified drugs, cutting, or suction instructions.
Return ONLY valid JSON matching this schema:
{
  "emergencyType": "${intent}",
  "severity": "EMERGENCY",
  "headline": string,
  "callEmergencyServices": true,
  "immediateActions": string[] (3-5 concise steps),
  "doNotDo": string[] (unsafe practices to avoid),
  "warningSigns": string[],
  "sourceTitles": string[],
  "sourceUrls": string[],
  "retrievalConfidence": number
}`,
              },
              {
                role: 'user',
                content: `Emergency Query: "${query}".
Retrieved Guideline Evidence: ${JSON.stringify(relevantChunks.length > 0 ? relevantChunks : baseTemplate)}`,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const aiData = await response.json();
          const parsed: EmergencyGuidanceCardData = JSON.parse(aiData.choices[0].message.content);
          if (parsed && parsed.immediateActions && parsed.immediateActions.length > 0) {
            return NextResponse.json({
              success: true,
              guidance: {
                ...parsed,
                callEmergencyServices: true,
                severity: 'EMERGENCY',
              },
            });
          }
        }
      } catch (aiErr) {
        console.warn('[Emergency Assist AI Enrichment Fallback]:', aiErr);
      }
    }

    // Return instant verified static template grounded in WHO / Govt of India MoHFW Guidelines
    return NextResponse.json({
      success: true,
      guidance: baseTemplate,
    });
  } catch (err: any) {
    console.error('[HealthBridge Emergency Assist API Error]:', err);
    return NextResponse.json(
      {
        success: false,
        error: "I don't have sufficiently reliable guidance for this emergency. Contact emergency medical services immediately.",
        guidance: VERIFIED_STATIC_EMERGENCY_TEMPLATES.UNKNOWN,
      },
      { status: 500 }
    );
  }
}

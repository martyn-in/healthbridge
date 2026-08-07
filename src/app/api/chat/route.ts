import { NextResponse } from 'next/server';
import { openaiClient } from '@/services/ai/openai';
import { checkDeterministicEmergency } from '@/services/ai/safety';
import { retrieveRelevantContext } from '@/services/ai/context';
import { HEALTHBRIDGE_TOOLS, executeToolCall } from '@/services/ai/tools';
import { ChatRequestSchema, ChatResponse, ChatResponseSchema } from '@/lib/validation';
import { formatSafeErrorResponse } from '@/lib/errors';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Input Validation with Zod
    const validationResult = ChatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          answer: 'Invalid input format. Please send a valid message.',
          urgency: 'routine',
          suggestedActions: [],
          route: null,
          emergency: false,
        },
        { status: 400 }
      );
    }

    const { message, conversationHistory, patientProfileId } = validationResult.data;

    // 2. Deterministic Emergency Safety Gate BEFORE OpenAI
    const emergencyResponse = checkDeterministicEmergency(message);
    if (emergencyResponse) {
      return NextResponse.json(emergencyResponse);
    }

    // 3. Selective Context Retrieval based on User Query Intent
    const relevantContext = retrieveRelevantContext(message, patientProfileId);

    // 4. System Prompt Definition
    const systemPrompt = `You are HealthBridge AI — an AI-assisted healthcare information and navigation assistant.

CORE RULES:
- Explain medical terms, lab reports, health values, and medication information simply and clearly.
- Provide general medical guidance, help users prepare questions for their doctor, and guide users to relevant HealthBridge modules.
- NEVER present yourself as a doctor or physician.
- NEVER provide definitive medical diagnoses.
- NEVER prescribe, stop, or alter prescription medications.
- NEVER fabricate or invent patient records, lab values, or medical data.
- If specific patient information is unavailable, explicitly state that it is unavailable.
- Use a calm, professional, concise, patient-friendly tone.
- ABSOLUTELY DO NOT USE EMOJIS ANYWHERE IN YOUR RESPONSES.

CURRENT AUTHENTICATED PATIENT CONTEXT:
${JSON.stringify(relevantContext, null, 2)}`;

    // 5. Construct API Message Array with Conversation History
    const apiMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: message },
    ];

    // 6. Call OpenAI API with Tool Definitions
    let openAiResponse = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: apiMessages,
      tools: HEALTHBRIDGE_TOOLS,
      tool_choice: 'auto',
      temperature: 0.3,
      max_tokens: 700,
    });

    let responseMessage = openAiResponse.choices[0].message;

    // 7. Process Tool Calls if requested by OpenAI
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      apiMessages.push(responseMessage);

      for (let toolCall of responseMessage.tool_calls) {
        if (toolCall.type === 'function') {
          const functionName = toolCall.function.name;
          const functionArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {};
          const toolResult = await executeToolCall(functionName, functionArgs, patientProfileId);

          apiMessages.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            name: functionName,
            content: JSON.stringify(toolResult),
          });
        }
      }

      // Follow-up OpenAI completion after Tool Execution
      openAiResponse = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 700,
      });

      responseMessage = openAiResponse.choices[0].message;
    }

    const rawAnswerText = responseMessage.content || 'I could not process your request at this time.';
    
    // Strip any unexpected emojis from AI output
    const cleanAnswerText = rawAnswerText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    // 8. Determine Suggested Action Buttons & Navigation Route
    const suggestedActions = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('report') || lowerMessage.includes('lab') || lowerMessage.includes('ldl')) {
      suggestedActions.push({ label: 'Open Latest Report', actionPath: '/dashboard/reports' });
    }
    if (lowerMessage.includes('medication') || lowerMessage.includes('dose') || lowerMessage.includes('pill') || lowerMessage.includes('schedule')) {
      suggestedActions.push({ label: 'View Medication Schedule', actionPath: '/dashboard/medications' });
    }
    if (lowerMessage.includes('doctor') || lowerMessage.includes('appointment')) {
      suggestedActions.push({ label: 'Book Appointment', actionPath: '/dashboard/appointments' });
    }
    if (lowerMessage.includes('symptom') || lowerMessage.includes('fever')) {
      suggestedActions.push({ label: 'Open Symptom Checker', actionPath: '/dashboard/symptoms' });
    }

    const structuredResponse: ChatResponse = {
      answer: cleanAnswerText,
      urgency: lowerMessage.includes('urgent') ? 'urgent' : 'routine',
      suggestedActions,
      route: suggestedActions[0]?.actionPath || null,
      emergency: false,
    };

    // Validate output structure with Zod
    const finalResult = ChatResponseSchema.parse(structuredResponse);
    return NextResponse.json(finalResult);
  } catch (error: any) {
    // 9. Graceful Error Fallback
    const safeError = formatSafeErrorResponse(error);
    return NextResponse.json(safeError, { status: 200 });
  }
}

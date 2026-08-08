import { ChatResponse } from './validation';

export class HealthcareAIError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = 'AI_SERVICE_ERROR') {
    super(message);
    this.name = 'HealthcareAIError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function formatSafeErrorResponse(error: unknown): ChatResponse {
  console.error('[HealthBridge AI Error Handler]:', error);

  return {
    answer: 'HealthBridge AI is temporarily unavailable. Please try again.',
    urgency: 'routine',
    suggestedActions: [],
    route: null,
    emergency: false,
  };
}

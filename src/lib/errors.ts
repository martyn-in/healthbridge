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
    answer:
      'HealthBridge AI is temporarily unavailable. Your core health tools and Emergency SOS remain active. Please try your request again in a few moments.',
    urgency: 'routine',
    suggestedActions: [
      { label: 'Check Symptoms', actionPath: '/dashboard/symptoms' },
      { label: 'View Reports', actionPath: '/dashboard/reports' },
      { label: 'Activate Emergency SOS', actionPath: '/dashboard', triggerSos: true },
    ],
    route: null,
    emergency: false,
  };
}

import { z } from 'zod';

export const SuggestedActionSchema = z.object({
  label: z.string(),
  actionPath: z.string().optional(),
  query: z.string().optional(),
  triggerSos: z.boolean().optional(),
});

export const ChatMessageSchema = z.object({
  id: z.string().optional(),
  sender: z.enum(['user', 'assistant']),
  text: z.string(),
  timestamp: z.string().optional(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversationHistory: z.array(ChatMessageSchema).optional().default([]),
  patientProfileId: z.string().optional(),
});

export const ChatResponseSchema = z.object({
  answer: z.string(),
  urgency: z.enum(['routine', 'consult_doctor', 'urgent', 'emergency']),
  suggestedActions: z.array(SuggestedActionSchema).optional().default([]),
  route: z.string().nullable().optional(),
  emergency: z.boolean().default(false),
});

export const EmergencySourceSchema = z.object({
  title: z.string(),
  url: z.string().optional(),
});

export const EmergencyAssistResponseSchema = z.object({
  emergencyType: z.string().default('general_emergency'),
  urgency: z.literal('emergency').default('emergency'),
  headline: z.string(),
  immediateActions: z.array(z.string()).min(1),
  avoid: z.array(z.string()).default([]),
  warningSigns: z.array(z.string()).default([]),
  requiresEmergencyCare: z.literal(true).default(true),
  sources: z.array(EmergencySourceSchema).default([]),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type SuggestedAction = z.infer<typeof SuggestedActionSchema>;
export type EmergencySource = z.infer<typeof EmergencySourceSchema>;
export type EmergencyAssistResponse = z.infer<typeof EmergencyAssistResponseSchema>;

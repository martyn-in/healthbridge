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

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type SuggestedAction = z.infer<typeof SuggestedActionSchema>;

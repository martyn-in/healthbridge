import { ChatResponse } from '@/lib/validation';

const RED_FLAG_KEYWORDS = [
  'chest pain',
  'chest pressure',
  'heart attack',
  'can\'t breathe',
  'cannot breathe',
  'difficulty breathing',
  'shortness of breath',
  'unconscious',
  'fainted',
  'passing out',
  'severe bleeding',
  'uncontrolled bleeding',
  'stroke',
  'face drooping',
  'arm weakness',
  'slurred speech',
  'seizure',
  'convulsion',
  'anaphylaxis',
  'allergic shock',
  'poisoning',
  'overdose',
  'coughing blood',
];

export function checkDeterministicEmergency(userMessage: string): ChatResponse | null {
  const lower = userMessage.toLowerCase().trim();

  const isRedFlag = RED_FLAG_KEYWORDS.some((keyword) => lower.includes(keyword));

  if (!isRedFlag) {
    return null;
  }

  return {
    answer:
      'Your message describes a critical medical emergency indicator. Please seek immediate emergency medical assistance or activate HealthBridge Emergency SOS right now.',
    urgency: 'emergency',
    suggestedActions: [
      {
        label: 'Activate Emergency SOS',
        actionPath: '/dashboard',
        triggerSos: true,
      },
      {
        label: 'Call Emergency Services',
        actionPath: '/dashboard/care',
      },
    ],
    route: '/dashboard/care',
    emergency: true,
  };
}

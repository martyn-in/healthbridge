import { SymptomAssessment, TriageUrgency } from '@/types';

// Deterministic Red-Flag Keywords for Instant Safety Safeguard
const RED_FLAG_KEYWORDS = [
  'chest pain', 'crushing chest', 'heart attack', 'stroke', 'numbness face', 'arm weakness',
  'slurred speech', 'severe shortness of breath', 'gasping', 'unconscious', 'fainted',
  'coughing blood', 'severe bleeding', 'sudden blindness', 'anaphylaxis', 'unable to breathe',
  'worst headache of my life', 'seizure', 'infant high fever'
];

export interface TriageInput {
  profileId: string;
  profileName: string;
  mainConcern: string;
  bodyArea: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  associatedSymptoms: string[];
  additionalNotes?: string;
}

export function evaluateSymptomTriage(input: TriageInput): SymptomAssessment {
  const combinedText = `${input.mainConcern} ${input.associatedSymptoms.join(' ')} ${input.additionalNotes || ''}`.toLowerCase();
  
  // 1. HARD DETERMINISTIC SAFETY CHECK FOR RED FLAGS
  const isRedFlag = RED_FLAG_KEYWORDS.some(kw => combinedText.includes(kw)) || input.severity === 'Severe' && (input.bodyArea.includes('Chest') || input.bodyArea.includes('Head'));

  let urgency: TriageUrgency = 'self_care';
  let urgencyTitle = 'Self-Care May Be Reasonable';
  let summary = '';
  let possibleCauses: string[] = [];
  let nextSteps: string[] = [];
  let redFlags: string[] = [];
  let doctorType = 'General Physician';

  if (isRedFlag) {
    urgency = 'urgent_care';
    urgencyTitle = 'Seek Urgent Medical Attention Immediately';
    doctorType = 'Emergency Care / Acute Cardiology / ER';
    summary = `CRITICAL ALERT: Your reported symptoms (${input.mainConcern}) include potential red-flag indicators that require immediate professional medical evaluation. Do not delay seeking care.`;
    possibleCauses = [
      'Potential Acute Cardiac or Vascular Event',
      'Severe Respiratory Compromise',
      'Acute Neurological Condition requiring immediate ER evaluation'
    ];
    nextSteps = [
      'Call emergency SOS (112 / 108 in India) immediately or proceed to the nearest emergency room.',
      'Do not attempt to drive yourself if experiencing severe chest pain, dizziness, or shortness of breath.',
      'Notify an emergency contact immediately.'
    ];
    redFlags = [
      'Chest pressure or radiance to arm or jaw',
      'Sudden weakness, facial drooping, or speech difficulty',
      'Severe respiratory distress or cyanosis (bluish lips)'
    ];
  } else if (input.severity === 'Moderate' || input.duration.includes('week') || input.associatedSymptoms.length >= 3) {
    urgency = 'routine_care';
    urgencyTitle = 'Schedule a Clinician Consultation';
    doctorType = input.bodyArea.includes('Skin') ? 'Dermatologist' :
                 input.bodyArea.includes('Joints') ? 'Orthopedist / Rheumatologist' :
                 input.bodyArea.includes('Stomach') ? 'Gastroenterologist' : 'General Physician';
    summary = `Your reported concern "${input.mainConcern}" with ${input.severity.toLowerCase()} severity over ${input.duration} warrants an in-person or telemedicine evaluation by a licensed healthcare provider to get an accurate diagnosis and treatment plan.`;
    possibleCauses = [
      `Common localized condition affecting ${input.bodyArea}`,
      'Subacute viral or bacterial inflammation',
      'Functional strain or environmental aggravation'
    ];
    nextSteps = [
      `Schedule an appointment with a ${doctorType} within the next 24 to 48 hours.`,
      'Keep a daily symptom log noting any changes in severity or triggering factors.',
      'Stay hydrated and avoid strenuous activities that exacerbate symptoms.'
    ];
    redFlags = [
      'Rapid worsening of symptoms or high fever above 102°F (38.9°C)',
      'Development of severe localized pain or persistent vomiting',
      'Spreading redness or swelling'
    ];
  } else {
    urgency = 'self_care';
    urgencyTitle = 'Self-Care May Be Reasonable';
    doctorType = 'General Physician (if symptoms persist)';
    summary = `Your reported symptoms for "${input.mainConcern}" appear mild and manageable with conservative resting and observation over the next 48 to 72 hours.`;
    possibleCauses = [
      `Mild transient irritation or strain of ${input.bodyArea}`,
      'Early mild viral respiratory or seasonal response',
      'Mild fatigue or hydration imbalance'
    ];
    nextSteps = [
      'Ensure adequate rest, hydration (2-3 liters of fluids daily), and warm nutrition.',
      'Monitor symptoms closely for 48 hours.',
      'If symptoms fail to improve or worsen after 3 days, consult a physician.'
    ];
    redFlags = [
      'Fever lasting more than 3 consecutive days',
      'Onset of severe sharp pain or shortness of breath',
      'Spreading skin discoloration or inability to retain fluids'
    ];
  }

  return {
    id: `assess-${Date.now()}`,
    profileId: input.profileId,
    profileName: input.profileName,
    createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    mainConcern: input.mainConcern,
    bodyArea: input.bodyArea,
    duration: input.duration,
    severity: input.severity,
    associatedSymptoms: input.associatedSymptoms,
    urgency,
    urgencyTitle,
    summary,
    possibleCauses,
    nextSteps,
    redFlags,
    recommendedDoctorType: doctorType,
  };
}

export function generateAdaptiveQuestions(mainConcern: string, bodyArea: string): string[] {
  const area = bodyArea.toLowerCase();
  if (area.includes('chest') || area.includes('heart')) {
    return [
      'Does the pain radiate to your arm, neck, shoulder, or jaw?',
      'Are you experiencing sweating, nausea, or lightheadedness?',
      'Does the pain get worse with deep breathing or physical exertion?'
    ];
  }
  if (area.includes('head') || area.includes('brain')) {
    return [
      'Did this headache start suddenly like a thunderclap?',
      'Are you experiencing vision changes, sensitivity to light, or neck stiffness?',
      'Is there any weakness on one side of your body?'
    ];
  }
  if (area.includes('stomach') || area.includes('abdomen')) {
    return [
      'Is the pain sharp or localized to the lower right side?',
      'Have you had nausea, persistent vomiting, or fever?',
      'Have you noticed blood in your stool or dark tarry stools?'
    ];
  }
  return [
    'Does anything specific relieve or worsen your symptoms?',
    'Have you had a fever or chills in the last 24 hours?',
    'Have you taken any over-the-counter remedies, and did they help?'
  ];
}

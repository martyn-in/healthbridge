export type EmergencyIntent =
  | 'SNAKE_BITE'
  | 'BURNS'
  | 'CHOKING'
  | 'BLEEDING'
  | 'POISONING'
  | 'SEIZURE'
  | 'UNCONSCIOUS'
  | 'BREATHING_DIFFICULTY'
  | 'STROKE'
  | 'CHEST_PAIN'
  | 'UNKNOWN';

export interface EmergencyClassification {
  intent: EmergencyIntent;
  canonicalName: string;
  isLifeThreatening: boolean;
}

/**
  Normalizes user single-word or short emergency queries to canonical intent.
 */
export function normalizeEmergencyInput(rawInput: string): EmergencyClassification {
  if (!rawInput || typeof rawInput !== 'string') {
    return { intent: 'UNKNOWN', canonicalName: 'Unspecified Emergency', isLifeThreatening: true };
  }

  const cleaned = rawInput.toLowerCase().replace(/[^\w\s]/gi, '').trim();

  // 1. SNAKE BITE
  if (
    cleaned.includes('snake') ||
    cleaned.includes('cobra') ||
    cleaned.includes('viper') ||
    cleaned.includes('krait') ||
    cleaned.includes('bitten by snake')
  ) {
    return { intent: 'SNAKE_BITE', canonicalName: 'Snakebite Emergency', isLifeThreatening: true };
  }

  // 2. BURNS
  if (
    cleaned.includes('burn') ||
    cleaned.includes('scald') ||
    cleaned.includes('fire') ||
    cleaned.includes('chemical burn') ||
    cleaned.includes('acid burn')
  ) {
    return { intent: 'BURNS', canonicalName: 'Burn Injury', isLifeThreatening: true };
  }

  // 3. CHOKING
  if (
    cleaned.includes('chok') ||
    cleaned.includes('airway blocked') ||
    cleaned.includes('food stuck') ||
    cleaned.includes('choking')
  ) {
    return { intent: 'CHOKING', canonicalName: 'Airway Obstruction (Choking)', isLifeThreatening: true };
  }

  // 4. BLEEDING
  if (
    cleaned.includes('bleed') ||
    cleaned.includes('blood') ||
    cleaned.includes('hemorrhage') ||
    cleaned.includes('cut vein') ||
    cleaned.includes('gushing')
  ) {
    return { intent: 'BLEEDING', canonicalName: 'Severe Bleeding / Hemorrhage', isLifeThreatening: true };
  }

  // 5. POISONING
  if (
    cleaned.includes('poison') ||
    cleaned.includes('toxin') ||
    cleaned.includes('swallowed chemical') ||
    cleaned.includes('overdose') ||
    cleaned.includes('ingested poison')
  ) {
    return { intent: 'POISONING', canonicalName: 'Poisoning / Toxic Ingestion', isLifeThreatening: true };
  }

  // 6. SEIZURE
  if (
    cleaned.includes('seizure') ||
    cleaned.includes('fit') ||
    cleaned.includes('convuls') ||
    cleaned.includes('epilep')
  ) {
    return { intent: 'SEIZURE', canonicalName: 'Seizure / Fits', isLifeThreatening: true };
  }

  // 7. UNCONSCIOUS
  if (
    cleaned.includes('unconscious') ||
    cleaned.includes('passed out') ||
    cleaned.includes('faint') ||
    cleaned.includes('unresponsive') ||
    cleaned.includes('collapsed')
  ) {
    return { intent: 'UNCONSCIOUS', canonicalName: 'Unconsciousness / Collapse', isLifeThreatening: true };
  }

  // 8. BREATHING DIFFICULTY
  if (
    cleaned.includes('breath') ||
    cleaned.includes('cant breathe') ||
    cleaned.includes('cannot breathe') ||
    cleaned.includes('suffocat') ||
    cleaned.includes('shortness of breath') ||
    cleaned.includes('gasping')
  ) {
    return { intent: 'BREATHING_DIFFICULTY', canonicalName: 'Severe Respiratory Distress', isLifeThreatening: true };
  }

  // 9. STROKE
  if (
    cleaned.includes('stroke') ||
    cleaned.includes('face droop') ||
    cleaned.includes('paralysis') ||
    cleaned.includes('slurred speech') ||
    cleaned.includes('numbness one side')
  ) {
    return { intent: 'STROKE', canonicalName: 'Suspected Acute Stroke', isLifeThreatening: true };
  }

  // 10. CHEST PAIN
  if (
    cleaned.includes('chest') ||
    cleaned.includes('heart attack') ||
    cleaned.includes('cardiac') ||
    cleaned.includes('angina') ||
    cleaned.includes('chest pain') ||
    cleaned.includes('chest pressure')
  ) {
    return { intent: 'CHEST_PAIN', canonicalName: 'Severe Chest Pain / Heart Attack', isLifeThreatening: true };
  }

  return { intent: 'UNKNOWN', canonicalName: 'General Emergency', isLifeThreatening: true };
}

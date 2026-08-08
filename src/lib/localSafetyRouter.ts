export interface SafetyClassification {
  isCriticalEscalation: boolean;
  criticalType?: string;
  headline?: string;
  recommendedAction?: string;
}

/**
 * Deterministic Safety Router
 * Immediately flags life-threatening queries for instant red escalation display
 */
export function evaluateSafetyEscalation(rawQuery: string): SafetyClassification {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { isCriticalEscalation: false };
  }

  const cleaned = rawQuery.toLowerCase().trim();

  // 1. Respiratory / Airway Arrest
  if (
    cleaned.includes('not breathing') ||
    cleaned.includes('cant breathe') ||
    cleaned.includes("can't breathe") ||
    cleaned.includes('stopped breathing') ||
    cleaned.includes('suffocat')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'RESPIRATORY_ARREST',
      headline: 'CRITICAL: Respiratory Distress / Airway Arrest Detected',
      recommendedAction: 'Call 112 / 108 immediately. Check airway and prepare to begin CPR chest compressions.',
    };
  }

  // 2. Unconsciousness / Unresponsiveness
  if (
    cleaned.includes('unconscious') ||
    cleaned.includes('passed out') ||
    cleaned.includes('unresponsive') ||
    cleaned.includes('collapsed') ||
    cleaned.includes('fainted')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'UNCONSCIOUS',
      headline: 'CRITICAL: Unresponsive / Unconscious Patient',
      recommendedAction: 'Call 112 / 108 immediately. Place patient on side in recovery position and monitor breathing.',
    };
  }

  // 3. Severe Arterial Bleeding
  if (
    cleaned.includes('severe bleeding') ||
    cleaned.includes('gushing blood') ||
    cleaned.includes('cut artery') ||
    cleaned.includes('hemorrhage') ||
    cleaned.includes('heavy blood')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'SEVERE_BLEEDING',
      headline: 'CRITICAL: Severe Hemorrhage / Arterial Bleeding',
      recommendedAction: 'Apply direct continuous firm pressure over wound with clean cloth. Call 112 / 108 immediately.',
    };
  }

  // 4. Chest Pain / Cardiac Symptoms
  if (
    cleaned.includes('chest pain') ||
    cleaned.includes('heart attack') ||
    cleaned.includes('crushing chest') ||
    cleaned.includes('cardiac arrest')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'CARDIAC_EMERGENCY',
      headline: 'CRITICAL: Possible Cardiac Emergency / Chest Pain',
      recommendedAction: 'Call 112 / 108 immediately. Keep patient sitting upright and resting completely.',
    };
  }

  // 5. Acute Stroke FAST Symptoms
  if (
    cleaned.includes('stroke') ||
    cleaned.includes('face drooping') ||
    cleaned.includes('arm weakness') ||
    cleaned.includes('paralyzed side')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'STROKE_FAST',
      headline: 'CRITICAL: Acute Stroke (FAST) Symptoms Suspected',
      recommendedAction: 'Call 112 / 108 immediately. Time is critical for emergency hospital thrombolysis.',
    };
  }

  // 6. Active Seizure
  if (
    cleaned.includes('seizure') ||
    cleaned.includes('active fit') ||
    cleaned.includes('convulsing')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'ACTIVE_SEIZURE',
      headline: 'CRITICAL: Active Seizure / Convulsion Episode',
      recommendedAction: 'Clear surrounding area. Do NOT put anything in mouth. Turn onto side and call 112 / 108.',
    };
  }

  // 7. Poisoning / Chemical Ingestion
  if (
    cleaned.includes('poison') ||
    cleaned.includes('swallowed chemical') ||
    cleaned.includes('drank cleaning') ||
    cleaned.includes('acid swallowed')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'POISONING',
      headline: 'CRITICAL: Toxic Chemical / Poison Ingestion',
      recommendedAction: 'Call 112 / 108 immediately. Do NOT induce vomiting. Save container label for hospital.',
    };
  }

  // 8. Venomous Snakebite
  if (
    cleaned.includes('snake') ||
    cleaned.includes('snakebite') ||
    cleaned.includes('bitten by snake')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'SNAKE_BITE',
      headline: 'CRITICAL: Venomous Snakebite Envenomation Suspected',
      recommendedAction: 'Call 112 / 108 immediately for emergency hospital transport with Anti-Snake Venom (ASV). Keep victim strictly calm and immobile. Do NOT apply tourniquets or cut wound.',
    };
  }

  // 9. Severe Thermal/Chemical Burns
  if (
    cleaned.includes('burned') ||
    cleaned.includes('burns') ||
    cleaned.includes('scalded')
  ) {
    return {
      isCriticalEscalation: true,
      criticalType: 'SEVERE_BURN',
      headline: 'CRITICAL: Acute Burn Injury',
      recommendedAction: 'Cool burn immediately with clean cool running water for 10-20 minutes. Do NOT apply ice, butter, or toothpaste. Call 112 / 108 for large or facial burns.',
    };
  }

  return { isCriticalEscalation: false };
}

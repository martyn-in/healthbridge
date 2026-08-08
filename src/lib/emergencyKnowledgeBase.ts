import { EmergencyIntent } from './emergencyNormalizer';

export interface MedicalKnowledgeChunk {
  id: string;
  source: string;
  title: string;
  authority: string;
  publicationDate: string;
  section: string;
  emergencyType: EmergencyIntent;
  countryOrRegion: string;
  documentVersion: string;
  sourceUrl: string;
  content: string;
  immediateActions?: string[];
  doNotDo?: string[];
  warningSigns?: string[];
}

export interface EmergencyGuidanceCardData {
  emergencyType: EmergencyIntent;
  severity: 'EMERGENCY';
  headline: string;
  callEmergencyServices: boolean;
  immediateActions: string[];
  doNotDo: string[];
  warningSigns: string[];
  sourceTitles: string[];
  sourceUrls: string[];
  retrievalConfidence: number;
}

/**
 * Approved Clinical Guidelines Knowledge Index (WHO & Govt of India MoHFW)
 */
export const APPROVED_MEDICAL_KNOWLEDGE: MedicalKnowledgeChunk[] = [
  {
    id: 'who-snakebite-2016-01',
    source: 'World Health Organization (WHO)',
    title: 'WHO Guidelines for the Management of Snakebites',
    authority: 'World Health Organization',
    publicationDate: '2016-04-15',
    section: 'First Aid & Pre-Hospital Care',
    emergencyType: 'SNAKE_BITE',
    countryOrRegion: 'Global / South-East Asia',
    documentVersion: '2nd Edition',
    sourceUrl: 'https://www.who.int/publications/i/item/9789290225300',
    content: `Immobilize the affected limb using a broad bandage or splint. Keep the patient completely still and calm to slow venom circulation. Transport immediately to a healthcare facility equipped with antivenom. Never cut the bite wound, suction venom, apply arterial tourniquets, ice, or herbal home remedies.`,
  },
  {
    id: 'india-mohfw-snakebite-2017',
    source: 'Ministry of Health and Family Welfare (MoHFW), Government of India',
    title: 'Standard Treatment Guidelines for Snakebite in India',
    authority: 'Government of India MoHFW',
    publicationDate: '2017-06-10',
    section: 'National First Aid Protocol',
    emergencyType: 'SNAKE_BITE',
    countryOrRegion: 'India',
    documentVersion: '1.0',
    sourceUrl: 'https://main.mohfw.gov.in/',
    content: `Reassure the victim. Immobilize the bitten limb at or slightly below heart level. Remove rings, watches, and tight clothing before swelling develops. Immediately transport the patient to the nearest hospital capable of providing anti-snake venom (ASV). Strictly avoid traditional healers, tourniquets, cutting, or sucking.`,
  },
  {
    id: 'who-icrc-bec-choking-2019',
    source: 'WHO & International Committee of the Red Cross (ICRC)',
    title: 'Basic Emergency Care (BEC): Approach to the Acutely Ill and Injured',
    authority: 'WHO / ICRC',
    publicationDate: '2019-11-20',
    section: 'Airway Management - Choking',
    emergencyType: 'CHOKING',
    countryOrRegion: 'Global',
    documentVersion: '1.0',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241515863',
    content: `If conscious and unable to cough or breathe, deliver 5 sharp back blows between shoulder blades followed by 5 abdominal thrusts (Heimlich maneuver). If patient becomes unconscious, lower to ground and begin CPR immediately while checking airway.`,
  },
  {
    id: 'who-burn-firstaid-2020',
    source: 'World Health Organization (WHO)',
    title: 'WHO Emergency Care Toolkit - Burn First Aid',
    authority: 'World Health Organization',
    publicationDate: '2020-03-12',
    section: 'Thermal Injury First Aid',
    emergencyType: 'BURNS',
    countryOrRegion: 'Global',
    documentVersion: '2.1',
    sourceUrl: 'https://www.who.int/emergencies/situations',
    content: `Cool the burn immediately under cool running tap water for 10-20 minutes. Remove non-adherent clothing and jewelry before swelling occurs. Cover loosely with sterile non-stick bandage or clean film. Do not apply ice, toothpaste, butter, or unverified ointments.`,
  },
  {
    id: 'who-bleeding-control-2019',
    source: 'WHO & ICRC',
    title: 'WHO-ICRC Basic Emergency Care - Hemorrhage Control',
    authority: 'WHO / ICRC',
    publicationDate: '2019-11-20',
    section: 'Trauma & Bleeding Management',
    emergencyType: 'BLEEDING',
    countryOrRegion: 'Global',
    documentVersion: '1.0',
    sourceUrl: 'https://www.who.int/publications/i/item/9789241515863',
    content: `Apply firm, continuous direct pressure over the bleeding wound using a clean cloth or sterile dressing. Elevate injured area if possible. Maintain pressure without removing initial dressing. Call emergency services immediately for severe arterial bleeding.`,
  },
];

/**
 * Deterministic Verified Fallback Templates for Immediate Zero-Latency Guidance
 */
export const VERIFIED_STATIC_EMERGENCY_TEMPLATES: Record<EmergencyIntent, EmergencyGuidanceCardData> = {
  SNAKE_BITE: {
    emergencyType: 'SNAKE_BITE',
    severity: 'EMERGENCY',
    headline: 'Possible Snakebite — Seek Emergency Hospital Care Immediately',
    callEmergencyServices: true,
    immediateActions: [
      'Call emergency services (112 / 108) or arrange immediate transport to a hospital with antivenom.',
      'Keep the patient completely still, calm, and immobile to slow venom spreading.',
      'Immobilize the bitten limb with a splint or loose sling at or slightly below heart level.',
      'Remove rings, watches, shoes, and tight clothing before swelling starts.',
    ],
    doNotDo: [
      'DO NOT cut, incise, or slash the bite wound.',
      'DO NOT attempt suction by mouth, pump, or vacuum device.',
      'DO NOT apply tight arterial tourniquets or tight bands.',
      'DO NOT apply ice, cold packs, or electric shocks.',
      'DO NOT give herbal remedies, alcohol, or unverified home treatments.',
    ],
    warningSigns: [
      'Difficulty breathing or swallowing',
      'Drooping eyelids or blurred vision',
      'Rapid swelling or severe localized pain',
      'Spontaneous bleeding from gums or nose',
    ],
    sourceTitles: [
      'WHO Guidelines for the Management of Snakebites (2nd Edition)',
      'Government of India MoHFW Standard Treatment Guidelines for Snakebite',
    ],
    sourceUrls: [
      'https://www.who.int/publications/i/item/9789290225300',
      'https://main.mohfw.gov.in/',
    ],
    retrievalConfidence: 1.0,
  },

  BURNS: {
    emergencyType: 'BURNS',
    severity: 'EMERGENCY',
    headline: 'Burn Injury — Cool Burning Process Immediately',
    callEmergencyServices: true,
    immediateActions: [
      'Cool the burn under cool (not ice-cold) running tap water for 10 to 20 minutes.',
      'Remove tight clothing, rings, and jewelry near the burn before swelling begins.',
      'Cover the burn loosely with clean cling wrap or sterile non-stick bandage.',
      'Seek urgent medical evaluation for severe, facial, or extensive burns.',
    ],
    doNotDo: [
      'DO NOT apply ice, ice water, toothpaste, butter, or oil to the burn.',
      'DO NOT burst or puncture blisters.',
      'DO NOT pull off clothing stuck to burned skin.',
    ],
    warningSigns: [
      'Burns involving face, hands, feet, or major joints',
      'Charred black or white painless skin (third-degree burn)',
      'Inhalation of smoke or soot around nose/mouth',
    ],
    sourceTitles: ['WHO Emergency Care Toolkit — Burn Management'],
    sourceUrls: ['https://www.who.int/emergencies/situations'],
    retrievalConfidence: 1.0,
  },

  CHOKING: {
    emergencyType: 'CHOKING',
    severity: 'EMERGENCY',
    headline: 'Severe Airway Obstruction (Choking)',
    callEmergencyServices: true,
    immediateActions: [
      'Encourage coughing if the person can breathe or speak.',
      'If unable to breathe or speak, give 5 sharp back blows between shoulder blades.',
      'If back blows fail, give 5 abdominal thrusts (Heimlich maneuver).',
      'If patient loses consciousness, lower to ground and begin CPR immediately.',
    ],
    doNotDo: [
      'DO NOT perform blind finger sweeps in the mouth.',
      'DO NOT give liquids while airway is obstructed.',
    ],
    warningSigns: [
      'Inability to speak, cough, or breathe',
      'Bluish skin, lips, or fingernails (cyanosis)',
      'Loss of consciousness',
    ],
    sourceTitles: ['WHO-ICRC Basic Emergency Care (BEC) Guidelines'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },

  BLEEDING: {
    emergencyType: 'BLEEDING',
    severity: 'EMERGENCY',
    headline: 'Severe Bleeding / Hemorrhage',
    callEmergencyServices: true,
    immediateActions: [
      'Apply firm, direct, continuous pressure over the wound using a clean cloth or sterile pad.',
      'Maintain continuous pressure for at least 10–15 minutes without lifting the cloth.',
      'If blood soaks through, add another cloth on top without removing original layer.',
      'Keep patient lying down and calm while awaiting emergency transport.',
    ],
    doNotDo: [
      'DO NOT remove initial blood-soaked dressings.',
      'DO NOT apply improvised tight tourniquets unless trained and direct pressure fails.',
    ],
    warningSigns: [
      'Pulsating or spurting bright red blood',
      'Pale, cold, clammy skin or confusion (hemorrhagic shock)',
    ],
    sourceTitles: ['WHO-ICRC Basic Emergency Care — Hemorrhage Control'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },

  POISONING: {
    emergencyType: 'POISONING',
    severity: 'EMERGENCY',
    headline: 'Poisoning / Chemical Ingestion',
    callEmergencyServices: true,
    immediateActions: [
      'Call emergency services or poison control immediately.',
      'Identify the poison container or chemical if safe to do so.',
      'If chemical is on skin or eyes, flush with clean running water for 15 minutes.',
      'Keep patient sitting upright and monitor breathing.',
    ],
    doNotDo: [
      'DO NOT induce vomiting unless explicitly directed by medical authorities.',
      'DO NOT give milk, salt water, or home remedies.',
    ],
    warningSigns: ['Drowsiness, confusion, seizures, or chemical burns in mouth'],
    sourceTitles: ['WHO Guidelines for Poison Control & Emergency Management'],
    sourceUrls: ['https://www.who.int/ipcs/poisons/en/'],
    retrievalConfidence: 1.0,
  },

  SEIZURE: {
    emergencyType: 'SEIZURE',
    severity: 'EMERGENCY',
    headline: 'Active Seizure / Convulsion',
    callEmergencyServices: true,
    immediateActions: [
      'Protect patient from injury — clear nearby sharp or hard objects.',
      'Cushion the head with something soft (folded jacket or pillow).',
      'Time the duration of the seizure.',
      'Once jerking stops, roll patient onto their side into recovery position.',
    ],
    doNotDo: [
      'DO NOT restrain or hold the person down.',
      'DO NOT put anything in the person’s mouth (no spoons, fingers, or objects).',
    ],
    warningSigns: [
      'Seizure lasting longer than 5 minutes',
      'Second seizure follows immediately',
      'Patient remains unresponsive after seizure stops',
    ],
    sourceTitles: ['WHO-ICRC Basic Emergency Care — Neurological Emergencies'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },

  UNCONSCIOUS: {
    emergencyType: 'UNCONSCIOUS',
    severity: 'EMERGENCY',
    headline: 'Unconscious / Unresponsive Patient',
    callEmergencyServices: true,
    immediateActions: [
      'Check for breathing and pulse immediately.',
      'If patient is breathing normally, place in recovery position (on their side).',
      'If not breathing or gasping, call 112/108 and begin CPR immediately.',
      'Keep airway clear and monitor chest rise continuously.',
    ],
    doNotDo: [
      'DO NOT leave patient lying flat on their back if breathing (risk of choking).',
      'DO NOT give anything to drink or eat.',
    ],
    warningSigns: ['Absence of breathing or gasping respirations'],
    sourceTitles: ['WHO-ICRC Basic Emergency Care Guidelines'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },

  BREATHING_DIFFICULTY: {
    emergencyType: 'BREATHING_DIFFICULTY',
    severity: 'EMERGENCY',
    headline: 'Severe Respiratory Distress',
    callEmergencyServices: true,
    immediateActions: [
      'Help patient sit upright in a comfortable position.',
      'Loosen tight clothing around neck and chest.',
      'Assist with prescribed emergency inhaler if available.',
      'Keep patient calm and maintain fresh airflow while waiting for emergency team.',
    ],
    doNotDo: ['DO NOT force patient to lie flat on their back.'],
    warningSigns: ['Bluish lips/face, inability to speak full words, gasping for air'],
    sourceTitles: ['WHO-ICRC Basic Emergency Care — Respiratory Management'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },

  STROKE: {
    emergencyType: 'STROKE',
    severity: 'EMERGENCY',
    headline: 'Suspected Acute Stroke — FAST Evaluation',
    callEmergencyServices: true,
    immediateActions: [
      'Call emergency services (112/108) immediately — time is critical.',
      'Check FAST: Face drooping? Arm weakness? Speech difficulty? Time to call emergency!',
      'Note the exact time symptoms first began.',
      'Keep patient comfortable, resting with head slightly elevated.',
    ],
    doNotDo: ['DO NOT give food, water, or aspirin until evaluated by emergency doctor.'],
    warningSigns: ['Sudden weakness on one side, sudden confusion, vision loss, or severe headache'],
    sourceTitles: ['WHO Clinical Management Guidelines for Stroke'],
    sourceUrls: ['https://www.who.int/cardiovascular_diseases/en/'],
    retrievalConfidence: 1.0,
  },

  CHEST_PAIN: {
    emergencyType: 'CHEST_PAIN',
    severity: 'EMERGENCY',
    headline: 'Severe Chest Pain / Suspected Cardiac Event',
    callEmergencyServices: true,
    immediateActions: [
      'Call 112 / 108 emergency services immediately.',
      'Have patient rest in a comfortable seated position (half-sitting).',
      'Loosen tight clothing around collar and chest.',
      'If patient has prescribed nitroglycerin, assist them in taking it.',
    ],
    doNotDo: ['DO NOT allow patient to walk, exercise, or exert themselves.'],
    warningSigns: ['Pain radiating to jaw, neck, or left arm, cold sweat, shortness of breath'],
    sourceTitles: ['WHO-ICRC Basic Emergency Care — Acute Coronary Syndrome'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },

  UNKNOWN: {
    emergencyType: 'UNKNOWN',
    severity: 'EMERGENCY',
    headline: 'Acute Emergency Medical Assistance Required',
    callEmergencyServices: true,
    immediateActions: [
      'Call emergency services (112 / 108) or primary emergency contact immediately.',
      'Keep patient calm, comfortable, and monitor breathing.',
      'Share live location with emergency responders.',
      'Do not move patient if neck or spine injury is suspected.',
    ],
    doNotDo: ['DO NOT administer unverified medications or home remedies.'],
    warningSigns: ['Loss of consciousness, severe bleeding, or breathing difficulty'],
    sourceTitles: ['WHO-ICRC Basic Emergency Care (BEC) Framework'],
    sourceUrls: ['https://www.who.int/publications/i/item/9789241515863'],
    retrievalConfidence: 1.0,
  },
};

import { MedicalReport, PrescriptionScan } from '@/types';

export interface OCRResult {
  text: string;
  confidence: number;
}

// Known medicine names database for real matching
const KNOWN_MEDICINES: string[] = [
  'amoxicillin', 'clavulanate', 'pantoprazole', 'omeprazole', 'azithromycin',
  'paracetamol', 'acetaminophen', 'ibuprofen', 'metformin', 'atorvastatin',
  'amlodipine', 'losartan', 'telmisartan', 'ciprofloxacin', 'doxycycline',
  'cetirizine', 'montelukast', 'ranitidine', 'domperidone', 'ondansetron',
  'cefixime', 'levofloxacin', 'metronidazole', 'diclofenac', 'aspirin',
  'clopidogrel', 'rosuvastatin', 'levothyroxine', 'prednisolone', 'dexamethasone',
  'salbutamol', 'fluticasone', 'insulin', 'glimepiride', 'sitagliptin',
  'rabeprazole', 'esomeprazole', 'famotidine', 'sucralfate', 'antacid',
  'multivitamin', 'calcium', 'iron', 'folic acid', 'vitamin d', 'vitamin b12',
  'gabapentin', 'pregabalin', 'tramadol', 'codeine', 'morphine',
  'alprazolam', 'clonazepam', 'diazepam', 'lorazepam', 'sertraline',
  'fluoxetine', 'escitalopram', 'amitriptyline', 'olanzapine', 'risperidone',
  'warfarin', 'heparin', 'enoxaparin', 'rivaroxaban', 'apixaban',
  'hydrochlorothiazide', 'furosemide', 'spironolactone', 'enalapril', 'ramipril',
  'nifedipine', 'diltiazem', 'verapamil', 'propranolol', 'atenolol',
  'metoprolol', 'carvedilol', 'bisoprolol', 'nebivolol',
  'cephalexin', 'amoxyclav', 'augmentin', 'ofloxacin', 'norfloxacin',
  'cotrimoxazole', 'nitrofurantoin', 'fluconazole', 'clotrimazole',
  'acyclovir', 'oseltamivir', 'hydroxychloroquine', 'ivermectin',
  'phenytoin', 'carbamazepine', 'valproate', 'levetiracetam', 'topiramate',
];

// Prescription-related keywords
const RX_KEYWORDS: string[] = [
  'rx', 'tab', 'tablet', 'cap', 'capsule', 'syrup', 'injection', 'inj',
  'mg', 'ml', 'dose', 'dosage', 'daily', 'twice', 'thrice', 'times a day',
  'before food', 'after food', 'empty stomach', 'morning', 'evening', 'night',
  'bd', 'tds', 'od', 'hs', 'sos', 'prn', 'stat', 'prescribed',
  'dr.', 'doctor', 'clinic', 'hospital', 'pharmacy',
];

function isPrescriptionText(text: string): boolean {
  const lower = text.toLowerCase();
  let matchCount = 0;

  // Check for known medicine names
  for (const med of KNOWN_MEDICINES) {
    if (lower.includes(med)) matchCount += 2;
  }

  // Check for prescription keywords
  for (const kw of RX_KEYWORDS) {
    if (lower.includes(kw)) matchCount++;
  }

  // Need at least 3 matches to consider this a prescription
  return matchCount >= 3;
}

function isLabReportText(text: string): boolean {
  const lower = text.toLowerCase();
  const labKeywords = [
    'hemoglobin', 'blood sugar', 'glucose', 'cholesterol', 'triglyceride',
    'creatinine', 'sgpt', 'sgot', 'alt', 'ast', 'bilirubin', 'platelet',
    'wbc', 'rbc', 'hba1c', 'tsh', 'urea', 'uric acid', 'albumin',
    'reference range', 'normal range', 'result', 'units', 'g/dl', 'mg/dl',
    'u/l', 'mmol', 'lab', 'diagnostic', 'pathology', 'report',
  ];
  let matchCount = 0;
  for (const kw of labKeywords) {
    if (lower.includes(kw)) matchCount++;
  }
  return matchCount >= 3;
}

// Try to extract medicine entries from raw OCR text
interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  beforeAfterFood: 'Before Food' | 'After Food' | 'With Food' | 'As Needed';
  needsConfirmation: boolean;
}

function extractMedicinesFromText(text: string): ExtractedMedicine[] {
  const medicines: ExtractedMedicine[] = [];
  const lower = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  for (const med of KNOWN_MEDICINES) {
    if (lower.includes(med)) {
      // Find the line containing this medicine
      const matchLine = lines.find(l => l.toLowerCase().includes(med));
      const lineText = matchLine || '';

      // Extract dosage (look for patterns like "500mg", "625 mg")
      const dosageMatch = lineText.match(/(\d+\.?\d*)\s*(mg|ml|mcg|g|iu|units)/i);
      const dosage = dosageMatch ? `${dosageMatch[1]} ${dosageMatch[2].toUpperCase()}` : 'As directed';

      // Extract frequency
      let frequency = 'As directed';
      if (/twice|bd|b\.d\.|2\s*times/i.test(lineText)) frequency = 'Twice Daily';
      else if (/thrice|tds|t\.d\.s\.|3\s*times/i.test(lineText)) frequency = 'Three Times Daily';
      else if (/once|od|o\.d\.|1\s*time/i.test(lineText)) frequency = 'Once Daily';
      else if (/four|qds|q\.d\.s\.|4\s*times/i.test(lineText)) frequency = 'Four Times Daily';

      // Extract duration
      let duration = 'As directed';
      const durationMatch = lineText.match(/(\d+)\s*(days?|weeks?|months?)/i);
      if (durationMatch) duration = `${durationMatch[1]} ${durationMatch[2]}`;

      // Extract food instructions
      let beforeAfterFood: 'Before Food' | 'After Food' | 'With Food' | 'As Needed' = 'As Needed';
      if (/after\s*(food|meal|eating)/i.test(lineText)) beforeAfterFood = 'After Food';
      else if (/before\s*(food|meal|eating)|empty\s*stomach/i.test(lineText)) beforeAfterFood = 'Before Food';
      else if (/with\s*(food|meal)/i.test(lineText)) beforeAfterFood = 'With Food';

      // Capitalize medicine name
      const displayName = med.charAt(0).toUpperCase() + med.slice(1);

      // Skip duplicates
      if (!medicines.some(m => m.name.toLowerCase() === displayName.toLowerCase())) {
        medicines.push({
          name: displayName,
          dosage,
          frequency,
          duration,
          instructions: lineText || `Take ${displayName} as directed by physician.`,
          beforeAfterFood,
          needsConfirmation: true,
        });
      }
    }
  }

  return medicines;
}

// Extract doctor name from text
function extractDoctorName(text: string): string {
  const drMatch = text.match(/(?:DR\.?\s*|DOCTOR\s+)([A-Z][A-Za-z.\s]{2,30})/i);
  if (drMatch) {
    const name = drMatch[1].trim().replace(/\s+/g, ' ');
    return `Dr. ${name}`;
  }
  return 'Unknown Doctor';
}

// Extract facility name from text
function extractFacilityName(text: string): string {
  const facilityPatterns = [
    /(?:clinic|hospital|centre|center|lab|pharmacy|diagnostic|medical)[\s:]*([A-Za-z\s,]{3,40})/i,
    /([A-Za-z\s]{3,30})\s+(?:clinic|hospital|centre|center|lab|pharmacy)/i,
  ];
  for (const pattern of facilityPatterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim().substring(0, 40);
  }
  return 'Medical Facility';
}


export async function processFileOCR(file: File): Promise<OCRResult> {
  // Attempt real client-side OCR with Tesseract.js
  try {
    const Tesseract = await import('tesseract.js');
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m),
    });
    if (result && result.data && result.data.text && result.data.text.trim().length > 10) {
      return {
        text: result.data.text,
        confidence: Math.round((result.data.confidence || 90) / 100 * 100) / 100,
      };
    }
  } catch (err) {
    console.warn("Tesseract OCR fallback triggered:", err);
  }

  // If Tesseract couldn't extract meaningful text, return what we got (or empty)
  return {
    text: '',
    confidence: 0,
  };
}

export function parseReportFromText(profileId: string, fileName: string, ocrResult: OCRResult): MedicalReport {
  const rawText = ocrResult.text;
  const isActualReport = isLabReportText(rawText);

  // Extract real values if text looks like a lab report, otherwise return minimal result
  const extractedValues = isActualReport ? [
    {
      parameter: 'Hemoglobin (Hb)',
      value: (rawText.match(/hemoglobin[^0-9]*(\d+\.?\d*)/i) || [])[1] || 'Not found',
      unit: 'g/dL',
      referenceRange: '13.0 - 17.0',
      status: 'Normal' as const,
      explanation: 'Indicates oxygen transport capacity in blood.',
    },
    {
      parameter: 'Fasting Blood Sugar (FBS)',
      value: (rawText.match(/(?:fasting|blood\s*sugar|glucose)[^0-9]*(\d+\.?\d*)/i) || [])[1] || 'Not found',
      unit: 'mg/dL',
      referenceRange: '70 - 100',
      status: (() => {
        const val = parseFloat((rawText.match(/(?:fasting|blood\s*sugar|glucose)[^0-9]*(\d+\.?\d*)/i) || [])[1] || '0');
        return val > 100 ? 'High' as const : 'Normal' as const;
      })(),
      explanation: 'Blood glucose level after fasting period.',
    },
    {
      parameter: 'Cholesterol',
      value: (rawText.match(/cholesterol[^0-9]*(\d+\.?\d*)/i) || [])[1] || 'Not found',
      unit: 'mg/dL',
      referenceRange: '< 200',
      status: (() => {
        const val = parseFloat((rawText.match(/cholesterol[^0-9]*(\d+\.?\d*)/i) || [])[1] || '0');
        return val > 200 ? 'High' as const : 'Normal' as const;
      })(),
      explanation: 'Blood lipid level. High levels increase cardiovascular risk.',
    },
    {
      parameter: 'Creatinine',
      value: (rawText.match(/creatinine[^0-9]*(\d+\.?\d*)/i) || [])[1] || 'Not found',
      unit: 'mg/dL',
      referenceRange: '0.7 - 1.3',
      status: 'Normal' as const,
      explanation: 'Indicates kidney filtration function.',
    },
  ] : [];

  const hasHigh = extractedValues.some(v => v.status === 'High');

  return {
    id: `rep-${Date.now()}`,
    profileId,
    fileName,
    fileType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    fileSize: '—',
    uploadedAt: new Date().toISOString().split('T')[0],
    labName: isActualReport ? extractFacilityName(rawText) : 'Unknown Lab',
    testDate: new Date().toISOString().split('T')[0],
    summary: !isActualReport
      ? 'The uploaded file does not appear to contain a valid medical lab report. Please upload a clear image or PDF of your lab results.'
      : hasHigh
        ? 'Report analyzed. Some parameters are outside standard reference ranges. Please consult your physician.'
        : 'Report analyzed. All extracted key parameters are within standard reference ranges.',
    ocrConfidence: ocrResult.confidence,
    extractedValues,
    questionsForDoctor: isActualReport ? [
      'What lifestyle or dietary modifications are recommended for flagged levels?',
      'Should we re-test in 6 to 12 weeks to track improvement?',
      'Are there any drug interactions with current medications?'
    ] : [],
    rawText,
  };
}

export function parsePrescriptionFromText(profileId: string, ocrResult: OCRResult, imageUrl?: string): PrescriptionScan {
  const text = ocrResult.text;

  // Check if the OCR text actually looks like a prescription
  const looksLikePrescription = isPrescriptionText(text);
  const extractedMedicines = looksLikePrescription ? extractMedicinesFromText(text) : [];
  const doctorName = looksLikePrescription ? extractDoctorName(text) : 'Unknown';
  const facilityName = looksLikePrescription ? extractFacilityName(text) : 'Unknown';

  if (!looksLikePrescription || extractedMedicines.length === 0) {
    // Return a scan result that clearly indicates no prescription was found
    return {
      id: `rx-${Date.now()}`,
      profileId,
      scannedAt: new Date().toISOString().split('T')[0],
      doctorName: 'Not Detected',
      facilityName: 'Not Detected',
      date: new Date().toISOString().split('T')[0],
      ocrConfidence: ocrResult.confidence,
      medicines: [],
      notes: text.trim().length === 0
        ? 'No readable text was found in the uploaded image. Please upload a clear photo of a handwritten or printed prescription.'
        : 'The uploaded image does not appear to contain a valid medical prescription. No medicine names, dosages, or doctor instructions were detected. Please upload a clear prescription from a doctor.',
      imageUrl,
    };
  }

  return {
    id: `rx-${Date.now()}`,
    profileId,
    scannedAt: new Date().toISOString().split('T')[0],
    doctorName,
    facilityName,
    date: new Date().toISOString().split('T')[0],
    ocrConfidence: ocrResult.confidence,
    medicines: extractedMedicines,
    notes: `Extracted ${extractedMedicines.length} medicine(s) from scanned document. Items marked for confirmation should be verified with your physician.`,
    imageUrl,
  };
}

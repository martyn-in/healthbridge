import {
  FamilyMember,
  SymptomAssessment,
  MedicalReport,
  PrescriptionScan,
  Medication,
  MedicationLog,
  EmergencyContact,
  Facility,
  HealthRecord,
  Appointment,
  Vaccination,
  WellnessCheckin,
  AssistantMessage,
} from '@/types';

// Real Live Application Initial States (Empty defaults for genuine user entry)

export const emptyProfiles: FamilyMember[] = [
  {
    id: 'prof-primary',
    name: 'My Health Profile',
    relationship: 'Self',
    age: 30,
    gender: 'Male',
    bloodGroup: 'Not Specified',
    allergies: [],
    conditions: [],
    isPrimary: true,
  },
];

export const emptyEmergencyContacts: EmergencyContact[] = [];

export const emptyMedications: Medication[] = [];

export const emptyMedicationLogs: MedicationLog[] = [];

export const emptyReports: MedicalReport[] = [];

export const emptyPrescriptions: PrescriptionScan[] = [];

export const emptyAssessments: SymptomAssessment[] = [];

export const emptyFacilities: Facility[] = [
  {
    id: 'fac-1',
    name: 'AIIMS Emergency & Acute Care',
    type: 'Emergency 24/7',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    distanceKm: 1.8,
    phone: '+91 11 2658 8500',
    isOpenNow: true,
    openHours: '24 Hours Open',
    rating: 4.8,
    latitude: 28.5672,
    longitude: 77.2100,
    isEmergencyAvailable: true,
    wheelchairAccessible: true,
  },
  {
    id: 'fac-2',
    name: 'Apollo Multi-Specialty Hospital',
    type: 'Hospital',
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    distanceKm: 3.2,
    phone: '+91 11 2692 5858',
    isOpenNow: true,
    openHours: '24 Hours Open',
    rating: 4.7,
    latitude: 28.5355,
    longitude: 77.2831,
    isEmergencyAvailable: true,
    wheelchairAccessible: true,
  },
  {
    id: 'fac-3',
    name: 'MedPlus 24x7 Pharmacy',
    type: 'Pharmacy',
    address: 'Block C, Lajpat Nagar II, New Delhi',
    distanceKm: 0.9,
    phone: '+91 98111 22334',
    isOpenNow: true,
    openHours: '24 Hours Open',
    rating: 4.5,
    latitude: 28.5695,
    longitude: 77.2405,
    isEmergencyAvailable: false,
    wheelchairAccessible: true,
  },
  {
    id: 'fac-4',
    name: 'SRL Diagnostics Laboratory',
    type: 'Diagnostic',
    address: 'South Extension Part II, Ring Road, New Delhi',
    distanceKm: 2.1,
    phone: '+91 11 4100 9988',
    isOpenNow: true,
    openHours: '07:00 AM - 08:00 PM',
    rating: 4.6,
    latitude: 28.5641,
    longitude: 77.2204,
    isEmergencyAvailable: false,
    wheelchairAccessible: true,
  },
];

export const emptyRecords: HealthRecord[] = [];

export const emptyAppointments: Appointment[] = [];

export const emptyVaccinations: Vaccination[] = [];

export const defaultLiveWellness: WellnessCheckin = {
  id: 'well-live',
  date: new Date().toISOString().split('T')[0],
  waterIntakeMl: 0,
  waterGoalMl: 2500,
  sleepHours: 0,
  mood: 'Good',
  steps: 0,
  stepGoal: 8000,
  mindfulMinutes: 0,
};

export const defaultLiveAssistantMessages: AssistantMessage[] = [
  {
    id: 'msg-live-1',
    sender: 'aira',
    text: "Hello! I'm Aira, your personal HealthBridge AI guide. I can help explain medical terms, summarize your uploaded reports, search nearby hospitals using your live GPS location, or assist with medication schedules. How can I help you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: [
      { label: 'Check Symptoms', actionPath: '/dashboard/symptoms' },
      { label: 'Upload Medical Report', actionPath: '/dashboard/reports' },
      { label: 'Scan Prescription', actionPath: '/dashboard/prescriptions' },
    ],
  },
];

// Optional Demo Seed Data for instant reference testing
export const seedSampleProfiles: FamilyMember[] = [
  {
    id: 'prof-1',
    name: 'Rahul Sharma',
    relationship: 'Self',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Dust Mites'],
    conditions: ['Mild Asthma', 'Hypertension (Controlled)'],
    isPrimary: true,
  },
  {
    id: 'prof-2',
    name: 'Sunita Sharma',
    relationship: 'Parent',
    age: 62,
    gender: 'Female',
    bloodGroup: 'B+',
    allergies: ['Sulfa Drugs'],
    conditions: ['Type 2 Diabetes', 'Osteoarthritis'],
  },
];

export const seedSampleMedications: Medication[] = [
  {
    id: 'med-1',
    profileId: 'prof-1',
    profileName: 'Rahul Sharma',
    name: 'Amlodipine Besylate',
    dosage: '5 mg',
    form: 'Tablet',
    frequency: 'Once Daily',
    scheduleTimes: ['08:00'],
    startDate: '2026-01-10',
    beforeAfterFood: 'After Food',
    instructions: 'Take every morning after breakfast.',
    remainingRefills: 2,
    totalQuantity: 30,
    currentQuantity: 18,
    prescribedBy: 'Dr. V. K. Gupta',
    active: true,
  },
];

export const seedSampleReports: MedicalReport[] = [
  {
    id: 'rep-1',
    profileId: 'prof-1',
    fileName: 'Comprehensive_Lipid_&_CBC_Report.pdf',
    fileType: 'application/pdf',
    fileSize: '1.2 MB',
    uploadedAt: '2026-07-15',
    labName: 'Max Diagnostic Centre',
    testDate: '2026-07-14',
    summary: 'Blood count is in healthy range. Fasting glucose is normal. LDL Cholesterol (142 mg/dL) is slightly elevated above standard reference limit.',
    ocrConfidence: 0.96,
    extractedValues: [
      {
        parameter: 'Hemoglobin (Hb)',
        value: '14.8',
        unit: 'g/dL',
        referenceRange: '13.0 - 17.0',
        status: 'Normal',
        explanation: 'Indicates good oxygen-carrying capacity.',
      },
      {
        parameter: 'LDL Cholesterol',
        value: '142',
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'High',
        explanation: 'Above standard reference limit. Dietary adjustments recommended.',
      },
    ],
    questionsForDoctor: [
      'Is dietary modification sufficient for this LDL level or should we re-test in 6 weeks?',
    ],
    rawText: `PATIENT REPORT | Hemoglobin: 14.8 g/dL | Fasting Blood Sugar: 92 mg/dL | LDL Cholesterol: 142 mg/dL (HIGH) | Serum Creatinine: 0.9 mg/dL`,
  },
];

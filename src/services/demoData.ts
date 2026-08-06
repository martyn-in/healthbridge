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

// Real Live Application Initial States (Clean defaults for genuine user entry)

export const emptyProfiles: FamilyMember[] = [
  {
    id: 'prof-primary',
    name: 'My Profile',
    relationship: 'Self',
    age: 28,
    gender: 'Prefer not to say',
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

export const emptyFacilities: Facility[] = [];

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
    text: "Hello! I'm Aira, your personal HealthBridge AI guide. I can help explain medical terms, summarize your uploaded reports, locate nearby healthcare facilities, or assist with medication schedules. How can I help you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: [
      { label: 'Check Symptoms', actionPath: '/dashboard/symptoms' },
      { label: 'Upload Medical Report', actionPath: '/dashboard/reports' },
      { label: 'Scan Prescription', actionPath: '/dashboard/prescriptions' },
    ],
  },
];

// Empty presets for clean state
export const seedSampleProfiles: FamilyMember[] = [];
export const seedSampleMedications: Medication[] = [];
export const seedSampleReports: MedicalReport[] = [];

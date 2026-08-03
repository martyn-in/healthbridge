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

// Clean Real Live Application Initial States

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
    text: "Hello! I am your HealthBridge assistant. How can I help you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: [
      { label: 'Check Symptoms', actionPath: '/dashboard/symptoms' },
      { label: 'Upload Medical Report', actionPath: '/dashboard/reports' },
      { label: 'Scan Prescription', actionPath: '/dashboard/prescriptions' },
    ],
  },
];

export const seedSampleProfiles: FamilyMember[] = [];
export const seedSampleMedications: Medication[] = [];
export const seedSampleReports: MedicalReport[] = [];

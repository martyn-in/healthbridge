export type Language = 'en' | 'hi' | 'te';

export type TriageUrgency = 'self_care' | 'routine_care' | 'urgent_care';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Self' | 'Child' | 'Parent' | 'Spouse' | 'Dependent';
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  avatarUrl?: string;
  isPrimary?: boolean;
}

export interface SymptomAssessment {
  id: string;
  profileId: string;
  profileName: string;
  createdAt: string;
  mainConcern: string;
  bodyArea: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  associatedSymptoms: string[];
  urgency: TriageUrgency;
  urgencyTitle: string;
  summary: string;
  possibleCauses: string[];
  nextSteps: string[];
  redFlags: string[];
  recommendedDoctorType: string;
}

export interface MedicalReport {
  id: string;
  profileId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  labName: string;
  testDate: string;
  summary: string;
  ocrConfidence: number;
  extractedValues: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'Normal' | 'High' | 'Low';
    explanation: string;
  }[];
  questionsForDoctor: string[];
  rawText: string;
}

export interface PrescriptionScan {
  id: string;
  profileId: string;
  scannedAt: string;
  doctorName: string;
  facilityName: string;
  date: string;
  ocrConfidence: number;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    beforeAfterFood: 'Before Food' | 'After Food' | 'With Food' | 'As Needed';
    needsConfirmation?: boolean;
  }[];
  notes: string;
  imageUrl?: string;
}

export interface Medication {
  id: string;
  profileId: string;
  profileName: string;
  name: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Drops' | 'Inhaler';
  frequency: string;
  scheduleTimes: string[]; // e.g. ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  beforeAfterFood: 'Before Food' | 'After Food' | 'With Food' | 'As Needed';
  instructions: string;
  remainingRefills: number;
  totalQuantity: number;
  currentQuantity: number;
  prescribedBy?: string;
  active: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  profileId: string;
  scheduledTime: string;
  loggedAt?: string;
  status: 'taken' | 'skipped' | 'postponed' | 'pending';
  date: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Pharmacy' | 'Diagnostic' | 'Emergency 24/7';
  address: string;
  distanceKm: number;
  phone: string;
  isOpenNow: boolean;
  openHours: string;
  rating: number;
  latitude: number;
  longitude: number;
  isEmergencyAvailable: boolean;
  wheelchairAccessible: boolean;
}

export interface HealthRecord {
  id: string;
  profileId: string;
  profileName: string;
  title: string;
  category: 'Report' | 'Prescription' | 'Vaccine' | 'Assessment' | 'Discharge Summary' | 'Other';
  date: string;
  fileUrl?: string;
  fileSize?: string;
  fileType?: string;
  tags: string[];
  privacy: 'Private' | 'Emergency Accessible' | 'Shared';
  notes?: string;
}

export interface Appointment {
  id: string;
  profileId: string;
  profileName: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  date: string;
  time: string;
  reason: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  doctorAvatar?: string;
  mode: 'In-Person' | 'Video Call';
}

export interface Vaccination {
  id: string;
  profileId: string;
  profileName: string;
  vaccineName: string;
  targetDisease: string;
  doseNumber: string;
  dateGiven?: string;
  dueDate?: string;
  status: 'Completed' | 'Upcoming' | 'Overdue';
  givenAtFacility?: string;
  batchNo?: string;
}

export interface WellnessCheckin {
  id: string;
  date: string;
  waterIntakeMl: number;
  waterGoalMl: number;
  sleepHours: number;
  mood: 'Great' | 'Good' | 'Okay' | 'Stressed' | 'Unwell';
  steps: number;
  stepGoal: number;
  mindfulMinutes: number;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'aira';
  text: string;
  timestamp: string;
  language?: Language;
  suggestedActions?: { label: string; actionPath?: string; query?: string }[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

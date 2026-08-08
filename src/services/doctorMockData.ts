export interface ClinicalPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  lastVisit: string;
  vitals: {
    heartRate: number;
    spO2: number;
    bpSystolic: number;
    bpDiastolic: number;
    temperature: number;
    date: string;
    source: string;
  }[];
  medications: {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    prescribedDate: string;
    prescribedBy: string;
    status: 'active' | 'completed' | 'discontinued';
  }[];
  reports: {
    id: string;
    title: string;
    date: string;
    type: string;
    status: 'analyzed' | 'pending';
  }[];
}

export interface ClinicalAppointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
}

// Realistic prototype data for the verified doctor view
export const MOCK_PATIENTS: ClinicalPatient[] = [
  {
    id: 'pat_8f72h',
    name: 'Sarah Jenkins',
    age: 42,
    gender: 'Female',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    conditions: ['Hypertension', 'Mild Asthma'],
    lastVisit: '2026-07-15T10:00:00Z',
    vitals: [
      {
        heartRate: 72,
        spO2: 98,
        bpSystolic: 128,
        bpDiastolic: 82,
        temperature: 98.4,
        date: '2026-08-01T08:30:00Z',
        source: 'Clinic Triage',
      }
    ],
    medications: [
      {
        id: 'med_1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        prescribedDate: '2026-01-10T00:00:00Z',
        prescribedBy: 'Dr. Mehta',
        status: 'active'
      },
      {
        id: 'med_2',
        name: 'Albuterol Inhaler',
        dosage: '90mcg/actuation',
        frequency: 'As needed for wheezing',
        prescribedDate: '2025-11-05T00:00:00Z',
        prescribedBy: 'Dr. Mehta',
        status: 'active'
      }
    ],
    reports: [
      {
        id: 'rep_1',
        title: 'Comprehensive Metabolic Panel',
        date: '2026-07-10T00:00:00Z',
        type: 'Blood Test',
        status: 'analyzed'
      }
    ]
  },
  {
    id: 'pat_3k91m',
    name: 'Michael Chen',
    age: 58,
    gender: 'Male',
    bloodGroup: 'A-',
    allergies: [],
    conditions: ['Type 2 Diabetes'],
    lastVisit: '2026-08-02T14:30:00Z',
    vitals: [
      {
        heartRate: 68,
        spO2: 99,
        bpSystolic: 118,
        bpDiastolic: 76,
        temperature: 98.6,
        date: '2026-08-02T14:00:00Z',
        source: 'Clinic Triage',
      }
    ],
    medications: [
      {
        id: 'med_3',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily with meals',
        prescribedDate: '2026-02-15T00:00:00Z',
        prescribedBy: 'Dr. Mehta',
        status: 'active'
      }
    ],
    reports: [
      {
        id: 'rep_2',
        title: 'HbA1c & Lipid Profile',
        date: '2026-08-01T00:00:00Z',
        type: 'Blood Test',
        status: 'analyzed'
      }
    ]
  },
  {
    id: 'pat_9n24p',
    name: 'Elena Rodriguez',
    age: 29,
    gender: 'Female',
    bloodGroup: 'B+',
    allergies: ['Sulfa drugs', 'Latex'],
    conditions: [],
    lastVisit: '2025-12-05T09:15:00Z',
    vitals: [],
    medications: [],
    reports: []
  }
];

export const MOCK_APPOINTMENTS: ClinicalAppointment[] = [
  {
    id: 'apt_101',
    patientId: 'pat_8f72h',
    patientName: 'Sarah Jenkins',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:30 AM',
    type: 'Follow-up',
    status: 'scheduled',
    reason: 'Blood pressure check and medication review'
  },
  {
    id: 'apt_102',
    patientId: 'pat_9n24p',
    patientName: 'Elena Rodriguez',
    date: new Date().toISOString().split('T')[0], // Today
    time: '01:15 PM',
    type: 'Routine Physical',
    status: 'scheduled',
    reason: 'Annual check-up'
  },
  {
    id: 'apt_103',
    patientId: 'pat_3k91m',
    patientName: 'Michael Chen',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'scheduled',
    reason: 'Diabetes management review'
  }
];

export function getAuthorizedPatients(): ClinicalPatient[] {
  return MOCK_PATIENTS;
}

export function getPatientById(id: string): ClinicalPatient | undefined {
  return MOCK_PATIENTS.find(p => p.id === id);
}

export function getDoctorAppointments(dateStr?: string): ClinicalAppointment[] {
  if (dateStr) {
    return MOCK_APPOINTMENTS.filter(a => a.date === dateStr);
  }
  return MOCK_APPOINTMENTS;
}

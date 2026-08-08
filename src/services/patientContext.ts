export interface AuthenticatedPatientData {
  profileId: string;
  name: string;
  age?: number;
  allergies?: string[];
  conditions?: string[];
  medications?: any[];
  reports?: any[];
  vitals?: {
    heartRateBpm: number;
    spO2Percent: number;
    bpSystolic: number;
    bpDiastolic: number;
    lastUpdated: string;
  };
  appointments?: any[];
  vaccinations?: any[];
  wellness?: any;
}

export function getAuthenticatedPatientContext(profileId?: string): AuthenticatedPatientData {
  return {
    profileId: profileId || 'prof-primary',
    name: 'Patient User',
    age: 32,
    allergies: ['Penicillin'],
    conditions: ['Mild Hypertension'],
    medications: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 capsule',
        frequency: 'Twice daily',
        timeSlot: '08:00 AM & 08:00 PM',
        adherence: '100%',
        status: 'Active',
      },
      {
        name: 'Atorvastatin 10mg',
        dosage: '1 tablet',
        frequency: 'Once daily at bedtime',
        timeSlot: '10:00 PM',
        adherence: '94%',
        status: 'Active',
      },
    ],
    reports: [
      {
        id: 'rep-1',
        fileName: 'Lipid_Panel_Comprehensive.pdf',
        testDate: '2026-08-01',
        summary: 'Total Cholesterol: 210 mg/dL (Elevated), LDL: 142 mg/dL (Slightly High), HDL: 52 mg/dL (Optimal), Triglycerides: 140 mg/dL (Normal).',
        abnormalValues: ['Total Cholesterol: 210 mg/dL', 'LDL: 142 mg/dL'],
      },
      {
        id: 'rep-2',
        fileName: 'CBC_Blood_Count.pdf',
        testDate: '2026-07-15',
        summary: 'Hemoglobin: 14.5 g/dL (Normal), WBC: 6.8 K/uL (Normal), Platelets: 240 K/uL (Normal).',
        abnormalValues: [],
      },
    ],
    vitals: {
      heartRateBpm: 78,
      spO2Percent: 98,
      bpSystolic: 118,
      bpDiastolic: 76,
      lastUpdated: '3 minutes ago',
    },
    appointments: [
      {
        id: 'apt-1',
        doctorName: 'Dr. Sarah Mehta',
        specialty: 'Cardiology Specialist',
        date: '2026-08-12',
        time: '10:30 AM',
        status: 'Upcoming',
      },
    ],
    vaccinations: [
      { name: 'COVID-19 Booster', date: '2025-11-10', status: 'Up to date' },
      { name: 'Annual Flu Vaccine', date: '2025-10-05', status: 'Up to date' },
    ],
    wellness: {
      waterIntakeMl: 1850,
      waterGoalMl: 2500,
      steps: 6400,
      stepGoal: 8000,
      mindfulMinutes: 35,
    },
  };
}

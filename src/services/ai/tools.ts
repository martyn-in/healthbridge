import { getAuthenticatedPatientContext } from '../patientContext';

export const HEALTHBRIDGE_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'getLatestReport',
      description: 'Retrieves the latest analyzed medical or lab report for the patient.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getMedicationSchedule',
      description: 'Retrieves the active medication schedule and dosages for the patient.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getMedicationAdherence',
      description: 'Retrieves the medication adherence percentage and status.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getUpcomingAppointments',
      description: 'Retrieves scheduled doctor or specialist appointments.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getLatestVitals',
      description: 'Retrieves the latest biometric measurements (Heart rate, SpO2, BP) with timestamp and source.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getVaccinationStatus',
      description: 'Retrieves the vaccination history and immunization record.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'getHealthProgress',
      description: 'Retrieves wellness indicators (hydration, step count, mindfulness minutes).',
      parameters: { type: 'object', properties: {} },
    },
  },
];

export async function executeToolCall(
  toolName: string,
  args: any,
  profileId?: string
): Promise<any> {
  const patient = getAuthenticatedPatientContext(profileId);

  switch (toolName) {
    case 'getLatestReport':
      return {
        latestReport: patient.reports?.[0] || null,
      };

    case 'getMedicationSchedule':
      return {
        medications: patient.medications || [],
      };

    case 'getMedicationAdherence':
      return {
        adherenceRate: '94%',
        activeMedicationsCount: patient.medications?.length || 0,
      };

    case 'getUpcomingAppointments':
      return {
        appointments: patient.appointments || [],
      };

    case 'getLatestVitals':
      return {
        heartRate: `${patient.vitals?.heartRateBpm} BPM`,
        spO2: `${patient.vitals?.spO2Percent}%`,
        bloodPressure: `${patient.vitals?.bpSystolic}/${patient.vitals?.bpDiastolic} mmHg`,
        source: 'Connected Wearable',
        lastUpdated: patient.vitals?.lastUpdated,
      };

    case 'getVaccinationStatus':
      return {
        vaccinations: patient.vaccinations || [],
      };

    case 'getHealthProgress':
      return {
        wellness: patient.wellness,
      };

    default:
      return { error: `Tool ${toolName} not found` };
  }
}

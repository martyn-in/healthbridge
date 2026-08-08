import { getAuthenticatedPatientContext, AuthenticatedPatientData } from '../patientContext';

export interface SelectiveContext {
  patientSummary: string;
  relevantMedications?: any[];
  relevantAppointments?: any[];
}

export function retrieveRelevantContext(
  userQuery: string,
  profileId?: string
): SelectiveContext {
  const fullContext = getAuthenticatedPatientContext(profileId);
  const q = userQuery.toLowerCase();

  const patientSummary = `Patient Name: ${fullContext.name}, Age: ${fullContext.age || 'N/A'}, Allergies: ${
    fullContext.allergies?.join(', ') || 'None'
  }, Known Conditions: ${fullContext.conditions?.join(', ') || 'None'}.`;

  const context: SelectiveContext = {
    patientSummary,
  };

  if (q.includes('medicine') || q.includes('medication') || q.includes('dose') || q.includes('pill') || q.includes('prescription') || q.includes('schedule') || q.includes('atorvastatin') || q.includes('amoxicillin')) {
    context.relevantMedications = fullContext.medications;
  }

  if (q.includes('appointment') || q.includes('doctor') || q.includes('visit') || q.includes('consultation') || q.includes('mehta')) {
    context.relevantAppointments = fullContext.upcomingAppointments;
  }

  return context;
}

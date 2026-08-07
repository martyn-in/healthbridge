import { getAuthenticatedPatientContext, AuthenticatedPatientData } from '../patientContext';

export interface SelectiveContext {
  patientSummary: string;
  relevantReports?: any[];
  relevantMedications?: any[];
  relevantVitals?: any;
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

  if (q.includes('report') || q.includes('lab') || q.includes('blood') || q.includes('ldl') || q.includes('cholesterol') || q.includes('cbc') || q.includes('test')) {
    context.relevantReports = fullContext.reports;
  }

  if (q.includes('medicine') || q.includes('medication') || q.includes('dose') || q.includes('pill') || q.includes('prescription') || q.includes('schedule') || q.includes('atorvastatin') || q.includes('amoxicillin')) {
    context.relevantMedications = fullContext.medications;
  }

  if (q.includes('bpm') || q.includes('pulse') || q.includes('heart rate') || q.includes('spo2') || q.includes('blood pressure') || q.includes('vital')) {
    context.relevantVitals = fullContext.vitals;
  }

  if (q.includes('appointment') || q.includes('doctor') || q.includes('visit') || q.includes('consultation') || q.includes('mehta')) {
    context.relevantAppointments = fullContext.appointments;
  }

  return context;
}

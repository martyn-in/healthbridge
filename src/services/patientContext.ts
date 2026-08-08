/**
 * Patient context builder for AI chat route.
 *
 * Returns only real data passed in — no hardcoded vitals, medications,
 * reports, or wellness values. If the caller doesn't provide data, the
 * field is absent from the context so Gemini doesn't receive fake information.
 */
export interface AuthenticatedPatientData {
  profileId: string;
  name: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    active: boolean;
  }[];
  upcomingAppointments?: {
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
  }[];
}

/**
 * Build patient context from real data provided by the caller.
 * Never invents placeholder values.
 */
export function buildPatientContext(data: AuthenticatedPatientData): AuthenticatedPatientData {
  return data;
}

/**
 * @deprecated Use buildPatientContext() with real data instead.
 * This stub exists only for backwards compatibility during migration.
 * It returns no fabricated medical data.
 */
export function getAuthenticatedPatientContext(profileId?: string): AuthenticatedPatientData {
  return {
    profileId: profileId || 'prof-primary',
    name: 'Patient',
  };
}

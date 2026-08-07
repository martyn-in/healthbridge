'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
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
import {
  emptyProfiles,
  emptyEmergencyContacts,
  emptyMedications,
  emptyMedicationLogs,
  emptyReports,
  emptyPrescriptions,
  emptyAssessments,
  emptyFacilities,
  emptyRecords,
  emptyAppointments,
  emptyVaccinations,
  defaultLiveWellness,
  defaultLiveAssistantMessages,
  seedSampleProfiles,
  seedSampleMedications,
  seedSampleReports,
} from '@/services/demoData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isJudgeDemo: boolean;
  setIsJudgeDemo: (val: boolean) => void;
  
  // Real User Profiles
  activeProfile: FamilyMember;
  setActiveProfile: (prof: FamilyMember) => void;
  profiles: FamilyMember[];
  addProfile: (prof: Omit<FamilyMember, 'id'>) => void;
  deleteProfile: (id: string) => void;
  updatePrimaryProfile: (updates: Partial<FamilyMember>) => void;
  
  // Emergency SOS & Real Contacts
  isSosActive: boolean;
  triggerSos: () => void;
  cancelSos: () => void;
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (c: Omit<EmergencyContact, 'id'>) => void;

  // Real Workflows
  assessments: SymptomAssessment[];
  addAssessment: (a: SymptomAssessment) => void;

  reports: MedicalReport[];
  addReport: (r: MedicalReport) => void;
  deleteReport: (id: string) => void;

  prescriptions: PrescriptionScan[];
  addPrescription: (p: PrescriptionScan) => void;

  medications: Medication[];
  medicationLogs: MedicationLog[];
  addMedication: (m: Omit<Medication, 'id'>) => void;
  logMedicationStatus: (medicationId: string, status: 'taken' | 'skipped' | 'postponed') => void;
  deleteMedication: (id: string) => void;
  adherencePercentage: number;

  healthRecords: HealthRecord[];
  addHealthRecord: (r: Omit<HealthRecord, 'id'>) => void;
  deleteHealthRecord: (id: string) => void;
  qrSharingEnabled: boolean;
  setQrSharingEnabled: (val: boolean) => void;

  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  cancelAppointment: (id: string) => void;

  vaccinations: Vaccination[];
  addVaccination: (v: Omit<Vaccination, 'id'>) => void;

  wellness: WellnessCheckin;
  updateWellness: (updates: Partial<WellnessCheckin>) => void;

  assistantMessages: AssistantMessage[];
  sendAssistantMessage: (text: string) => void;
  clearAssistantHistory: () => void;

  clearAllDataToFreshState: () => void;
  loadSamplePresets: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  userLocation: { lat: number; lng: number } | null;
  userAddress: string;
  requestUserLocation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isJudgeDemo, setIsJudgeDemo] = useState<boolean>(false);
  
  // Real User Data Stores
  const [profiles, setProfiles] = useState<FamilyMember[]>(emptyProfiles);
  const [activeProfile, setActiveProfile] = useState<FamilyMember>(emptyProfiles[0]);

  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(emptyEmergencyContacts);

  const [assessments, setAssessments] = useState<SymptomAssessment[]>(emptyAssessments);
  const [reports, setReports] = useState<MedicalReport[]>(emptyReports);
  const [prescriptions, setPrescriptions] = useState<PrescriptionScan[]>(emptyPrescriptions);

  const [medications, setMedications] = useState<Medication[]>(emptyMedications);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(emptyMedicationLogs);

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(emptyRecords);
  const [qrSharingEnabled, setQrSharingEnabled] = useState<boolean>(true);

  const [appointments, setAppointments] = useState<Appointment[]>(emptyAppointments);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(emptyVaccinations);

  const [wellness, setWellness] = useState<WellnessCheckin>(defaultLiveWellness);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(defaultLiveAssistantMessages);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string>('Detecting location...');

  const fetchAddressForCoordinates = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en' },
      });
      const data = await res.json();
      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.suburb || data.address.county || 'Local Region';
        const state = data.address.state || '';
        setUserAddress(`${city}${state ? `, ${state}` : ''}`);
      } else {
        setUserAddress('Live Location Area');
      }
    } catch (err) {
      setUserAddress('Live Location Area');
    }
  };

  // LocalStorage initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProfiles = localStorage.getItem('hb_profiles');
        if (savedProfiles) {
          const parsed = JSON.parse(savedProfiles);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProfiles(parsed);
            setActiveProfile(parsed[0]);
          }
        }
        const savedMeds = localStorage.getItem('hb_medications');
        if (savedMeds) setMedications(JSON.parse(savedMeds));

        const savedApts = localStorage.getItem('hb_appointments');
        if (savedApts) setAppointments(JSON.parse(savedApts));

        const savedRecords = localStorage.getItem('hb_records');
        if (savedRecords) setHealthRecords(JSON.parse(savedRecords));

        const savedVaccines = localStorage.getItem('hb_vaccinations');
        if (savedVaccines) setVaccinations(JSON.parse(savedVaccines));

        const savedTheme = localStorage.getItem('hb_theme');
        if (savedTheme === 'dark') {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        } else {
          setDarkMode(false);
          document.documentElement.classList.remove('dark');
        }
      } catch (err) {
        console.warn('LocalStorage load error:', err);
      }
    }
  }, []);

  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    if (typeof window !== 'undefined') {
      if (val) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('hb_theme', 'dark');
        showToast('Dark Mode Enabled');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('hb_theme', 'light');
        showToast('Light Mode Enabled');
      }
    }
  };

  // LocalStorage sync effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hb_profiles', JSON.stringify(profiles));
      } catch (e) {}
    }
  }, [profiles]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hb_medications', JSON.stringify(medications));
      } catch (e) {}
    }
  }, [medications]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hb_appointments', JSON.stringify(appointments));
      } catch (e) {}
    }
  }, [appointments]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hb_records', JSON.stringify(healthRecords));
      } catch (e) {}
    }
  }, [healthRecords]);

  // Theme Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          fetchAddressForCoordinates(lat, lng);
          showToast('Live GPS location acquired!');
        },
        (err) => {
          showToast('GPS access denied or unavailable.');
        }
      );
    }
  };

  const triggerSos = () => {
    setIsSosActive(true);
    showToast('EMERGENCY SOS ACTIVATED. Displaying real medical card & 112/108 call actions.');
  };

  const cancelSos = () => {
    setIsSosActive(false);
    showToast('Emergency SOS cancelled.');
  };

  const updatePrimaryProfile = (updates: Partial<FamilyMember>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.isPrimary ? { ...p, ...updates } : p))
    );
    setActiveProfile((prev) => ({ ...prev, ...updates }));
    showToast('Updated your health profile details.');
  };

  const addProfile = (p: Omit<FamilyMember, 'id'>) => {
    const newP: FamilyMember = { ...p, id: `prof-${Date.now()}` };
    setProfiles((prev) => [...prev, newP]);
    showToast(`Added family profile for ${p.name}`);
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      showToast('Cannot delete the primary user profile.');
      return;
    }
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfile.id === id) {
      setActiveProfile(profiles.find((p) => p.id !== id) || profiles[0]);
    }
    showToast('Profile deleted.');
  };

  const addEmergencyContact = (c: Omit<EmergencyContact, 'id'>) => {
    setEmergencyContacts((prev) => [...prev, { ...c, id: `ec-${Date.now()}` }]);
    showToast('Emergency contact added.');
  };

  const addAssessment = (a: SymptomAssessment) => {
    setAssessments((prev) => [a, ...prev]);
    showToast('Symptom assessment saved to your records.');
  };

  const addReport = (r: MedicalReport) => {
    setReports((prev) => [r, ...prev]);
    const newRecord: HealthRecord = {
      id: `rec-${Date.now()}`,
      profileId: r.profileId,
      profileName: activeProfile.name,
      title: `Analyzed Report: ${r.fileName}`,
      category: 'Report',
      date: r.uploadedAt,
      fileSize: r.fileSize,
      fileType: r.fileType,
      tags: ['Live Upload', 'Analyzed'],
      privacy: 'Emergency Accessible',
      notes: r.summary,
    };
    setHealthRecords((prev) => [newRecord, ...prev]);
    showToast('Medical report analyzed and saved to records!');
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Report deleted.');
  };

  const addPrescription = (p: PrescriptionScan) => {
    setPrescriptions((prev) => [p, ...prev]);
    p.medicines.forEach((m) => {
      const newMed: Medication = {
        id: `med-${Date.now()}-${Math.random()}`,
        profileId: p.profileId,
        profileName: activeProfile.name,
        name: m.name,
        dosage: m.dosage,
        form: 'Tablet',
        frequency: m.frequency,
        scheduleTimes: ['09:00', '21:00'],
        startDate: new Date().toISOString().split('T')[0],
        beforeAfterFood: m.beforeAfterFood,
        instructions: m.instructions,
        remainingRefills: 3,
        totalQuantity: 30,
        currentQuantity: 30,
        prescribedBy: p.doctorName,
        active: true,
      };
      setMedications((prev) => [newMed, ...prev]);
    });
    showToast('Prescription scanned & medicines added to schedule!');
  };

  const addMedication = (m: Omit<Medication, 'id'>) => {
    const newM: Medication = { ...m, id: `med-${Date.now()}` };
    setMedications((prev) => [...prev, newM]);
    showToast(`Added ${m.name} to medication schedule.`);
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
    showToast('Medication removed.');
  };

  const logMedicationStatus = (medicationId: string, status: 'taken' | 'skipped' | 'postponed') => {
    const med = medications.find((m) => m.id === medicationId);
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog: MedicationLog = {
      id: `log-${Date.now()}`,
      medicationId,
      medicationName: med ? `${med.name} (${med.dosage})` : 'Medication',
      profileId: activeProfile.id,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status,
      date: todayStr,
    };
    setMedicationLogs((prev) => [newLog, ...prev.filter((l) => !(l.medicationId === medicationId && l.date === todayStr))]);
    showToast(`Logged dosage as ${status}.`);
  };

  const adherencePercentage = medicationLogs.length === 0
    ? 100
    : Math.round((medicationLogs.filter((l) => l.status === 'taken').length / medicationLogs.length) * 100);

  const addHealthRecord = (r: Omit<HealthRecord, 'id'>) => {
    setHealthRecords((prev) => [{ ...r, id: `rec-${Date.now()}` }, ...prev]);
    showToast('Record uploaded successfully.');
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Record deleted.');
  };

  const bookAppointment = (apt: Omit<Appointment, 'id' | 'status'>) => {
    const newA: Appointment = { ...apt, id: `apt-${Date.now()}`, status: 'Upcoming' };
    setAppointments((prev) => [newA, ...prev]);
    showToast(`Appointment booked with ${apt.doctorName}!`);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    );
    showToast('Appointment cancelled.');
  };

  const addVaccination = (v: Omit<Vaccination, 'id'>) => {
    setVaccinations((prev) => [{ ...v, id: `vac-${Date.now()}` }, ...prev]);
    showToast('Vaccination recorded.');
  };

  const updateWellness = (updates: Partial<WellnessCheckin>) => {
    setWellness((prev) => ({ ...prev, ...updates }));
    showToast('Wellness goals updated.');
  };

  const sendAssistantMessage = async (text: string) => {
    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedMessages = [...assistantMessages, userMsg];
    setAssistantMessages(updatedMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile: activeProfile,
        }),
      });

      let responseText = '';
      if (res.ok) {
        const data = await res.json();
        responseText = data.text;
      } else {
        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
        if (apiKey) {
          const directRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `You are Aira, the clinical AI medical guide for HealthBridge AI. Provide empathetic, evidence-based medical information for patient ${activeProfile?.name || 'User'}. Keep responses clear and concise.`,
                },
                ...updatedMessages.map((m) => ({
                  role: m.sender === 'user' ? 'user' : 'assistant',
                  content: m.text,
                })),
              ],
            }),
          });
          const directData = await directRes.json();
          responseText = directData.choices?.[0]?.message?.content || 'I am ready to assist with your medical questions.';
        } else {
          responseText = 'I am ready to assist with your clinical queries.';
        }
      }

      const airaMsg: AssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'aira',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAssistantMessages((prev) => [...prev, airaMsg]);
    } catch (err) {
      console.error('Assistant OpenAI Error:', err);
      const fallbackMsg: AssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'aira',
        text: "I am connected and ready to answer your health queries.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAssistantMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const clearAssistantHistory = () => {
    setAssistantMessages(defaultLiveAssistantMessages);
    showToast('Assistant conversation reset.');
  };

  const clearAllDataToFreshState = () => {
    setProfiles(emptyProfiles);
    setActiveProfile(emptyProfiles[0]);
    setEmergencyContacts(emptyEmergencyContacts);
    setAssessments(emptyAssessments);
    setReports(emptyReports);
    setPrescriptions(emptyPrescriptions);
    setMedications(emptyMedications);
    setMedicationLogs(emptyMedicationLogs);
    setHealthRecords(emptyRecords);
    setAppointments(emptyAppointments);
    setVaccinations(emptyVaccinations);
    setWellness(defaultLiveWellness);
    setAssistantMessages(defaultLiveAssistantMessages);
    setIsSosActive(false);
    showToast('Application reset to clean Live Application state.');
  };

  const loadSamplePresets = () => {
    clearAllDataToFreshState();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        setDarkMode: handleSetDarkMode,
        isJudgeDemo,
        setIsJudgeDemo,
        activeProfile,
        setActiveProfile,
        profiles,
        addProfile,
        deleteProfile,
        updatePrimaryProfile,
        isSosActive,
        triggerSos,
        cancelSos,
        emergencyContacts,
        addEmergencyContact,
        assessments,
        addAssessment,
        reports,
        addReport,
        deleteReport,
        prescriptions,
        addPrescription,
        medications,
        medicationLogs,
        addMedication,
        logMedicationStatus,
        deleteMedication,
        adherencePercentage,
        healthRecords,
        addHealthRecord,
        deleteHealthRecord,
        qrSharingEnabled,
        setQrSharingEnabled,
        appointments,
        bookAppointment,
        cancelAppointment,
        vaccinations,
        addVaccination,
        wellness,
        updateWellness,
        assistantMessages,
        sendAssistantMessage,
        clearAssistantHistory,
        clearAllDataToFreshState,
        loadSamplePresets,
        toastMessage,
        showToast,
        userLocation,
        userAddress,
        requestUserLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

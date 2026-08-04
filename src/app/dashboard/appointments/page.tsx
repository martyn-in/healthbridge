'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, CheckCircle, Video, UserCheck, XCircle, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AppointmentsPage() {
  const { appointments, bookAppointment, cancelAppointment, activeProfile, profiles } = useApp();

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Ananya Mehta');
  const [specialty, setSpecialty] = useState('General Physician');
  const [hospital, setHospital] = useState('Apex Health Clinic, Green Park');
  const [date, setDate] = useState('2026-08-05');
  const [time, setTime] = useState('10:30 AM');
  const [reason, setReason] = useState('General Health Checkup');

  const demoDoctors = [
    { name: 'Dr. Ananya Mehta', spec: 'General Physician', hosp: 'Apex Health Clinic, Green Park' },
    { name: 'Dr. S. N. Roy', spec: 'Endocrinologist', hosp: 'Apollo Hospital, Sarita Vihar' },
    { name: 'Dr. V. K. Gupta', spec: 'Cardiologist', hosp: 'AIIMS Emergency & Acute Care' },
    { name: 'Dr. Rajesh Kumar', spec: 'Pediatrician', hosp: 'Max Children Hospital' },
  ];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      doctorName: selectedDoctor,
      specialty,
      hospitalName: hospital,
      date,
      time,
      reason,
      mode: 'In-Person',
    });
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <CalendarIcon className="h-3.5 w-3.5" /> Care Coordination
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Clinician & Specialist Consultations
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Schedule follow-ups, telemedicine appointments, and in-person consultations for patient <span className="font-bold text-teal-400">{activeProfile.name}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" /> Book Consultation
        </button>
      </div>

      {/* Scheduled Appointments Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Scheduled Consultations ({appointments.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className={`rounded-xl p-5 shadow-sm border transition-all space-y-4 ${
                apt.status === 'Cancelled'
                  ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                    {apt.specialty}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {apt.doctorName}
                  </h3>
                  <p className="text-xs text-slate-500">{apt.hospitalName}</p>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    apt.status === 'Upcoming'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="font-medium text-slate-400 block text-[10px]">Date & Time:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {apt.date} at {apt.time}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-400 block text-[10px]">Patient Record:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{apt.profileName}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-slate-400 block text-[10px]">Consultation Reason:</span>
                  <span className="text-slate-800 dark:text-slate-200">{apt.reason}</span>
                </div>
              </div>

              {apt.status === 'Upcoming' && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Cancel Consultation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-dropdown border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Book Specialist Consultation</h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Healthcare Provider:
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => {
                    const doc = demoDoctors.find((d) => d.name === e.target.value);
                    if (doc) {
                      setSelectedDoctor(doc.name);
                      setSpecialty(doc.spec);
                      setHospital(doc.hosp);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                >
                  {demoDoctors.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.spec})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot:</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Visit:
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine follow-up, symptom review..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

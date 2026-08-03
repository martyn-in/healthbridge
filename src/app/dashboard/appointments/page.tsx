'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, CheckCircle, Video, UserCheck, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AppointmentsPage() {
  const { appointments, bookAppointment, cancelAppointment, activeProfile } = useApp();

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor.trim()) return;
    bookAppointment({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      doctorName: selectedDoctor,
      specialty: specialty || 'General Health',
      hospitalName: hospital || 'Local Health Center',
      date,
      time,
      reason: reason || 'Routine Consultation',
      mode: 'In-Person',
    });
    setSelectedDoctor('');
    setSpecialty('');
    setHospital('');
    setReason('');
    setShowBookModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Clinician & Specialist Consultations
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Schedule follow-ups, telemedicine sessions, and in-person consultations for <span className="font-bold text-teal-300">{activeProfile.name}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" /> Book Consultation
        </button>
      </div>

      {/* Upcoming Appointments List */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Scheduled Appointments ({appointments.length})
        </h3>

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`rounded-2xl p-6 shadow-card border transition-all space-y-4 ${
                  apt.status === 'Cancelled'
                    ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-cyan-300 text-[10px] font-bold">
                      {apt.specialty}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500">{apt.hospitalName}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      apt.status === 'Upcoming'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold text-slate-400 block">Date & Time:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {apt.date} at {apt.time}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block">Patient Profile:</span>
                    <span className="font-bold text-teal-600 dark:text-cyan-400">{apt.profileName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-400 block">Reason:</span>
                    <span>{apt.reason}</span>
                  </div>
                </div>

                {apt.status === 'Upcoming' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-red-100 hover:text-red-600"
                    >
                      Cancel Consultation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <CalendarIcon className="h-10 w-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Consultations Scheduled</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the "Book Consultation" button to schedule an appointment with your clinician.
            </p>
          </div>
        )}
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book Doctor Consultation</h3>
            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Doctor Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Specialty:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Clinic / Hospital:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City Health Clinic"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time:
                  </label>
                  <input
                    type="text"
                    value={time}
                    placeholder="10:00 AM"
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Visit:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Checkup"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

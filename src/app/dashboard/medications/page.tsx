'use client';

import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Calendar as CalendarIcon,
  RotateCcw,
  Bell,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Medication } from '@/types';
import { t } from '@/lib/i18n';

export default function MedicationsPage() {
  const {
    activeProfile,
    medications,
    medicationLogs,
    logMedicationStatus,
    addMedication,
    deleteMedication,
    adherencePercentage,
    language,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedForm, setNewMedForm] = useState<Medication['form']>('Tablet');
  const [newMedTime, setNewMedTime] = useState('08:00');
  const [newMedFood, setNewMedFood] = useState<'Before Food' | 'After Food'>('After Food');

  const filteredMeds = medications.filter((m) => m.profileId === activeProfile.id || m.profileId === 'prof-1');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    addMedication({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      name: newMedName,
      dosage: newMedDosage || '1 Dose',
      form: newMedForm,
      frequency: 'Once Daily',
      scheduleTimes: [newMedTime],
      startDate: new Date().toISOString().split('T')[0],
      beforeAfterFood: newMedFood,
      instructions: `Take ${newMedFood.toLowerCase()}`,
      remainingRefills: 3,
      totalQuantity: 30,
      currentQuantity: 30,
      active: true,
    });
    setShowAddModal(false);
    setNewMedName('');
    setNewMedDosage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <Pill className="h-3.5 w-3.5" /> Medication Management
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Medication Schedule & Compliance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Track daily dosages for patient <span className="font-bold text-teal-400">{activeProfile.name}</span>. Receive automated refill alerts and log verified adherence histories.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Medication
        </button>
      </div>

      {/* Adherence & Progress Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Adherence Rate
            </span>
            <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">
              {adherencePercentage}%
            </div>
            <span className="text-[11px] text-slate-500">Weekly compliance index</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-extrabold text-sm border border-teal-200 dark:border-teal-800">
            {adherencePercentage}%
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Prescriptions
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {filteredMeds.length}
            </div>
            <span className="text-[11px] text-slate-500">In patient cabinet</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Pill className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Reminder System
            </span>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Active & Synced
            </div>
            <button
              onClick={() => showToast('Browser notification test signal sent.')}
              className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline mt-1 block font-semibold"
            >
              Test Notification
            </button>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Bell className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Today Timeline */}
      <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Today's Medication Schedule
            </h3>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {filteredMeds.length > 0 ? (
          <div className="space-y-3">
            {filteredMeds.map((med) => {
              const todayLog = medicationLogs.find(
                (l) => l.medicationId === med.id && l.date === new Date().toISOString().split('T')[0]
              );
              const status = todayLog?.status || 'pending';

              return (
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-all ${
                    status === 'taken'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : status === 'skipped'
                      ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {med.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold text-[10px] text-slate-700 dark:text-slate-300">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      {med.instructions} • {med.beforeAfterFood} | Scheduled: {med.scheduleTimes.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === 'taken' ? (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Dose Logged
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => logMedicationStatus(med.id, 'taken')}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors"
                        >
                          Mark Taken
                        </button>
                        <button
                          onClick={() => logMedicationStatus(med.id, 'skipped')}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300"
                        >
                          Skip
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        deleteMedication(med.id);
                        showToast('Medication removed from cabinet.');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-3">
            <Pill className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Active Medications Scheduled
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Medication
            </button>
          </div>
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-dropdown border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add New Medication</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medication Name:
                </label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Amoxicillin, Metformin..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Strength/Dosage:</label>
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="e.g. 500mg, 10ml"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot:</label>
                  <input
                    type="time"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Food Timing:</label>
                <div className="flex gap-2">
                  {(['Before Food', 'After Food'] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setNewMedFood(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                        newMedFood === opt
                          ? 'bg-teal-600 text-white border-teal-700'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

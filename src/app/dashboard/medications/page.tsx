'use client';

import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Sparkles,
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
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-700 to-navy-900 p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Flagship Workflow #4
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medication Schedule & Adherence
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Track daily dosages for <span className="font-bold text-teal-300">{activeProfile.name}</span>. Receive refill alerts and maintain a verified adherence record for doctor consultations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Medication
        </button>
      </div>

      {/* Adherence & Progress Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Weekly Adherence Rate
            </span>
            <div className="text-3xl font-black text-teal-600 dark:text-cyan-400 mt-1">
              {adherencePercentage}%
            </div>
            <span className="text-[11px] text-slate-500">Based on logged dosage history</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-cyan-400 font-extrabold text-lg border border-teal-500/30">
            {adherencePercentage}%
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Prescriptions
            </span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {filteredMeds.length}
            </div>
            <span className="text-[11px] text-slate-500">Digital medicine cabinet</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Pill className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Browser Alerts
            </span>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Enabled & Active
            </div>
            <button
              onClick={() => showToast('Browser notification permission refreshed.')}
              className="text-[11px] text-teal-600 dark:text-cyan-400 hover:underline mt-1 block"
            >
              Test Alert Tone
            </button>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Today Timeline */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Today's Medication Timeline
            </h3>
            <p className="text-xs text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMeds.map((med) => {
            const todayLog = medicationLogs.find(
              (l) => l.medicationId === med.id && l.date === new Date().toISOString().split('T')[0]
            );
            const isTaken = todayLog?.status === 'taken';
            const isSkipped = todayLog?.status === 'skipped';

            return (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isTaken
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : isSkipped
                    ? 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 mt-0.5">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {med.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-cyan-300 text-[10px] font-bold">
                        {med.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {med.instructions} • <span className="font-semibold">{med.beforeAfterFood}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" /> {med.scheduleTimes.join(', ')}
                      </span>
                      <span>Refills: {med.remainingRefills} left</span>
                    </div>
                  </div>
                </div>

                {/* Log Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {isTaken ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" /> Taken ({todayLog?.loggedAt})
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => logMedicationStatus(med.id, 'taken')}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Taken
                      </button>
                      <button
                        onClick={() => logMedicationStatus(med.id, 'skipped')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300"
                      >
                        Skip
                      </button>
                      <button
                        onClick={() => deleteMedication(med.id)}
                        className="p-2 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Medication Manually</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 650"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage Strength:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 650 mg"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Form:
                  </label>
                  <select
                    value={newMedForm}
                    onChange={(e) => setNewMedForm(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Drops">Drops</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Schedule Time:
                  </label>
                  <input
                    type="time"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Food Instruction:
                  </label>
                  <select
                    value={newMedFood}
                    onChange={(e) => setNewMedFood(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

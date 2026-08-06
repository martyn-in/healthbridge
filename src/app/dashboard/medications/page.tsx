'use client';

import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  Plus,
  Bell,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Medication } from '@/types';
import { Card3D } from '@/components/3d/Card3D';

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
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <Card3D depth={10}>
        <div className="p-6 rounded-3xl frosted-card space-y-4 anim-fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 text-[11px] font-bold shadow-sm" style={{ color: '#FF9500' }}>
                <Pill className="h-3.5 w-3.5" /> Medication Management
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                Medication Schedule
              </h1>
              <p className="text-xs font-medium text-slate-600 max-w-xl leading-relaxed">
                Track daily dosages for patient <span className="font-extrabold text-slate-900">{activeProfile.name}</span>. Receive automated refill alerts and log verified adherence histories.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="pill-btn pill-btn-primary flex items-center gap-2 shrink-0 card-lift"
              style={{ backgroundColor: '#0066FF' }}
            >
              <Plus className="h-4 w-4" /> Add Medication
            </button>
          </div>
        </div>
      </Card3D>

      {/* Adherence & Progress Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 anim-fade-up delay-100">
        <div className="rounded-3xl neu-card p-5 flex items-center justify-between card-lift transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Adherence Rate
            </span>
            <div className="text-2xl font-black mt-1" style={{ color: '#00C875' }}>
              {adherencePercentage}%
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Weekly compliance index</span>
          </div>
          <div className="w-16 h-10">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <path d="M0,20 Q20,5 40,25 T80,10 T100,15" fill="none" stroke="#00C875" strokeWidth="3" className="sparkline-path" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="rounded-3xl neu-card p-5 flex items-center justify-between card-lift transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Prescriptions
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {filteredMeds.length}
            </div>
            <span className="text-[11px] font-semibold text-slate-400">In patient cabinet</span>
          </div>
          <div className="w-16 h-10">
            <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
              <path d="M0,15 Q25,25 50,15 T100,5" fill="none" stroke="#0066FF" strokeWidth="3" className="sparkline-path" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="rounded-3xl neu-card p-5 flex items-center justify-between card-lift transition-all">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Reminder System
            </span>
            <div className="text-xs font-extrabold mt-1 flex items-center gap-1" style={{ color: '#00C875' }}>
              <CheckCircle2 className="h-4 w-4" /> <span className="dot-live mr-1 block h-2 w-2 rounded-full" style={{ backgroundColor: '#00C875' }}></span> Active
            </div>
            <button
              onClick={() => showToast('Browser notification test signal sent.')}
              className="text-[11px] hover:underline mt-1 block font-bold"
              style={{ color: '#0066FF' }}
            >
              Test Notification
            </button>
          </div>
          <div className="p-3 rounded-2xl bg-white shadow-inner text-slate-600">
            <Bell className="h-5 w-5" style={{ color: '#FF9500' }} />
          </div>
        </div>
      </div>

      {/* Today Timeline */}
      <div className="rounded-3xl frosted-card p-6 space-y-6 anim-fade-up delay-200">
        <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Today's Schedule
            </h3>
            <p className="text-xs font-medium text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {filteredMeds.length > 0 ? (
          <div className="space-y-4">
            {filteredMeds.map((med) => {
              const todayLog = medicationLogs.find(
                (l) => l.medicationId === med.id && l.date === new Date().toISOString().split('T')[0]
              );
              const status = todayLog?.status || 'pending';

              return (
                <div
                  key={med.id}
                  className={`p-4 rounded-2xl frosted-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-all card-lift ${
                    status === 'taken'
                      ? 'border-l-4 border-l-[#00C875]'
                      : 'border-l-4 border-l-[#FF9500]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl shadow-sm flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)', color: '#FF9500' }}>
                      <Pill className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {med.name}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white font-bold text-[10px] text-slate-700 shadow-sm border border-slate-100">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium">
                        {med.instructions} • {med.beforeAfterFood} | Scheduled: {med.scheduleTimes.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {status === 'taken' ? (
                      <span className="px-3.5 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1 shadow-sm" style={{ backgroundColor: 'rgba(0, 200, 117, 0.1)', color: '#00C875' }}>
                        <CheckCircle2 className="h-4 w-4" /> Dose Logged
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => logMedicationStatus(med.id, 'taken')}
                          className="pill-btn pill-btn-primary"
                          style={{ backgroundColor: '#0066FF' }}
                        >
                          Mark Taken
                        </button>
                        <button
                          onClick={() => logMedicationStatus(med.id, 'skipped')}
                          className="pill-btn pill-btn-ghost"
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
                      className="p-2 text-slate-400 hover:text-[#FF3366] rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl space-y-3 frosted-card border border-dashed border-slate-300">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-inner bg-white">
               <Pill className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">
              No Active Medications Scheduled
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="pill-btn pill-btn-primary inline-flex items-center gap-1.5 mx-auto card-lift"
              style={{ backgroundColor: '#0066FF' }}
            >
              <Plus className="h-4 w-4" /> Add Medication
            </button>
          </div>
        )}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10,20,60,0.30)', backdropFilter: 'blur(16px)' }}
        >
          <div className="w-full max-w-md rounded-3xl frosted-card bg-white/80 p-6 shadow-2xl space-y-4 font-sans anim-fade-up">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Add New Medication</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Medication Name:
                </label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Amoxicillin, Metformin..."
                  className="w-full p-3 rounded-2xl bg-white/50 text-slate-900 border border-slate-200/50 font-bold outline-none focus:border-[#0066FF] shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Strength/Dosage:</label>
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="e.g. 500mg, 10ml"
                    className="w-full p-3 rounded-2xl bg-white/50 text-slate-900 border border-slate-200/50 font-medium outline-none shadow-inner focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Time Slot:</label>
                  <input
                    type="time"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-white/50 text-slate-900 border border-slate-200/50 font-medium outline-none shadow-inner focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Food Timing:</label>
                <div className="flex gap-2">
                  {(['Before Food', 'After Food'] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setNewMedFood(opt)}
                      className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        newMedFood === opt
                          ? 'bg-[#0066FF] text-white border-transparent'
                          : 'bg-white/50 text-slate-700 border border-slate-200/50 hover:bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 pill-btn pill-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 pill-btn pill-btn-primary"
                  style={{ backgroundColor: '#0066FF' }}
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

'use client';

import React, { useState } from 'react';
import { Syringe, Plus, CheckCircle2, Clock, AlertTriangle, Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Vaccination } from '@/types';

export default function VaccinationsPage() {
  const { vaccinations, addVaccination, activeProfile, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [vaccineName, setVaccineName] = useState('');
  const [targetDisease, setTargetDisease] = useState('');
  const [doseNumber, setDoseNumber] = useState('Dose 1');
  const [dateGiven, setDateGiven] = useState(new Date().toISOString().split('T')[0]);

  const filteredVaccines = vaccinations.filter(
    (v) => v.profileId === activeProfile.id || v.profileId === 'prof-1'
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName.trim()) return;
    addVaccination({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      vaccineName,
      targetDisease: targetDisease || vaccineName,
      doseNumber,
      dateGiven,
      status: 'Completed',
      givenAtFacility: 'Authorized Regional Health Centre',
    });
    setShowAddModal(false);
    setVaccineName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 text-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <Syringe className="h-3 w-3" /> Immunization Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Family Immunization & Vaccination Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Track booster dates and immunization certificates for <span className="font-bold text-teal-400">{activeProfile.name}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Vaccine Record
        </button>
      </div>

      {/* Timeline Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Vaccination Records ({filteredVaccines.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaccines.map((vac) => (
            <div
              key={vac.id}
              className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400">
                      <Syringe className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {vac.vaccineName}
                      </h4>
                      <span className="text-xs text-slate-500">{vac.targetDisease}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      vac.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {vac.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold text-slate-400 block">Dose:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{vac.doseNumber}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400 block">Date Given:</span>
                    <span className="font-medium text-teal-600 dark:text-cyan-400">{vac.dateGiven || vac.dueDate}</span>
                  </div>
                  {vac.givenAtFacility && (
                    <div className="col-span-2">
                      <span className="font-semibold text-slate-400 block">Facility:</span>
                      <span>{vac.givenAtFacility}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => showToast('Vaccination certificate downloaded.')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
              >
                <Download className="h-3.5 w-3.5" /> Download Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record Vaccination</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vaccine Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hepatitis B Booster"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dose Number:
                  </label>
                  <input
                    type="text"
                    value={doseNumber}
                    onChange={(e) => setDoseNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date Given:
                  </label>
                  <input
                    type="date"
                    value={dateGiven}
                    onChange={(e) => setDateGiven(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

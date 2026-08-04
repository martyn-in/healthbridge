'use client';

import React, { useState } from 'react';
import { Building2, Plus, Users, ShieldAlert, CheckCircle2, ChevronRight, Settings, Save, Trash2, Bed } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface PatientAdmission {
  id: string;
  name: string;
  ward: string;
  bedNumber: string;
  admittingDoctor: string;
  dateAdmitted: string;
}

export default function HospitalBedManagementPage() {
  const { showToast } = useApp();

  const [admissions, setAdmissions] = useState<PatientAdmission[]>([
    { id: '1', name: 'Ramesh Chawla', ward: 'Intensive Care Unit (ICU)', bedNumber: 'ICU-B12', admittingDoctor: 'Dr. V. K. Gupta', dateAdmitted: '2026-08-01' },
    { id: '2', name: 'Simran Jit', ward: 'Emergency Wing', bedNumber: 'EMR-A04', admittingDoctor: 'Dr. Ananya Mehta', dateAdmitted: '2026-08-04' },
    { id: '3', name: 'Aarav Sharma', ward: 'Cardiology Ward', bedNumber: 'CRD-C03', admittingDoctor: 'Dr. S. N. Roy', dateAdmitted: '2026-08-03' },
    { id: '4', name: 'Kavita Singh', ward: 'Pediatric Care', bedNumber: 'PED-D05', admittingDoctor: 'Dr. Rajesh Kumar', dateAdmitted: '2026-08-02' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [ward, setWard] = useState('Intensive Care Unit (ICU)');
  const [bedNumber, setBedNumber] = useState('ICU-B15');
  const [doctorName, setDoctorName] = useState('Dr. Ananya Mehta');

  const handleAddAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !bedNumber.trim()) return;

    const newAdm: PatientAdmission = {
      id: String(admissions.length + 1),
      name: patientName,
      ward,
      bedNumber,
      admittingDoctor: doctorName,
      dateAdmitted: new Date().toISOString().split('T')[0],
    };

    setAdmissions([newAdm, ...admissions]);
    setShowAddForm(false);
    setPatientName('');
    showToast(`Patient ${patientName} admitted to bed ${bedNumber}.`);
  };

  const dischargePatient = (id: string, name: string) => {
    setAdmissions(admissions.filter((a) => a.id !== id));
    showToast(`Patient ${name} discharged from ward.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Facility Management
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Hospital Bed Registry & Ward Admissions
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Oversee live inpatient bed allocations, manage ward intake queues, register new patient admissions, and audit department discharge logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Admit Patient
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bed Allocation visual grid & list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual census panel */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Live Census Allocation Index
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {[
                { name: 'ICU', current: 18, total: 20, color: 'bg-red-500', text: 'text-red-655' },
                { name: 'Emergency', current: 21, total: 25, color: 'bg-orange-500', text: 'text-orange-655' },
                { name: 'Cardiology', current: 11, total: 15, color: 'bg-teal-500', text: 'text-teal-655' },
                { name: 'Pediatrics', current: 15, total: 20, color: 'bg-blue-500', text: 'text-blue-655' },
                { name: 'Gen Medicine', current: 27, total: 30, color: 'bg-slate-500', text: 'text-slate-655' },
              ].map((w) => (
                <div key={w.name} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750 text-center space-y-2">
                  <span className="text-[10px] font-bold text-slate-450 uppercase block">{w.name}</span>
                  <div className="text-lg font-black text-slate-850 dark:text-white">{w.current} / {w.total}</div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${w.color} rounded-full`} style={{ width: `${(w.current / w.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Admissions Table */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Active Admissions Log ({admissions.length} Patients)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Patient Name</th>
                    <th className="px-5 py-4">Ward / Unit</th>
                    <th className="px-5 py-4">Bed Number</th>
                    <th className="px-5 py-4">Admitting Doctor</th>
                    <th className="px-5 py-4">Date Admitted</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-350">
                  {admissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">{adm.name}</td>
                      <td className="px-5 py-4 whitespace-nowrap">{adm.ward}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold text-[10px]">
                          {adm.bedNumber}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">{adm.admittingDoctor}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">{adm.dateAdmitted}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => dischargePatient(adm.id, adm.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-655 dark:bg-slate-800 dark:hover:bg-red-950/20 text-slate-655 text-[10px] font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                          title="Discharge Patient"
                        >
                          Discharge
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-450">
                        No active admissions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Registry info */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-teal-655" /> Operational Bed Capacity
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-semibold">Total Configured Capacity:</span>
                <span className="font-extrabold text-slate-850 dark:text-white text-sm">110 Beds</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-semibold">Occupied Beds:</span>
                <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">92 Beds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Available Beds:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">18 Beds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admit Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-modal border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="h-1 w-full bg-teal-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-teal-655" /> Admit Inpatient Record
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleAddAdmission} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-350">Patient Full Name:</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Chawla"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-350">Select Ward:</label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none font-medium"
                    >
                      <option value="Intensive Care Unit (ICU)">ICU</option>
                      <option value="Emergency Wing">Emergency Wing</option>
                      <option value="Cardiology Ward">Cardiology Ward</option>
                      <option value="Pediatric Care">Pediatric Care</option>
                      <option value="General Medicine Ward">Gen Med Ward</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-350">Bed Number:</label>
                    <input
                      type="text"
                      required
                      value={bedNumber}
                      onChange={(e) => setBedNumber(e.target.value)}
                      placeholder="e.g. ICU-B15"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-350">Admitting Doctor:</label>
                  <select
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none font-medium"
                  >
                    <option value="Dr. Ananya Mehta">Dr. Ananya Mehta</option>
                    <option value="Dr. S. N. Roy">Dr. S. N. Roy</option>
                    <option value="Dr. V. K. Gupta">Dr. V. K. Gupta</option>
                    <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
                  </select>
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-teal-650 hover:bg-teal-700 text-white font-bold transition-all active:scale-[0.98]"
                  >
                    Admit Inpatient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

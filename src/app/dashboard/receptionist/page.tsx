'use client';

import React, { useState } from 'react';
import { Stethoscope, Calendar, Clock, Plus, Users, ShieldCheck, HeartPulse, Building2, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ClinicalDepartment {
  name: string;
  activePatients: number;
  onDutyDoctors: number;
  head: string;
  status: 'Critical Load' | 'Normal Load' | 'Understaffed';
}

interface StaffShift {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'On Duty' | 'Scheduled' | 'On Leave';
}

export default function ClinicalDepartmentsPage() {
  const { showToast } = useApp();

  const [departments, setDepartments] = useState<ClinicalDepartment[]>([
    { name: 'Intensive Care Unit (ICU)', activePatients: 18, onDutyDoctors: 3, head: 'Dr. V. K. Gupta', status: 'Critical Load' },
    { name: 'Emergency Wing', activePatients: 21, onDutyDoctors: 4, head: 'Dr. Ananya Mehta', status: 'Critical Load' },
    { name: 'Cardiology Ward', activePatients: 11, onDutyDoctors: 2, head: 'Dr. S. N. Roy', status: 'Normal Load' },
    { name: 'Pediatric Care', activePatients: 15, onDutyDoctors: 2, head: 'Dr. Rajesh Kumar', status: 'Normal Load' },
    { name: 'General Medicine Clinic', activePatients: 27, onDutyDoctors: 3, head: 'Dr. Ananya Mehta', status: 'Normal Load' },
  ]);

  const [shifts, setShifts] = useState<StaffShift[]>([
    { id: '1', name: 'Ritu Sharma', role: 'Nursing Lead', shift: 'Morning (07:00 AM - 03:00 PM)', status: 'On Duty' },
    { id: '2', name: 'Amit Verma', role: 'Reception Supervisor', shift: 'Morning (07:00 AM - 03:00 PM)', status: 'On Duty' },
    { id: '3', name: 'Dr. Rajesh Kumar', role: 'Pediatrician', shift: 'Afternoon (03:00 PM - 11:00 PM)', status: 'Scheduled' },
    { id: '4', name: 'Sunita Rao', role: 'ER Nurse Staff', shift: 'Night (11:00 PM - 07:00 AM)', status: 'Scheduled' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Nursing Staff');
  const [shiftTime, setShiftTime] = useState('Morning (07:00 AM - 03:00 PM)');

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newShift: StaffShift = {
      id: String(shifts.length + 1),
      name,
      role,
      shift: shiftTime,
      status: 'Scheduled',
    };

    setShifts([...shifts, newShift]);
    setShowAddForm(false);
    setName('');
    showToast(`Staff shift scheduled for ${name}.`);
  };

  const toggleShiftStatus = (id: string) => {
    setShifts(
      shifts.map((s) => {
        if (s.id === id) {
          const next = s.status === 'On Duty' ? 'On Leave' : s.status === 'On Leave' ? 'Scheduled' : 'On Duty';
          showToast(`${s.name} status updated to ${next}.`);
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <Stethoscope className="h-3 w-3" /> Clinical Registry
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Hospital Clinical Departments & Staff Shifts
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Oversee active clinical departments, track patient distribution loads, audit head physician assignments, and configure nursing & medical shift schedules.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Schedule Shift
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Department List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Clinical Units Directory
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="rounded-xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card card-hover space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{dept.name}</h4>
                    <span className="text-[10px] text-slate-450 block mt-0.5">Shift Lead: <strong className="text-slate-700 dark:text-white">{dept.head}</strong></span>
                  </div>
                  <span className={`chip text-[9px] ${
                    dept.status === 'Critical Load' ? 'chip-red' : 'chip-green'
                  }`}>
                    {dept.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750">
                    <span className="text-[10px] text-slate-450 uppercase block font-semibold">Patients Admitted</span>
                    <span className="text-base font-extrabold text-slate-850 dark:text-white block mt-0.5">{dept.activePatients}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750">
                    <span className="text-[10px] text-slate-450 uppercase block font-semibold">Doctors Active</span>
                    <span className="text-base font-extrabold text-slate-850 dark:text-white block mt-0.5">{dept.onDutyDoctors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Shift Scheduler */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Active Shift Staffing
          </h3>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card p-4 space-y-3">
            {shifts.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{s.role} • {s.shift.split(' ')[0]}</span>
                </div>
                <button
                  onClick={() => toggleShiftStatus(s.id)}
                  className={`chip text-[9px] hover:opacity-80 transition-all ${
                    s.status === 'On Duty' ? 'chip-green' : s.status === 'Scheduled' ? 'chip-teal' : 'chip-amber'
                  }`}
                >
                  {s.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Shift Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-modal border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="h-1 w-full bg-teal-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-teal-655" /> Schedule Staff Shift
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleAddShift} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-350">Staff Member Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nurse Sunita Rao"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-350">Role Ranks:</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none font-medium"
                    >
                      <option value="Nursing Staff">Nursing Staff</option>
                      <option value="Nursing Lead">Nursing Lead</option>
                      <option value="Reception Supervisor">Receptionist</option>
                      <option value="Resident Doctor">Resident Doctor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-350">Shift Slot:</label>
                    <select
                      value={shiftTime}
                      onChange={(e) => setShiftTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none font-medium"
                    >
                      <option value="Morning (07:00 AM - 03:00 PM)">Morning</option>
                      <option value="Afternoon (03:00 PM - 11:00 PM)">Afternoon</option>
                      <option value="Night (11:00 PM - 07:00 AM)">Night Shift</option>
                    </select>
                  </div>
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
                    Schedule shift
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

'use client';

import React, { useState } from 'react';
import { Users, Plus, Stethoscope, Clock, ShieldAlert, CheckCircle2, XCircle, Search, Save, UserCheck, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DoctorRoster {
  id: string;
  name: string;
  specialty: string;
  department: string;
  hours: string;
  status: 'On Duty' | 'In Consultation' | 'Off Duty';
}

export default function DoctorManagementPage() {
  const { showToast } = useApp();
  
  const [doctors, setDoctors] = useState<DoctorRoster[]>([
    { id: '1', name: 'Dr. Ananya Mehta', specialty: 'General Physician', department: 'OPD-1', hours: '09:00 AM - 01:00 PM', status: 'On Duty' },
    { id: '2', name: 'Dr. S. N. Roy', specialty: 'Endocrinologist', department: 'Endo Clinic', hours: '02:00 PM - 06:00 PM', status: 'In Consultation' },
    { id: '3', name: 'Dr. V. K. Gupta', specialty: 'Cardiologist', department: 'ICU / Cardio Wing', hours: '10:00 AM - 04:00 PM', status: 'On Duty' },
    { id: '4', name: 'Dr. Rajesh Kumar', specialty: 'Pediatrician', department: 'Pediatric Care', hours: '11:00 AM - 03:00 PM', status: 'Off Duty' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [department, setDepartment] = useState('OPD-1');
  const [hours, setHours] = useState('09:00 AM - 05:00 PM');

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim()) return;

    const newDoc: DoctorRoster = {
      id: String(doctors.length + 1),
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      specialty,
      department,
      hours,
      status: 'On Duty',
    };

    setDoctors([...doctors, newDoc]);
    setShowAddForm(false);
    setName('');
    setSpecialty('');
    showToast(`Physician ${newDoc.name} registered to roster.`);
  };

  const toggleStatus = (id: string) => {
    setDoctors(
      doctors.map((d) => {
        if (d.id === id) {
          const nextStatus =
            d.status === 'On Duty'
              ? 'In Consultation'
              : d.status === 'In Consultation'
              ? 'Off Duty'
              : 'On Duty';
          showToast(`${d.name} status updated to ${nextStatus}.`);
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const deleteDoctor = (id: string, docName: string) => {
    setDoctors(doctors.filter((d) => d.id !== id));
    showToast(`Removed ${docName} from active roster.`);
  };

  const filteredDocs = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <Users className="h-3 w-3" /> Doctor Management
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Physician Directory & Roster Management
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Configure active duty rosters, register new medical staff, adjust clinical consulting hours, and track real-time consultant status.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Doctor
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Doctors List & Filters */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 max-w-sm relative">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-450 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialty, or department..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs font-medium outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850 text-slate-400 border-b border-slate-100 dark:border-slate-800 font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Physician Name</th>
                    <th className="px-5 py-4">Clinical Specialty</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Consulting Hours</th>
                    <th className="px-5 py-4">Duty Status</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-350">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-655 dark:text-white shrink-0">
                            {doc.name.replace('Dr. ', '').charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">{doc.specialty}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                          {doc.department}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500">{doc.hours}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(doc.id)}
                          className={`chip font-bold text-[9px] hover:opacity-80 transition-all ${
                            doc.status === 'On Duty'
                              ? 'chip-green'
                              : doc.status === 'In Consultation'
                              ? 'chip-teal'
                              : 'chip-amber'
                          }`}
                        >
                          {doc.status}
                        </button>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteDoctor(doc.id, doc.name)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          title="Remove Doctor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-450">
                        No doctors matching search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Stats */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-teal-655" /> Physician Census Summary
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900">
                <span className="text-[10px] font-bold text-teal-650 dark:text-teal-400 uppercase tracking-wider block">Total Doctors</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{doctors.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900">
                <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider block">On Duty Now</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                  {doctors.filter((d) => d.status === 'On Duty' || d.status === 'In Consultation').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-modal border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="h-1 w-full bg-teal-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-teal-655" /> Register New Physician
                </h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleAddDoctor} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-350">Doctor Full Name:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-350">Specialty / Field:</label>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Dermatologist, Cardiologist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-350">Department:</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none font-medium"
                    >
                      <option value="OPD-1">OPD-1</option>
                      <option value="Cardio Wing">Cardio Wing</option>
                      <option value="ICU">ICU</option>
                      <option value="Pediatric Care">Pediatric Care</option>
                      <option value="Emergency Wing">Emergency Wing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-350">Consulting Hours:</label>
                    <input
                      type="text"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none font-medium"
                    />
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
                    Register Doctor
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

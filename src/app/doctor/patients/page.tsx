import React from 'react';
import { getAuthorizedPatients } from '@/services/doctorMockData';
import Link from 'next/link';
import { Search, ChevronRight, Activity, CalendarClock, Users } from 'lucide-react';

export default function PatientsDirectory() {
  const patients = getAuthorizedPatients();

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Patients
          </h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
            Directory of your authorized patients.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name, ID, or condition..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4D50A2]/20 focus:border-[#4D50A2] transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patients.map(patient => (
          <Link key={patient.id} href={`/doctor/patient/${patient.id}`} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-[#4D50A2]/40 hover:shadow-md transition-all group flex flex-col justify-between h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#4D50A2] flex flex-col items-center justify-center border border-indigo-100/50">
                  <span className="text-lg font-black">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-[#4D50A2] transition-colors">{patient.name}</h3>
                  <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2">
                    <span>{patient.age}y</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{patient.gender}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="font-bold text-rose-500">{patient.bloodGroup}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#4D50A2] transition-colors" />
            </div>

            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-semibold">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Conditions
                </div>
                <div className="font-bold text-slate-700 truncate max-w-[150px]">
                  {patient.conditions.length > 0 ? patient.conditions.join(', ') : 'None recorded'}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-semibold">
                  <CalendarClock className="w-4 h-4 text-amber-500" />
                  Last Visit
                </div>
                <div className="font-bold text-slate-700">
                  {new Date(patient.lastVisit).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {patients.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-20 flex flex-col items-center text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <Users className="w-10 h-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No authorized patients</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1 max-w-sm">
              You currently do not have access to any patient records. Scan a patient's QR code to request access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { getPatientById } from '@/services/doctorMockData';
import { notFound } from 'next/navigation';
import { 
  Activity, 
  Pill, 
  FileText, 
  ShieldAlert,
  ArrowLeft,
  HeartPulse,
  Thermometer,
  Droplets
} from 'lucide-react';
import Link from 'next/link';

export default async function PatientClinicalView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const patient = getPatientById(resolvedParams.id);

  if (!patient) {
    notFound();
  }

  const latestVitals = patient.vitals[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Back & Header */}
      <div className="space-y-4">
        <Link href="/doctor/patients" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#4D50A2] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#2F3273] text-white flex items-center justify-center font-black text-2xl shadow-lg">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">{patient.name}</h1>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 mt-1">
                <span>{patient.age} years</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>{patient.gender}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span className="text-rose-500 font-bold">Blood: {patient.bloodGroup}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                <span>ID: <span className="font-mono">{patient.id}</span></span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-indigo-50 text-[#4D50A2] font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
              Add Note
            </button>
            <button className="px-4 py-2 bg-[#4D50A2] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#3B3D80] transition-colors">
              Prescribe
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Clinical Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Critical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-3">
                <ShieldAlert className="w-5 h-5" />
                Known Allergies
              </div>
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map(a => (
                    <span key={a} className="px-3 py-1 bg-white text-rose-700 text-xs font-bold rounded-lg border border-rose-200 shadow-sm">{a}</span>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-semibold text-rose-600/70">No known allergies.</div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-3">
                <Activity className="w-5 h-5" />
                Conditions
              </div>
              {patient.conditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map(c => (
                    <span key={c} className="px-3 py-1 bg-white text-amber-700 text-xs font-bold rounded-lg border border-amber-200 shadow-sm">{c}</span>
                  ))}
                </div>
              ) : (
                <div className="text-sm font-semibold text-amber-600/70">No recorded conditions.</div>
              )}
            </div>
          </div>

          {/* Vitals */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">Latest Vitals</h2>
              {latestVitals && (
                <span className="text-xs font-semibold text-slate-400">
                  Recorded: {new Date(latestVitals.date).toLocaleString()}
                </span>
              )}
            </div>

            {latestVitals ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <VitalCard icon={HeartPulse} label="Heart Rate" value={latestVitals.heartRate} unit="bpm" color="rose" />
                <VitalCard icon={Activity} label="Blood Pressure" value={`${latestVitals.bpSystolic}/${latestVitals.bpDiastolic}`} unit="mmHg" color="indigo" />
                <VitalCard icon={Droplets} label="SpO2" value={latestVitals.spO2} unit="%" color="sky" />
                <VitalCard icon={Thermometer} label="Temp" value={latestVitals.temperature} unit="°F" color="amber" />
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">No vitals recorded</p>
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">Active Medications</h2>
            </div>

            {patient.medications.length > 0 ? (
              <div className="space-y-3">
                {patient.medications.map(med => (
                  <div key={med.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-500 flex items-center justify-center">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{med.name} <span className="text-slate-400 font-normal">{med.dosage}</span></div>
                        <div className="text-xs font-semibold text-slate-500">{med.frequency}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-500 uppercase">{med.status}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Rx: {med.prescribedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">No active medications</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Reports & History */}
        <div className="space-y-6">
          {/* Reports */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">Reports</h2>
            </div>
            
            {patient.reports.length > 0 ? (
              <div className="space-y-3">
                {patient.reports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 line-clamp-2">{rep.title}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-bold text-slate-400">{new Date(rep.date).toLocaleDateString()}</span>
                          <span className="text-[10px] font-bold uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{rep.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">No reports available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VitalCard({ icon: Icon, label, value, unit, color }: { icon: any, label: string, value: string | number, unit: string, color: 'rose' | 'indigo' | 'sky' | 'amber' }) {
  const colors = {
    rose: 'bg-rose-50 text-rose-500 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-500 border-indigo-100',
    sky: 'bg-sky-50 text-sky-500 border-sky-100',
    amber: 'bg-amber-50 text-amber-500 border-amber-100',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} flex flex-col items-center text-center`}>
      <Icon className="w-5 h-5 mb-2 opacity-80" />
      <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</div>
      <div className="text-xl font-black">
        {value} <span className="text-xs font-bold opacity-60 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

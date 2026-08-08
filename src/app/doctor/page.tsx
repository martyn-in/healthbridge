import React from 'react';
import { getSession } from '@/lib/auth/session';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { Calendar, Users, QrCode, FileText, AlertCircle, ChevronRight, Clock, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DoctorDashboard() {
  const session = await getSession();
  const doctorName = session?.name || 'Doctor';

  // Fetch data from Convex
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Use Promise.all for parallel fetching
  const [appointments, allPatients] = await Promise.all([
    convex.query(api.appointments.getByDate, { date: todayStr }),
    convex.query(api.patients.getAll)
  ]);

  const patientQueue = allPatients.slice(0, 3); // Just show top 3 as recent/queue
  const recentPatients = allPatients.slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Good morning, Dr. {doctorName.split(' ')[0]}
          </h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
            Clinical Overview • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction href="/doctor/scan" icon={QrCode} label="Scan Patient QR" color="bg-indigo-50 text-[#4D50A2]" />
        <QuickAction href="/doctor/patients" icon={Users} label="Find Patient" color="bg-sky-50 text-sky-600" />
        <QuickAction href="/doctor/appointments" icon={Calendar} label="Appointments" color="bg-emerald-50 text-emerald-600" />
        <QuickAction href="/doctor/reports" icon={FileText} label="Open Reports" color="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column - Appointments & Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Today's Appointments" count={appointments.length}>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map(apt => (
                  <div key={apt._id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{apt.time.split(' ')[1]}</span>
                        <span className="text-sm font-black text-[#4D50A2] leading-none">{apt.time.split(' ')[0]}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{apt.patientName}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">{apt.type} • {apt.reason}</div>
                      </div>
                    </div>
                    <Link href={`/doctor/patient/${apt.patientId}`} className="p-2 rounded-lg text-slate-400 hover:text-[#4D50A2] hover:bg-indigo-50 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Calendar} 
                title="No appointments today" 
                description="Your schedule is clear for the day." 
              />
            )}
          </Section>

          <Section title="Patient Queue" count={patientQueue.length}>
             {patientQueue.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {patientQueue.map(p => (
                   <Link key={p._id} href={`/doctor/patient/${p._id}`} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#4D50A2]/30 transition-colors group">
                     <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm shrink-0">
                       {p.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="font-bold text-slate-800 truncate">{p.name}</div>
                       <div className="text-xs font-semibold text-slate-500 truncate">{p.age}y • {p.gender}</div>
                     </div>
                     <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#4D50A2]" />
                   </Link>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Users} 
                title="Queue is empty" 
                description="No patients are currently waiting." 
              />
            )}
          </Section>
        </div>

        {/* Side Column - Recent Patients & Alerts */}
        <div className="space-y-6">
          <Section title="Recent Patients">
            {recentPatients.length > 0 ? (
              <div className="space-y-3">
                 {recentPatients.map(p => (
                   <Link key={p._id} href={`/doctor/patient/${p._id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                     <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#4D50A2] flex items-center justify-center font-bold text-xs shrink-0">
                       {p.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-slate-700 truncate">{p.name}</div>
                       <div className="text-[10px] font-semibold text-slate-400 truncate">Last accessed: Today</div>
                     </div>
                   </Link>
                 ))}
              </div>
            ) : (
              <EmptyState 
                icon={UserCircle} 
                title="No recent activity" 
                description="Recently accessed patient records will appear here." 
                small
              />
            )}
          </Section>

          <Section title="Clinical Alerts">
            {/* Example of a real alert tied to data */}
            {patientQueue.some(p => p.allergies.length > 0) ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-rose-800">High-Risk Allergy Flag</div>
                    <div className="text-xs font-semibold text-rose-600/80 mt-1">
                      {patientQueue.find(p => p.allergies.length > 0)?.name} has a recorded allergy to {patientQueue.find(p => p.allergies.length > 0)?.allergies[0]}. Verify before prescribing.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState 
                icon={AlertCircle} 
                title="No alerts" 
                description="You have no pending clinical alerts." 
                small
              />
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

// Subcomponents

function QuickAction({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#4D50A2]/30 hover:shadow-md transition-all group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-bold text-slate-700 text-center">{label}</span>
    </Link>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs text-slate-500">{count}</span>
          )}
        </h2>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, small = false }: { icon: any; title: string; description: string; small?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 ${small ? 'p-6' : 'p-10'}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <p className="text-xs font-semibold text-slate-500 mt-1 max-w-[200px] mx-auto">{description}</p>
    </div>
  );
}



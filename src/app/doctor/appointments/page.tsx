import React from 'react';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { Calendar, Clock, Video, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function AppointmentsPage() {
  const appointments = await convex.query(api.appointments.getByDate, {});
  
  // Simple grouping for prototype
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const upcomingAppointments = appointments.filter(a => a.date > todayStr);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Appointments
          </h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
            Manage your schedule and consultations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              Today
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-xs text-emerald-700">{todayAppointments.length}</span>
            </h2>
            
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map(apt => <AppointmentCard key={apt._id} apt={apt} active />)}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">No appointments today</p>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              Upcoming
            </h2>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map(apt => <AppointmentCard key={apt._id} apt={apt} />)}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">No upcoming appointments</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-4">Calendar</h3>
            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-400">Mini Calendar Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ apt, active = false }: { apt: any, active?: boolean }) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all ${
      active ? 'bg-white border-indigo-200 shadow-md' : 'bg-slate-50 border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
          active ? 'bg-indigo-50 text-[#4D50A2] border border-indigo-100' : 'bg-white text-slate-500 border border-slate-200'
        }`}>
          <span className="text-[10px] font-black uppercase">{apt.time.split(' ')[1]}</span>
          <span className="text-base font-black leading-none">{apt.time.split(' ')[0]}</span>
        </div>
        
        <div>
          <Link href={`/doctor/patient/${apt.patientId}`} className="font-black text-lg text-slate-800 hover:text-[#4D50A2] transition-colors">
            {apt.patientName}
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
            <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 45 min</div>
            <div className="flex items-center gap-1 text-emerald-600"><Video className="w-3.5 h-3.5" /> Telehealth</div>
          </div>
          <div className="text-sm text-slate-600 font-medium mt-2">{apt.type} • {apt.reason}</div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center justify-end gap-2">
         {active && (
           <button className="px-4 py-2 bg-[#4D50A2] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#3B3D80] transition-colors">
             Start Call
           </button>
         )}
         <Link href={`/doctor/patient/${apt.patientId}`} className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
           <ChevronRight className="w-5 h-5" />
         </Link>
      </div>
    </div>
  );
}

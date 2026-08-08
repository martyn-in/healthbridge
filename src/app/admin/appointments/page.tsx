import React from 'react';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';

export default async function AdminAppointmentsPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login/admin');

  // Fetch from convex (We'll reuse getByDate which gets all if no date is passed)
  const appointments = await convex.query(api.appointments.getByDate, {});

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments Oversight</h1>
        <p className="text-sm text-slate-500 mt-1">Platform-wide appointment monitoring</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Patient</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        {apt.patientName[0]}
                      </div>
                      <div className="text-sm font-bold text-slate-900">{apt.patientName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {apt.type}
                  </td>
                  <td className="px-6 py-4">
                    {apt.status === 'completed' && <span className="inline-flex px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">Completed</span>}
                    {apt.status === 'scheduled' && <span className="inline-flex px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">Scheduled</span>}
                    {apt.status === 'cancelled' && <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">Cancelled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {appointments.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

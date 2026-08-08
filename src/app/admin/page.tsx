import React from 'react';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { getSession } from '@/lib/auth/session';
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Activity, 
  Calendar, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login/admin');

  const overview = await convex.query(api.admin.getOverview, { actorId: session.googleSub });
  const pendingDoctors = await convex.query(api.admin.getUsers, { actorId: session.googleSub }).then(
    users => users.filter(u => u.role === 'doctor' && u.doctorVerificationStatus === 'pending').slice(0, 5)
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HealthBridge Administration</h1>
        <p className="text-sm text-slate-500 mt-1">Platform management and system oversight</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Patients</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.patientsCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Stethoscope className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Doctors</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.doctorsCount}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Pending Verif.</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.pendingDoctors}</div>
          {overview.pendingDoctors > 0 && (
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Acc.</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{overview.activeAccounts}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">Operations Overview</h2>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                     <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-2xl font-black text-slate-900">{overview.totalAppointments}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase">Appointments</div>
                   </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-2xl font-black text-slate-900">{overview.totalReports}</div>
                     <div className="text-xs font-bold text-slate-500 uppercase">Reports</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Action Needed</h2>
               {overview.pendingDoctors > 0 && (
                 <span className="px-2 py-1 bg-rose-100 text-rose-600 rounded-md text-[10px] font-bold">
                   {overview.pendingDoctors} pending
                 </span>
               )}
             </div>

             {pendingDoctors.length > 0 ? (
               <div className="space-y-3">
                 {pendingDoctors.map(doctor => (
                   <div key={doctor._id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">
                          {doctor.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{doctor.name}</div>
                          <div className="text-[10px] text-slate-500">{new Date(doctor.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Link href="/admin/doctors/verification" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                        Review
                      </Link>
                   </div>
                 ))}
                 <Link href="/admin/doctors/verification" className="block w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors mt-2">
                   View all pending
                 </Link>
               </div>
             ) : (
               <div className="text-center py-8">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <p className="text-sm font-medium text-slate-600">All caught up!</p>
                 <p className="text-xs text-slate-500 mt-1">No doctors pending verification.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

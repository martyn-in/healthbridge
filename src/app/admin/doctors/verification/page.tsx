import React from 'react';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ShieldCheck, Mail, Building, MapPin, Hash, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import DoctorVerificationActions from './DoctorVerificationActions';

export default async function DoctorVerificationQueue() {
  const session = await getSession();
  const adminSecret = process.env.CONVEX_ADMIN_SECRET || '';
  const users = await convex.query(api.admin.getUsers, { adminSecret });
  const pendingDoctors = users.filter(u => u.role === 'doctor' && u.doctorVerificationStatus === 'pending');

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Verification Queue</h1>
        <p className="text-sm text-slate-500 mt-1">Review and approve applications for Doctor Portal access</p>
      </div>

      {pendingDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Queue is empty</h2>
          <p className="text-slate-500 mt-2">There are no pending doctor verifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingDoctors.map(doctor => (
            <div key={doctor._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pl-4">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex flex-col items-center justify-center border border-indigo-100">
                    <span className="text-2xl font-black">{doctor.name[0]}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {doctor.email}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="flex items-start gap-2">
                         <Hash className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Auth Identity</div>
                           <div className="text-sm font-medium text-slate-700 font-mono text-xs break-all">{doctor.googleSub}</div>
                         </div>
                       </div>
                       <div className="flex items-start gap-2">
                         <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account Created</div>
                           <div className="text-sm font-medium text-slate-700">{new Date(doctor.createdAt).toLocaleString()}</div>
                         </div>
                       </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                      <strong>Security Note:</strong> Approving this application grants full access to the Clinical Portal and sensitive patient records. Verify the identity manually before proceeding.
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 shrink-0">
                   <DoctorVerificationActions targetUserId={doctor._id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

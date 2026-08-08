import React from 'react';
import { getSession } from '@/lib/auth/session';
import { ShieldCheck, Mail, Building, MapPin, Hash, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default async function DoctorProfile() {
  const session = await getSession();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
          Clinical Profile
        </h1>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
          Manage your verified professional identity and settings.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-md relative">
            {session?.avatarUrl ? (
              <Image src={session.avatarUrl} alt={session.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-3xl">
                {session?.name?.[0] || 'D'}
              </div>
            )}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-2xl font-black text-slate-800">Dr. {session?.name || 'Doctor'}</h2>
              {session?.doctorVerified && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-[#4D50A2]">Internal Medicine • Cardiology</p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                HealthBridge General Hospital
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contact Information</h3>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Professional Email</div>
                <div className="text-sm font-semibold text-slate-700">{session?.email}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Licensure & Verification</h3>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Hash className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Medical License Number</div>
                <div className="text-sm font-semibold text-slate-700 font-mono">MD-8472910-CA</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="text-[10px] font-bold uppercase text-emerald-600/70">Status</div>
                <div className="text-sm font-semibold text-emerald-700">Active & Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

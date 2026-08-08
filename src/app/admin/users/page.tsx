import React from 'react';
import { convex } from '@/lib/convex';
import { api } from '@convex/_generated/api';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ShieldAlert, User, ShieldCheck, Mail, Calendar, Clock, MoreVertical, XCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import UserActions from './UserActions';

export default async function AdminUsersPage() {
  const session = await getSession();
  const adminSecret = process.env.CONVEX_ADMIN_SECRET || '';
  const users = await convex.query(api.admin.getUsers, { adminSecret });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all accounts in the HealthBridge system</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Created</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" /> Admin
                      </span>
                    )}
                    {user.role === 'doctor' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Doctor
                        {user.doctorVerificationStatus === 'pending' && (
                          <span className="ml-1 w-2 h-2 rounded-full bg-amber-400" title="Pending Verification" />
                        )}
                      </span>
                    )}
                    {user.role === 'patient' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                        <User className="w-3.5 h-3.5" /> Patient
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.accountStatus === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 text-xs font-bold">
                        <XCircle className="w-4 h-4" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">{new Date(user.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <UserActions 
                        userId={user._id} 
                        currentStatus={user.accountStatus} 
                        isSelf={false} 
                     />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

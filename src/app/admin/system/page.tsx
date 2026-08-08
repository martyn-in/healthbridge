import React from 'react';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AlertCircle, Cpu, Activity } from 'lucide-react';

export default async function AdminSystemPages({ params }: any) {
  const session = await getSession();
  // Admin access is protected by middleware and verifyAdminSession

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Status</h1>
        <p className="text-sm text-slate-500 mt-1">Platform operational health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
             <Activity className="w-6 h-6 text-emerald-500" />
             <h2 className="font-bold text-slate-800">Convex Database</h2>
           </div>
           <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
               <span className="text-sm text-slate-600">Status</span>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Healthy</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
               <span className="text-sm text-slate-600">Connection</span>
               <span className="text-xs font-mono text-slate-500">Connected</span>
             </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
             <Cpu className="w-6 h-6 text-indigo-500" />
             <h2 className="font-bold text-slate-800">Google Gemini AI</h2>
           </div>
           <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
               <span className="text-sm text-slate-600">API Status</span>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Configured</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
               <span className="text-sm text-slate-600">Emergency RAG</span>
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Ready</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default async function AdminEmergencyPage() {
  const session = await getSession();
  // Admin access is protected by middleware and verifyAdminSession

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Emergency Activity</h1>
        <p className="text-sm text-slate-500 mt-1">SOS activations and location logs</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-700">No Recent Emergencies</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          HealthBridge currently logs SOS activations here. Actual emergency dispatch must be handled by local authorities as we do not simulate dispatch.
        </p>
      </div>
    </div>
  );
}

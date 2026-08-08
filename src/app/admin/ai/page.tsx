import React from 'react';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Cpu } from 'lucide-react';

export default async function AdminAIPage() {
  const session = await getSession();
  // Admin access is protected by middleware and verifyAdminSession

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI & Knowledge</h1>
        <p className="text-sm text-slate-500 mt-1">Gemini AI Usage and RAG configuration</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <Cpu className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-700">AI Analytics</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Gemini requests and RAG source indexing metrics will appear here once significant measurable traffic accumulates.
        </p>
      </div>
    </div>
  );
}

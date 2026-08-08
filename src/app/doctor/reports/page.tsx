import React from 'react';
import { FileText, Search } from 'lucide-react';

export default function DoctorReportsPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
            Reports Repository
          </h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
            Access and analyze patient medical reports and lab results.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search reports by patient name, ID, or report type..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4D50A2]/20 focus:border-[#4D50A2] transition-all"
        />
      </div>

      <div className="py-20 flex flex-col items-center text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
        <FileText className="w-10 h-10 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-700">No reports found</h3>
        <p className="text-sm font-semibold text-slate-500 mt-1 max-w-sm">
          There are no reports available in your repository at this time.
        </p>
      </div>
    </div>
  );
}

"use client";

import { Building2, Users, Stethoscope, TrendingUp } from "lucide-react";

export default function ClinicAdminDashboard() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clinic Administration</h1>
        <p className="text-gray-500 mt-2">Overview of clinic performance and staff management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <TrendingUp className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Daily Revenue</h3>
          <p className="text-3xl font-bold mt-2">$4,250</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Stethoscope className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Active Doctors</h3>
          <p className="text-3xl font-bold mt-2">8/10</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Building2 className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Departments</h3>
          <p className="text-3xl font-bold mt-2">6</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Users className="w-8 h-8 text-orange-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Total Staff</h3>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
      </div>
    </div>
  );
}

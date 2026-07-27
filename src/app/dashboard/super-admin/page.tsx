"use client";

import { ShieldAlert, Activity, Server, Database } from "lucide-react";

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Console</h1>
        <p className="text-gray-500 mt-2">Platform-wide system health, metrics, and security logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 shadow-sm">
          <ShieldAlert className="w-8 h-8 text-red-500 mb-4" />
          <h3 className="text-red-900 dark:text-red-400 font-medium">Security Alerts</h3>
          <p className="text-3xl font-bold mt-2 text-red-700">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Activity className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Active Clinics</h3>
          <p className="text-3xl font-bold mt-2">14</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Server className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-gray-500 font-medium">API Health</h3>
          <p className="text-3xl font-bold mt-2 text-emerald-500">99.9%</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Database className="w-8 h-8 text-orange-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Total Users</h3>
          <p className="text-3xl font-bold mt-2">12,450</p>
        </div>
      </div>
    </div>
  );
}

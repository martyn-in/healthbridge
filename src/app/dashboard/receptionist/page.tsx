"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Users, Clock, CreditCard, Activity } from "lucide-react";

export default function ReceptionistDashboard() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reception Desk</h1>
        <p className="text-gray-500 mt-2">Manage daily walk-ins, appointments, and billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Users className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Patients Waiting</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Clock className="w-8 h-8 text-orange-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Avg Wait Time</h3>
          <p className="text-3xl font-bold mt-2">18 min</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <CreditCard className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Pending Bills</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Activity className="w-8 h-8 text-teal-500 mb-4" />
          <h3 className="text-gray-500 font-medium">Completed Today</h3>
          <p className="text-3xl font-bold mt-2">42</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Live Queue</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

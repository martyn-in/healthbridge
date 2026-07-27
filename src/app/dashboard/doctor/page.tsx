"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Users, CalendarDays, ClipboardList, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DoctorDashboard() {
  const { userId } = useAuth();
  
  // Real Convex Queries
  const user = useQuery(api.users.getUser, userId ? { clerkId: userId } : "skip");
  const appointments = useQuery(
    api.appointments.getDoctorAppointments,
    user?._id ? { doctorId: user._id } : "skip"
  );
  
  const todayAppointments = appointments?.filter(a => {
    const today = new Date();
    const apptDate = new Date(a.datetime);
    return today.toDateString() === apptDate.toDateString();
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, Dr. {user?.lastName || "Doctor"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's what your schedule looks like for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
            <CalendarDays className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Today's Patients</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{todayAppointments?.length || 0}</span>
            <span className="text-sm font-medium text-gray-400">scheduled</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Patients</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">1,248</span>
            <span className="text-sm font-medium text-emerald-500">+12 this week</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-4">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Pending Lab Reports</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">5</span>
            <span className="text-sm font-medium text-orange-500">Requires review</span>
          </div>
        </motion.div>
      </div>

      {/* Today's Schedule Overview */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Next Appointment</h2>
          <Link href="/dashboard/doctor/appointments">
            <span className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer">
              View all <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
        
        {todayAppointments && todayAppointments.length > 0 ? (
          <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
            <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center shadow-sm text-indigo-600 dark:text-indigo-400 font-bold">
              <span className="text-lg leading-none">{new Date(todayAppointments[0].datetime).getHours()}</span>
              <span className="text-xs uppercase leading-none mt-1">
                {new Date(todayAppointments[0].datetime).getHours() >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Patient Review</h3>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" /> {new Date(todayAppointments[0].datetime).toLocaleTimeString()}
              </p>
            </div>
            <button className="ml-auto bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Start Consultation
            </button>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No appointments remaining for today.</p>
          </div>
        )}
      </div>
    </div>
  );
}

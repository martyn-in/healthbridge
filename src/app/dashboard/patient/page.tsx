"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Calendar, FileText, Activity, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PatientDashboard() {
  const { userId } = useAuth();
  
  // Real Convex Queries
  const user = useQuery(api.users.getUser, userId ? { clerkId: userId } : "skip");
  const appointments = useQuery(
    api.appointments.getPatientAppointments,
    user?._id ? { patientId: user._id } : "skip"
  );
  
  const upcomingAppointment = appointments?.find(a => a.status === "scheduled" && a.datetime > Date.now());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Good morning, {user?.firstName || "Patient"}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here is an overview of your health status and upcoming schedules.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Health Score</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">92</span>
            <span className="text-sm font-medium text-emerald-500">+4% this month</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Appointments</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{appointments?.length || 0}</span>
            <span className="text-sm font-medium text-gray-400">total</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Medical Records</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">12</span>
            <span className="text-sm font-medium text-purple-500">2 new</span>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Appointment */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-3xl p-8 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-md mb-4 inline-block">
              Next Appointment
            </span>
            {upcomingAppointment ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Dr. Sarah Jenkins</h2>
                <div className="flex items-center gap-4 text-teal-50">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {new Date(upcomingAppointment.datetime).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {new Date(upcomingAppointment.datetime).toLocaleTimeString()}</span>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">No upcoming appointments</h2>
                <p className="text-teal-50">Book an appointment to see your schedule here.</p>
              </>
            )}
          </div>
          <Link href="/dashboard/patient/appointments">
            <button className="bg-white text-teal-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
              Book Appointment <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

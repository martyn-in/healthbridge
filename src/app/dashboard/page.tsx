'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  FileText,
  ScanLine,
  MapPin,
  Pill,
  ShieldAlert,
  Calendar,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronRight,
  Plus,
  Edit3,
  HeartPulse,
  SmilePlus,
  Smile,
  Meh,
  Frown,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export default function DashboardOverviewPage() {
  const {
    activeProfile,
    profiles,
    setActiveProfile,
    updatePrimaryProfile,
    medications,
    medicationLogs,
    logMedicationStatus,
    appointments,
    adherencePercentage,
    triggerSos,
    wellness,
    updateWellness,
    language,
    showToast,
  } = useApp();

  const router = useRouter();
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Good');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(activeProfile.name);
  const [editAge, setEditAge] = useState(activeProfile.age);
  const [editBloodGroup, setEditBloodGroup] = useState(activeProfile.bloodGroup);

  const todayMeds = medications.filter((m) => m.profileId === activeProfile.id || m.profileId === 'prof-primary');
  const upcomingApt = appointments.find((a) => a.status === 'Upcoming');

  const feelings = [
    { label: 'Great', icon: SmilePlus },
    { label: 'Good', icon: Smile },
    { label: 'Okay', icon: Meh },
    { label: 'Stressed', icon: Frown },
    { label: 'Unwell', icon: AlertCircle },
  ];

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrimaryProfile({
      name: editName,
      age: Number(editAge),
      bloodGroup: editBloodGroup,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting & Emergency Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-300 font-bold mb-1">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span className="bg-teal-500/20 px-2.5 py-0.5 rounded-full text-cyan-300 border border-teal-500/30">
              Active: {activeProfile.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to HealthBridge AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
            Live Application Active. Understand symptoms, upload lab reports, scan prescriptions, and manage family health records in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerSos}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-red-600/30 transition-transform active:scale-95 flex items-center gap-2 animate-pulse"
          >
            <ShieldAlert className="h-4 w-4" /> {t(language, 'emergencySos')}
          </button>
        </div>
      </div>

      {/* Profile Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {isEditingProfile ? (
          <form onSubmit={handleSaveProfileEdit} className="flex flex-wrap items-center gap-3 text-xs w-full">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              placeholder="Your Name"
            />
            <input
              type="number"
              value={editAge}
              onChange={(e) => setEditAge(Number(e.target.value))}
              className="w-20 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              placeholder="Age"
            />
            <select
              value={editBloodGroup}
              onChange={(e) => setEditBloodGroup(e.target.value)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            >
              <option value="O+">O+</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="AB+">AB+</option>
              <option value="O-">O-</option>
              <option value="A-">A-</option>
            </select>
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold">
              Save Profile
            </button>
            <button type="button" onClick={() => setIsEditingProfile(false)} className="text-slate-400">
              Cancel
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white font-extrabold text-lg shadow-md">
                {activeProfile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeProfile.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-cyan-300 text-[10px] font-bold">
                    Blood Group: {activeProfile.bloodGroup}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {activeProfile.age} yrs • {activeProfile.gender} | Allergies:{' '}
                  {activeProfile.allergies.length > 0 ? activeProfile.allergies.join(', ') : 'None listed'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditName(activeProfile.name);
                setEditAge(activeProfile.age);
                setEditBloodGroup(activeProfile.bloodGroup);
                setIsEditingProfile(true);
              }}
              className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile Details
            </button>
          </>
        )}
      </div>

      {/* "How are you feeling today?" Check-in */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t(language, 'howAreYouFeeling')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {feelings.map((f) => {
            const IconComponent = f.icon;
            return (
              <button
                key={f.label}
                onClick={() => {
                  setSelectedFeeling(f.label);
                  updateWellness({ mood: f.label as any });
                  showToast(`Logged daily mood as ${f.label}`);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                  selectedFeeling === f.label
                    ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flagship Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Real Live Healthcare Workflows
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/symptoms"
            className="p-5 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-card hover:shadow-glow transition-all group space-y-3"
          >
            <div className="p-3 rounded-xl bg-white/20 w-fit group-hover:scale-110 transition-transform">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Check Symptoms</h4>
              <p className="text-[11px] text-teal-100 mt-0.5">Real AI Triage</p>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="p-5 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 text-white shadow-card hover:shadow-lg transition-all group space-y-3"
          >
            <div className="p-3 rounded-xl bg-white/20 w-fit group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Analyze Report</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Live File Upload OCR</p>
            </div>
          </Link>

          <Link
            href="/dashboard/prescriptions"
            className="p-5 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-800 text-white shadow-card hover:shadow-lg transition-all group space-y-3"
          >
            <div className="p-3 rounded-xl bg-white/20 w-fit group-hover:scale-110 transition-transform">
              <ScanLine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Scan Medicine</h4>
              <p className="text-[11px] text-cyan-100 mt-0.5">Prescription Reader</p>
            </div>
          </Link>

          <Link
            href="/dashboard/care"
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-card hover:shadow-lg transition-all group space-y-3"
          >
            <div className="p-3 rounded-xl bg-white/20 w-fit group-hover:scale-110 transition-transform">
              <MapPin className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Find Nearby Care</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">Live GPS Discovery</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Meds Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="h-5 w-5 text-teal-600" /> Today's Medication Schedule
                </h3>
                <span className="text-xs text-slate-500">Adherence: {adherencePercentage}% logged</span>
              </div>
              <Link
                href="/dashboard/medications"
                className="text-xs font-bold text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                + Add Medicine <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {todayMeds.length > 0 ? (
              <div className="space-y-3">
                {todayMeds.map((med) => {
                  const todayLog = medicationLogs.find(
                    (l) => l.medicationId === med.id && l.date === new Date().toISOString().split('T')[0]
                  );
                  const isTaken = todayLog?.status === 'taken';

                  return (
                    <div
                      key={med.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        isTaken
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {med.name} ({med.dosage})
                        </span>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {med.instructions} • {med.beforeAfterFood}
                        </p>
                      </div>

                      {isTaken ? (
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Taken
                        </span>
                      ) : (
                        <button
                          onClick={() => logMedicationStatus(med.id, 'taken')}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors"
                        >
                          Mark Taken
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
                <Pill className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No active medication schedule added yet.
                </p>
                <Link
                  href="/dashboard/medications"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Medication Schedule
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Appointment Banner */}
          {upcomingApt ? (
            <div className="rounded-2xl bg-gradient-to-r from-navy-900 to-teal-900 p-5 text-white shadow-card flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white/10 text-cyan-300">
                  <Calendar className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300">
                    Upcoming Consultation
                  </span>
                  <h4 className="text-base font-bold">{upcomingApt.doctorName}</h4>
                  <p className="text-xs text-slate-200">
                    {upcomingApt.specialty} • {upcomingApt.hospitalName}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/appointments"
                className="px-4 py-2 rounded-xl bg-white text-navy-900 font-bold text-xs hover:bg-slate-100 shrink-0"
              >
                Manage
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Doctor Appointments</h4>
                <p className="text-[11px] text-slate-500">No consultations scheduled for today.</p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-teal-600 dark:text-cyan-400"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Family Profiles Quick Switcher */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-teal-600" /> Family Profiles
              </h3>
              <Link href="/dashboard/family" className="text-xs font-bold text-teal-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProfile(p)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    activeProfile.id === p.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-cyan-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.relationship} • {p.bloodGroup}
                      </div>
                    </div>
                  </div>
                  {activeProfile.id === p.id && <span className="text-teal-600 dark:text-cyan-400 font-bold">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Wellness Quick Tracker */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-teal-600" /> Daily Wellness Tracker
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-semibold">Water Intake</span>
                <span className="text-base font-bold text-teal-600 dark:text-cyan-400">
                  {wellness.waterIntakeMl} / {wellness.waterGoalMl} ml
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-semibold">Sleep Check-in</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {wellness.sleepHours} hrs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

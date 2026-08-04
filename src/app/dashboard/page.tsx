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
  CheckCircle2,
  Users,
  ChevronRight,
  Plus,
  Edit3,
  HeartPulse,
  Activity,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Clock,
  Sparkles,
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
    { label: 'Great', icon: Smile, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Good', icon: Smile, color: 'text-teal-600 dark:text-teal-400' },
    { label: 'Okay', icon: Meh, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Stressed', icon: Frown, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Unwell', icon: AlertCircle, color: 'text-red-600 dark:text-red-400' },
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
      {/* Top Clinical Greeting & Emergency Banner */}
      <div className="rounded-xl bg-slate-900 text-white p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>•</span>
            <span className="bg-teal-950/80 px-2.5 py-0.5 rounded-full text-teal-300 border border-teal-800/80 font-bold">
              Patient: {activeProfile.name}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Clinical Health Workspace
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Real-time health management platform. Access symptom triage, lab report OCR parsing, digitized prescriptions, and family records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={triggerSos}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider uppercase shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>{t(language, 'emergencySos')}</span>
          </button>
        </div>
      </div>

      {/* Patient Profile Bar */}
      <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {isEditingProfile ? (
          <form onSubmit={handleSaveProfileEdit} className="flex flex-wrap items-center gap-3 text-xs w-full">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none border border-slate-200 dark:border-slate-700"
                placeholder="Patient Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Age</label>
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(Number(e.target.value))}
                className="w-20 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none border border-slate-200 dark:border-slate-700"
                placeholder="Age"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</label>
              <select
                value={editBloodGroup}
                onChange={(e) => setEditBloodGroup(e.target.value)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none border border-slate-200 dark:border-slate-700"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <button type="submit" className="px-3.5 py-2 rounded-lg bg-teal-600 text-white font-bold">
                Save Profile
              </button>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white font-extrabold text-base">
                {activeProfile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeProfile.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                    Blood Group: {activeProfile.bloodGroup}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeProfile.age} yrs • {activeProfile.gender} | Allergies:{' '}
                  {activeProfile.allergies.length > 0 ? activeProfile.allergies.join(', ') : 'None recorded'}
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
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Daily Wellness Mood Check-in */}
      <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t(language, 'howAreYouFeeling')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {feelings.map((f) => {
            const IconComponent = f.icon;
            const isSelected = selectedFeeling === f.label;
            return (
              <button
                key={f.label}
                onClick={() => {
                  setSelectedFeeling(f.label);
                  updateWellness({ mood: f.label as any });
                  showToast(`Logged daily mood as ${f.label}`);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-slate-800 border-slate-900 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <IconComponent className={`h-4 w-4 ${f.color}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Workflow Actions Grid */}
      <div>
        <div className="mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Clinical Modules
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/symptoms"
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Symptom Assessment</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Clinical Triage Engine</p>
            </div>
          </Link>

          <Link
            href="/dashboard/reports"
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Analyze Lab Report</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">PDF Document OCR</p>
            </div>
          </Link>

          <Link
            href="/dashboard/prescriptions"
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Scan Prescription</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Digitize Prescriptions</p>
            </div>
          </Link>

          <Link
            href="/dashboard/care"
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Locate Care</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">24/7 Hospital Discovery</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Meds Card */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Today's Medication Schedule
                </h3>
                <span className="text-xs text-slate-500">Weekly Compliance: {adherencePercentage}% logged</span>
              </div>
              <Link
                href="/dashboard/medications"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                + Add Medication <ChevronRight className="h-3.5 w-3.5" />
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
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
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
                        <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Dose Logged
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

          {/* Upcoming Appointment Card */}
          {upcomingApt ? (
            <div className="rounded-xl bg-slate-900 p-5 text-white shadow-sm border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-800 text-teal-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Next Consultation Scheduled
                  </span>
                  <h4 className="text-base font-bold">{upcomingApt.doctorName}</h4>
                  <p className="text-xs text-slate-300">
                    {upcomingApt.specialty} • {upcomingApt.hospitalName}
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/appointments"
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shrink-0"
              >
                Manage
              </Link>
            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Doctor Appointments</h4>
                <p className="text-[11px] text-slate-500">No consultations scheduled for today.</p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs text-teal-600 dark:text-teal-400"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Family Profiles Quick Switcher */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Family Profiles
              </h3>
              <Link href="/dashboard/family" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProfile(p)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                    activeProfile.id === p.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500/80 text-teal-900 dark:text-teal-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.relationship} • {p.bloodGroup}
                      </div>
                    </div>
                  </div>
                  {activeProfile.id === p.id && <span className="text-teal-600 dark:text-teal-400 font-bold text-[10px] uppercase">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Wellness Quick Tracker */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Daily Vitals Summary
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-medium text-[11px]">Water Intake</span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5 block">
                  {wellness.waterIntakeMl} / {wellness.waterGoalMl} ml
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-medium text-[11px]">Sleep Record</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
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


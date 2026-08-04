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
  Droplet,
  Moon,
  Zap,
  TrendingUp,
  Building2,
  FileSpreadsheet,
  UserCheck,
  X,
  Save,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { useRouter } from 'next/navigation';

export default function DashboardOverviewPage() {
  const {
    currentUser,
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

  const isDoctor = currentUser?.role === 'Physician';
  const isAdmin = currentUser?.role === 'Admin';

  // ─── Clinical Modules ────────────────────────────────
  const clinicalModules = [
    {
      href: '/dashboard/symptoms',
      icon: Stethoscope,
      label: 'Symptom Assessment',
      sub: 'Clinical Triage Engine',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/50',
    },
    {
      href: '/dashboard/reports',
      icon: FileText,
      label: 'Analyze Lab Report',
      sub: 'PDF Document OCR',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      href: '/dashboard/prescriptions',
      icon: ScanLine,
      label: 'Scan Prescription',
      sub: 'Digitize Prescriptions',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/50',
    },
    {
      href: '/dashboard/care',
      icon: MapPin,
      label: 'Locate Care',
      sub: '24/7 Hospital Discovery',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50',
    },
  ];

  const doctorModules = [
    {
      href: '/dashboard/reports',
      icon: FileText,
      label: 'Patient Lab OCR Reviews',
      sub: 'Diagnostic Review Console',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      href: '/dashboard/prescriptions',
      icon: ScanLine,
      label: 'Prescription Generator',
      sub: 'Digital Rx Writer',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/50',
    },
    {
      href: '/dashboard/appointments',
      icon: Calendar,
      label: 'Consultation Schedule',
      sub: 'Patient Appointment Queue',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/50',
    },
    {
      href: '/dashboard/assistant',
      icon: Sparkles,
      label: 'Clinical Decision Support',
      sub: 'AI-Assisted Diagnosis',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
  ];

  const adminModules = [
    {
      href: '/dashboard/clinic-admin',
      icon: Users,
      label: 'Doctor Roster Control',
      sub: 'Physician Registry & Availability',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-950/50',
    },
    {
      href: '/dashboard/super-admin',
      icon: Building2,
      label: 'Hospital & Wards Management',
      sub: 'Bed Registry & Admissions',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/50',
    },
    {
      href: '/dashboard/receptionist',
      icon: Stethoscope,
      label: 'Clinical Departments',
      sub: 'Staff Rotations & Shift Logs',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      href: '/dashboard/appointments',
      icon: Calendar,
      label: 'Appointments Registry',
      sub: 'Consolidated Consultation Logs',
      color: 'text-amber-650 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
  ];

  const modules = isDoctor ? doctorModules : isAdmin ? adminModules : clinicalModules;

  if (isAdmin) {
    return (
      <div className="space-y-6 pb-8">
        {/* Greeting Banner */}
        <div className="rounded-2xl overflow-hidden shadow-card border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 animate-fade-in-up">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="chip chip-teal">
                  Administrator: {currentUser?.name || 'Hospital Admin'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white animate-fade-in-up">
                Hospital Command Center & Administration
              </h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Oversee clinical department staffing, configure operational hospital bed registries, adjust physician rosters, and audit scheduling queues.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/dashboard/clinic-admin"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Users className="h-4 w-4" />
                <span>Manage Doctors</span>
              </Link>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-60" />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Bed Occupancy</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">84% Filled</div>
              <span className="text-[11px] text-slate-500">18/110 beds available</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Roster</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">14 Doctors</div>
              <span className="text-[11px] text-slate-500">3 on call standby</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Consultations Today</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">42 Scheduled</div>
              <span className="text-[11px] text-slate-500">12 sessions completed</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
              <Calendar className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operations Status</span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> HIPAA Compliant
              </div>
              <span className="text-[11px] text-slate-500">All modules synced</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Action Modules */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Administrative Modules
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {adminModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card card-hover space-y-3"
                >
                  <div className={`w-10 h-10 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{mod.label}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{mod.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Hospital Wards / Bed Occupancy and Doctor Shifts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bed Allocation */}
          <div className="lg:col-span-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Active Bed Registry & Occupancy
                </h3>
                <span className="text-[11px] text-slate-500 block mt-0.5">Live facility ward census</span>
              </div>
              <Link href="/dashboard/super-admin" className="text-xs font-bold text-teal-650 dark:text-teal-400 hover:underline">
                Manage Beds
              </Link>
            </div>
            <div className="p-5 space-y-4">
              {[
                { name: 'Intensive Care Unit (ICU)', total: 20, occupied: 18, color: 'bg-red-500' },
                { name: 'Emergency Wing', total: 25, occupied: 21, color: 'bg-orange-500' },
                { name: 'Cardiology Ward', total: 15, occupied: 11, color: 'bg-teal-500' },
                { name: 'Pediatric Care', total: 20, occupied: 15, color: 'bg-blue-500' },
                { name: 'General Medicine Ward', total: 30, occupied: 27, color: 'bg-slate-500' },
              ].map((ward) => {
                const percent = Math.round((ward.occupied / ward.total) * 100);
                return (
                  <div key={ward.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{ward.name}</span>
                      <span className="text-slate-500 font-semibold">{ward.occupied} / {ward.total} Beds ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${ward.color} rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Physicians Roster */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Shift Roster Quick-Check
              </h3>
              <Link href="/dashboard/clinic-admin" className="text-xs font-bold text-teal-650 dark:text-teal-400 hover:underline">
                Manage
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'Dr. Ananya Mehta', spec: 'General Medicine', dept: 'OPD-1', status: 'On Duty' },
                { name: 'Dr. S. N. Roy', spec: 'Endocrinology', dept: 'Cardio Wing', status: 'In Consultation' },
                { name: 'Dr. V. K. Gupta', spec: 'Cardiology', dept: 'ICU', status: 'On Duty' },
                { name: 'Dr. Rajesh Kumar', spec: 'Pediatrics', dept: 'Pediatric Care', status: 'Off Duty' },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/50 dark:border-slate-750 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white block">{doc.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{doc.spec} • {doc.dept}</span>
                  </div>
                  <span className={`chip text-[9px] ${
                    doc.status === 'On Duty' ? 'chip-green' : doc.status === 'In Consultation' ? 'chip-teal' : 'chip-amber'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Greeting Banner ─────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden shadow-card border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="chip chip-teal">
                {isAdmin
                  ? `Administrator: ${currentUser?.name || 'Hospital Admin'}`
                  : isDoctor
                  ? `Physician: ${currentUser?.name}`
                  : `Patient: ${activeProfile.name}`}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {isAdmin
                ? 'Hospital Command Center & Administration'
                : isDoctor
                ? 'Doctor Clinical Command Workspace'
                : 'Patient Health Workspace'}
            </h1>
            <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
              {isAdmin
                ? 'Oversee clinical department staffing, configure operational hospital bed registries, adjust physician rosters, and audit scheduling queues.'
                : isDoctor
                ? 'Review patient lab OCR findings, triage red-flag alerts, verify digital prescriptions, and manage consultation appointments.'
                : 'Real-time health management platform. Access symptom triage, lab report OCR parsing, digitized prescriptions, and family records.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isAdmin ? (
              <Link
                href="/dashboard/clinic-admin"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Users className="h-4 w-4" />
                <span>Manage Doctors</span>
              </Link>
            ) : isDoctor ? (
              <Link
                href="/dashboard/prescriptions"
                className="px-5 py-2.5 rounded-xl bg-teal-650 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <ScanLine className="h-4 w-4" />
                <span>Issue Digital Prescription</span>
              </Link>
            ) : (
              <button
                onClick={triggerSos}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all flex items-center gap-2 sos-pulse"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>{t(language, 'emergencySos')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-60" />
      </div>

      {/* ── Profile Bar ─────────────────────────────────── */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
        {isEditingProfile ? (
          <form onSubmit={handleSaveProfileEdit} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit Profile</h3>
              <button type="button" onClick={() => setIsEditingProfile(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-end gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-premium w-48"
                  placeholder="Patient Name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age</label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  className="input-premium w-24"
                  placeholder="Age"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</label>
                <select
                  value={editBloodGroup}
                  onChange={(e) => setEditBloodGroup(e.target.value)}
                  className="input-premium w-28"
                >
                  {['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pb-0.5">
                <button type="submit" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors">
                  <Save className="h-3.5 w-3.5" /> Save Profile
                </button>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-extrabold text-lg shadow-md">
                {activeProfile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeProfile.name}
                  </h4>
                  <span className="chip chip-blue">Blood Group: {activeProfile.bloodGroup}</span>
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* ── Wellness Mood Check-in ───────────────────────── */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <IconComponent className={`h-3.5 w-3.5 ${f.color}`} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Clinical Modules ─────────────────────────────── */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
          Clinical Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card card-hover space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl ${mod.bg} ${mod.color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{mod.label}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{mod.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Main Overview Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Medication Schedule */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Today's Medication Schedule
                </h3>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Weekly Compliance: {adherencePercentage}% logged</span>
              </div>
              <Link
                href="/dashboard/medications"
                className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                + Add Medication <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-5">
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
                        className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isTaken
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
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
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Dose Logged
                          </span>
                        ) : (
                          <button
                            onClick={() => logMedicationStatus(med.id, 'taken')}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors active:scale-95 shrink-0"
                          >
                            Mark Taken
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto">
                    <Pill className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active medication schedule added yet.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add your medications to track daily doses.</p>
                  </div>
                  <Link
                    href="/dashboard/medications"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Medication Schedule
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointment */}
          {upcomingApt ? (
            <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-5 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600/20 border border-teal-600/30 text-teal-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Next Consultation Scheduled
                  </span>
                  <h4 className="text-base font-bold text-white">{upcomingApt.doctorName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {upcomingApt.specialty} • {upcomingApt.hospitalName}
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/appointments"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-colors shrink-0 active:scale-95"
              >
                Manage
              </Link>
            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card p-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Doctor Appointments</h4>
                <p className="text-xs text-slate-500 mt-0.5">No consultations scheduled for today.</p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 font-bold text-xs text-teal-700 dark:text-teal-300 hover:bg-teal-100 transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Family Profiles Quick Switcher */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Family Profiles
              </h3>
              <Link href="/dashboard/family" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
                Manage
              </Link>
            </div>
            <div className="p-4 space-y-2">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProfile(p)}
                  className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                    activeProfile.id === p.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400/60 dark:border-teal-700 text-teal-900 dark:text-teal-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs ${
                      activeProfile.id === p.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {p.relationship} • {p.bloodGroup}
                      </div>
                    </div>
                  </div>
                  {activeProfile.id === p.id && (
                    <span className="text-[9px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Vitals Summary */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Daily Vitals Summary
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-1.5 mb-1">
                  <Droplet className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Water Intake</span>
                </div>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300 block">
                  {wellness.waterIntakeMl} / {wellness.waterGoalMl} ml
                </span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                <div className="flex items-center gap-1.5 mb-1">
                  <Moon className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Sleep Record</span>
                </div>
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 block">
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

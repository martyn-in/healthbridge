'use client';

import React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  FileText,
  ScanLine,
  Pill,
  ShieldAlert,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  ArrowRight,
  Lock,
  HeartPulse,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glowing Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[600px] -right-20 w-[500px] h-[500px] bg-teal-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#safety" className="hover:text-cyan-400 transition-colors">Safety & Privacy</a>
            <a href="#impact" className="hover:text-cyan-400 transition-colors">Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow hover:shadow-glow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-cyan-300 text-xs font-bold shadow-soft">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>Private by Design · AI-Assisted Clinical Triage</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Healthcare guidance, connected in <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">one place.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Understand symptoms with clinically bounded triage, translate complex lab documents into plain language, scan prescriptions, and discover nearby 24/7 emergency care.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard/symptoms"
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 text-sm font-extrabold shadow-glow hover:shadow-glow-lg transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Stethoscope className="h-5 w-5" /> Check Symptoms Now
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-4 rounded-2xl bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-sm font-bold shadow-lg transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
          >
            <span>Launch Clinical Workspace</span> <ArrowRight className="h-4 w-4 text-teal-400" />
          </Link>
        </div>

        {/* Interactive Product Preview Window */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900/90 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-5 text-left card-glow">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">HealthBridge Clinical Platform Interface</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-cyan-300">
                Live Interactive System
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 hover:border-teal-500/40 transition-colors">
                <div className="text-amber-400 font-bold flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-amber-400" /> Symptom Triage Engine
                </div>
                <div className="font-bold text-slate-100 text-sm">Self-Care & Consultation Prep</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Deterministic red-flag safety protocols enforce strict emergency escalation.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 hover:border-teal-500/40 transition-colors">
                <div className="text-cyan-400 font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" /> Medical Report OCR
                </div>
                <div className="font-bold text-slate-100 text-sm">Lipid Profile Extracted</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">LDL Cholesterol 142 mg/dL automatically flagged with doctor discussion points.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 hover:border-teal-500/40 transition-colors">
                <div className="text-emerald-400 font-bold flex items-center gap-2">
                  <Pill className="h-4 w-4 text-emerald-400" /> Medication Timeline
                </div>
                <div className="font-bold text-slate-100 text-sm">92% Weekly Adherence</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">Automated dosage reminders synced across all connected family profiles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Clinical Focus</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Fragmented Healthcare Causes Delay & Anxiety</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Patients struggle with scattered lab reports, unreadable prescriptions, ambiguous symptom severity, and missed medication schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-teal-500/30 transition-all">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Complex Lab Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Medical jargon and uninterpreted reference ranges leave patients confused about what test values actually mean before appointments.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-teal-500/30 transition-all">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Unclear Medication Regimens</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Handwritten prescriptions lead to missed dosages, incorrect timing relative to food, and unintentional non-adherence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-teal-500/30 transition-all">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Emergency Preparedness Gap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In urgent situations, crucial blood group, allergy, and family contact details are often inaccessible to first responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Workflows */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Five Flagship Clinical Workflows</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. AI Guided Symptom Checker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-step clinical assessment with body area selection, severity scaling, and deterministic safety red-flag checks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Medical Report Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract blood parameters from uploaded PDFs or photos, highlight abnormal ranges, and generate doctor discussion questions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Prescription Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan doctor prescriptions to automatically extract medicine strength, timing, and food instructions into your schedule.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <Pill className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Medication Reminders</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track daily dosages, maintain weekly adherence history, receive refill alerts, and log taken/skipped doses.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">5. Emergency SOS & Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Persistent emergency trigger, live location sharing, 1-tap 112/108 call actions, and nearby 24/7 hospital discovery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Digital Health Pass QR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates an emergency health pass QR code for first responders with instant "Disable QR Access" safety controls.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Banner */}
      <section id="safety" className="py-16 bg-slate-900 border-t border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-teal-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">AI Clinical Safety & Medical Disclaimer</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  HealthBridge AI provides educational guidance only and does not replace a licensed healthcare professional. In an emergency, contact local emergency services (112 / 108) immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-slate-950 border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p>© 2026 HealthBridge AI. All rights reserved. Built for Clinical Innovation.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="/dashboard" className="hover:text-teal-400 transition-colors">Clinical Demo</Link>
            <Link href="/onboarding" className="hover:text-teal-400 transition-colors">Onboarding</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

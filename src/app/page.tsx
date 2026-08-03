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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-teal-600 dark:hover:text-cyan-400">Features</a>
            <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-cyan-400">How It Works</a>
            <a href="#safety" className="hover:text-teal-600 dark:hover:text-cyan-400">Safety & Privacy</a>
            <a href="#impact" className="hover:text-teal-600 dark:hover:text-cyan-400">Impact</a>
            <a href="#faq" className="hover:text-teal-600 dark:hover:text-cyan-400">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Explore Demo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-cyan-300 text-xs font-bold">
          <ShieldCheck className="h-4 w-4 text-teal-600" /> Private by Design · AI-Assisted · Doctor-First
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-navy-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Healthcare guidance, connected in <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-navy-700 bg-clip-text text-transparent">one place.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Understand symptoms, analyze medical reports with simple explanations, scan prescriptions, manage medication schedules, and discover nearby 24/7 care.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard/symptoms"
            className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2"
          >
            <Stethoscope className="h-5 w-5" /> Check Symptoms Now
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>Explore Clinical Portal</span> <ArrowRight className="h-4 w-4 text-teal-400" />
          </Link>
        </div>

        {/* Interactive Product Preview Card */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-900 p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">HealthBridge Clinical Platform Interface</span>
              </div>
              <span className="text-xs font-bold text-teal-400">Live Interactive Workspace</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white text-xs">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4" /> Symptom Triage Engine
                </div>
                <div className="font-semibold text-slate-200">Self-Care & Consultation Prep</div>
                <p className="text-[11px] text-slate-400">Deterministic red-flag safety checks prevent missed emergencies.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <FileText className="h-4 w-4" /> Medical Report OCR
                </div>
                <div className="font-semibold text-slate-200">Lipid Profile Extracted</div>
                <p className="text-[11px] text-slate-400">LDL Cholesterol 142 mg/dL flagged with doctor questions.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Pill className="h-4 w-4" /> Medication Schedule
                </div>
                <div className="font-semibold text-slate-200">92% Weekly Adherence</div>
                <p className="text-[11px] text-slate-400">Automatic dosage reminders synced for all family members.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fragmented Healthcare Problem Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">The Problem</span>
            <h2 className="text-3xl font-extrabold">Fragmented Healthcare Causes Delay & Anxiety</h2>
            <p className="text-sm text-slate-500">
              Patients struggle with scattered lab reports, unreadable doctor prescriptions, unclear symptom severity, and forgotten medication schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold">Complex Lab Reports</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Medical jargon and ambiguous reference ranges leave patients confused about what test values actually mean before their appointment.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold">Unclear Medication Regimens</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Handwritten prescriptions lead to missed dosages, incorrect timing relative to food, and unintentional non-adherence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 w-fit">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold">Emergency Preparedness Gap</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                In urgent situations, crucial blood group, allergy, and family contact details are often inaccessible to first responders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Flagship Capabilities</span>
          <h2 className="text-3xl font-extrabold">Five Core Flagship Workflows</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">1. AI Guided Symptom Checker</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conversational multi-step assessment with body selector, severity scaling, and deterministic triage safety red flags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">2. Medical Report Analyzer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract blood parameters from uploaded PDFs or images, highlight abnormal ranges, and generate smart doctor questions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">3. Prescription Scanner</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scan doctor prescriptions to automatically extract medicine strength, timing, and food instructions into your schedule.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
              <Pill className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">4. Medication Reminders</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track daily dosages, maintain weekly adherence history, receive refill alerts, and log taken/skipped doses.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-600 w-fit">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">5. Emergency SOS & Discovery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Persistent emergency trigger, live location sharing, 1-tap 112/108 call actions, and nearby 24/7 hospital discovery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-cyan-400 w-fit">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Digital Health Card QR</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates an emergency health pass QR code for first responders with instant "Disable QR Access" safety controls.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Transparency Section */}
      <section id="safety" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-teal-400" />
              <div>
                <h3 className="text-xl font-bold">AI Safety & Medical Disclaimer</h3>
                <p className="text-xs text-slate-300 mt-1">
                  HealthBridge AI provides educational guidance and does not replace a licensed healthcare professional. In an emergency, contact local emergency services (112 / 108) immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p>© 2026 HealthBridge AI. All rights reserved. Built for Healthcare Innovation.</p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-teal-600">Judge Demo</Link>
            <Link href="/onboarding" className="hover:text-teal-600">Onboarding</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

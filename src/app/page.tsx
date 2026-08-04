'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  FileText,
  ScanLine,
  Pill,
  ShieldAlert,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  ArrowRight,
  Lock,
  HeartPulse,
  Clock,
  Award,
  Database,
  Building2,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'triage' | 'ocr' | 'meds'>('triage');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-teal-600 selection:text-white">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Architecture</a>
            <a href="#safety" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Clinical Safety</a>
            <a href="#impact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Security & Trust</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span>Private & Encrypted • Clinical Decision Support • Family Health Workspace</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
          Unified Healthcare Intelligence & Patient Record Platform
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Transform complex medical reports into plain language, structure handwritten doctor prescriptions, triage symptoms safely, and coordinate care across your entire family.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <span>Open Patient Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/symptoms"
            className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Assess Symptoms</span>
          </Link>
        </div>

        {/* Interactive Platform Mockup Container */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-card border border-slate-200 dark:border-slate-800 overflow-hidden text-left">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between bg-slate-100/80 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-xs font-mono font-medium text-slate-500 ml-2">HealthBridge Clinical Suite v2.4</span>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setActiveTab('triage')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${activeTab === 'triage' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Symptom Triage
                </button>
                <button
                  onClick={() => setActiveTab('ocr')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${activeTab === 'ocr' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Lab OCR Engine
                </button>
                <button
                  onClick={() => setActiveTab('meds')}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${activeTab === 'meds' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Medication Tracker
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              {activeTab === 'triage' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span>Clinical Triage Assessment • Chest Tightness & Shortness of Breath</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Evaluated against deterministic red-flag emergency criteria</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800">
                      High Priority Alert
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">Selected Region</div>
                      <div className="text-slate-600 dark:text-slate-300">Thoracic / Chest Region</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">Severity Level</div>
                      <div className="text-slate-600 dark:text-slate-300">Grade 4 / Moderate-Severe</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="font-semibold text-slate-900 dark:text-white">Protocol Action</div>
                      <div className="text-red-600 dark:text-red-400 font-semibold">Immediate ER Evaluation Suggested</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ocr' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span>Comprehensive Metabolic Panel Extraction</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Parsed via OCR engine from Metropolis Healthcare PDF</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                      1 Parameter Out of Range
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="font-medium text-slate-900 dark:text-white">Fasting Blood Glucose</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">98 mg/dL (Normal 70 - 99 mg/dL)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60">
                      <span className="font-semibold text-amber-900 dark:text-amber-300">LDL Cholesterol</span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">142 mg/dL (High • Target &lt; 100 mg/dL)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'meds' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        <span>Active Family Medication Regimen</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Weekly compliance rate: 94.2%</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      All Doses Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Metformin 500mg</div>
                        <div className="text-slate-500">Twice daily after meals</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">Taken 8:00 AM</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">Atorvastatin 10mg</div>
                        <div className="text-slate-500">Once daily at bedtime</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-semibold text-[10px]">Scheduled 9:00 PM</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Challenges Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Clinical Background</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Solving Fragmented Healthcare Navigation</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Healthcare data is dispersed across physical paper reports, handwritten prescriptions, and isolated clinical portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Dense Laboratory Reports</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Medical terminology and reference ranges leave patients uncertain about what key markers mean prior to consultations.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <Pill className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Medication Schedule Misalignment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complex dosage schedules and handwritten instructions often lead to missed medication windows and non-compliance.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency Data Accessibility</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                First responders rarely have instant access to critical allergy records, blood group, or emergency contact profiles during crisis moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Capabilities Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Core Workflows</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Enterprise Clinical Workflows</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Clinical Symptom Assessment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Step-by-step triage wizard with anatomical body selection, severity metrics, and deterministic red-flag emergency screening.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Medical Report OCR Analysis</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automated document parsing for blood work and lab results, visual reference range meters, and structured doctor discussion points.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ScanLine className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Prescription Digitization</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Scan doctor prescriptions to automatically extract medicine dosages, timing, refill requirements, and food interactions.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Pill className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Medication Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Schedule daily dosages, log compliance, track weekly adherence metrics, and configure refill reminders.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">5. Emergency Protocol & Locator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              One-tap SOS activation, emergency contact notification, 112/108 calling, and real-time nearby hospital discovery.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Digital Health Card QR</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Encrypted digital health pass for first responders with instant emergency access revoke controls.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Section */}
      <section id="safety" className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-8 w-8 text-teal-400 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Clinical Guidance & Safety Governance</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                  HealthBridge provides educational decision support tools designed to complement professional medical care. In an emergency or severe symptom outbreak, contact local emergency services (112 / 108) or visit the nearest emergency department immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p>© 2026 HealthBridge Platform. Built for Enterprise Healthcare Innovation.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="/dashboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Workspace</Link>
            <Link href="/onboarding" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Setup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


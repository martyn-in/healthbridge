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
  CheckCircle2,
  Activity,
  ArrowRight,
  Lock,
  Menu,
  X,
  ChevronDown,
  Building2,
  Mail,
  Phone,
  Send,
  Globe,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'symptoms' | 'reports' | 'prescriptions' | 'care' | 'dashboard'>('dashboard');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSuccess(false);
    }, 4000);
  };

  const showcaseTabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Activity },
    { id: 'symptoms', label: 'Symptom Triage', icon: Stethoscope },
    { id: 'reports', label: 'Lab Report Analysis', icon: FileText },
    { id: 'prescriptions', label: 'Prescription Reader', icon: ScanLine },
    { id: 'care', label: 'Nearby Facilities', icon: MapPin },
  ] as const;

  const faqs = [
    {
      q: 'How does the symptom assessment tool work?',
      a: 'The symptom checker collects structured clinical information regarding anatomical location, severity, duration, and associated symptoms. It incorporates deterministic red-flag rules to flag urgent symptoms requiring immediate emergency medical care.',
    },
    {
      q: 'How is patient medical data protected?',
      a: 'HealthBridge utilizes client-side processing where possible for document analysis, strict access permissions for digital health cards, and encrypted data storage aligned with international medical privacy standards.',
    },
    {
      q: 'How does lab report analysis handle out-of-range values?',
      a: 'When you upload a lab report (PDF or image), the OCR engine extracts blood test values, compares them against standard reference ranges, highlights abnormal metrics, and suggests relevant questions for your physician.',
    },
    {
      q: 'Can I manage health records for my family members?',
      a: 'Yes. HealthBridge supports family profile management, allowing primary account holders to manage prescription schedules, vaccination logs, and emergency passes for dependents.',
    },
    {
      q: 'Does HealthBridge replace a licensed physician?',
      a: 'No. HealthBridge provides health record management tools and educational guidance. It does not provide definitive medical diagnoses or replace consultations with licensed healthcare professionals.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Marcus Vance',
      role: 'Chief Medical Officer, Regional Health Network',
      quote: 'HealthBridge improves patient consultation prep. Patients present structured symptom histories and targeted questions, allowing clinicians to focus on care decisions.',
      badge: 'Clinician Partner',
    },
    {
      name: 'Priya N.',
      role: 'Family Caregiver',
      quote: 'Managing prescription schedules for my parents is straightforward. HealthBridge consolidates dosage schedules and health records into a clean dashboard.',
      badge: 'Verified User',
    },
    {
      name: 'Dr. Anita Roy',
      role: 'Endocrinologist',
      quote: 'The report parser gives patients immediate clarity regarding their blood parameters without generating undue concern. It provides clear, clinical organization.',
      badge: 'Specialist Partner',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white relative font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1.5 py-1">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1.5 py-1">Workflow</a>
            <a href="#showcase" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1.5 py-1">System Showcase</a>
            <a href="#trust" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1.5 py-1">Security</a>
            <a href="#testimonials" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1.5 py-1">Testimonials</a>
            <a href="#faq" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 rounded px-1.5 py-1">FAQ & Contact</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors focus-visible:ring-1 focus-visible:ring-teal-500 outline-none"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-teal-400 outline-none"
            >
              Open Workspace
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white focus-visible:ring-1 focus-visible:ring-teal-500 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-5 space-y-4">
            <nav className="flex flex-col gap-3 text-xs font-medium text-slate-300">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Workflow</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">System Showcase</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Security</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Testimonials</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">FAQ & Contact</a>
            </nav>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="w-full py-2 rounded-lg text-center text-xs font-medium bg-slate-900 text-white border border-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="w-full py-2 rounded-lg text-center text-xs font-semibold bg-teal-600 text-white"
              >
                Open Workspace
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
          <span>Patient Health Records & Clinical Triage Platform</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Clinical Triage & Patient Health Records
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Evaluate symptoms with clinical triage protocols, parse lab documents, track prescriptions, and locate nearby emergency care facilities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard/symptoms"
            className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-teal-400 outline-none flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4" /> Assess Symptoms
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors focus-visible:ring-1 focus-visible:ring-teal-400 outline-none flex items-center gap-2"
          >
            <span>Open Clinical Dashboard</span> <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Clean Hero Interface Mockup */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="rounded-xl bg-slate-900/90 p-5 border border-slate-800 shadow-md text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="text-xs font-mono text-slate-400 ml-2">HealthBridge Interface</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">
                System Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-teal-400 font-semibold flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-400" /> Symptom Assessment
                </div>
                <div className="font-medium text-slate-200">Structured Guidance</div>
                <p className="text-[11px] text-slate-400 leading-normal">Emergency escalation rules automatically active for acute symptoms.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-teal-400 font-semibold flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-teal-400" /> Lab Document OCR
                </div>
                <div className="font-medium text-slate-200">Biomarker Extraction</div>
                <p className="text-[11px] text-slate-400 leading-normal">Extracted lipid and blood values referenced against standard limits.</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="text-teal-400 font-semibold flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-teal-400" /> Medication Schedule
                </div>
                <div className="font-medium text-slate-200">Dosage Tracking</div>
                <p className="text-[11px] text-slate-400 leading-normal">Consolidated schedule for daily prescription logging across profiles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section id="trust" className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Security & Compliance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Data Privacy Standards</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed with client-side document processing, access controls, and transparent medical safety guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="p-2 rounded bg-slate-900 text-teal-400 w-fit">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Client-Side Processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Document extraction is processed locally where feasible to protect data privacy.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="p-2 rounded bg-slate-900 text-teal-400 w-fit">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Regulatory Standards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Follows guidelines aligned with international healthcare privacy frameworks.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="p-2 rounded bg-slate-900 text-red-400 w-fit">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Red-Flag Safety Rules</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Critical health indicators prompt immediate emergency contact escalation.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="p-2 rounded bg-slate-900 text-teal-400 w-fit">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Physician Alignment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Generates patient preparation summaries to streamline clinical consultations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Core Features</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Integrated Health Tools</h2>
          <p className="text-xs text-slate-400">Six essential workflows for personal and family health management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded bg-slate-950 text-teal-400 w-fit border border-slate-800">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Symptom Triage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured symptom intake incorporating severity scales, duration metrics, and emergency safety guidelines.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded bg-slate-950 text-teal-400 w-fit border border-slate-800">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Lab Report Parsing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract biomarker data from lab PDF files or images, reference standard normal ranges, and review doctor discussion points.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded bg-slate-950 text-teal-400 w-fit border border-slate-800">
              <ScanLine className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Prescription Reader</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digitize handwritten or printed prescriptions into structured dosage schedules with food instructions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded bg-slate-950 text-teal-400 w-fit border border-slate-800">
              <Pill className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Medication Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track daily dosage schedules, maintain adherence logs, and manage refill reminders for active family profiles.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded bg-slate-950 text-red-400 w-fit border border-slate-800">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">5. Emergency SOS & Nearby Care</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emergency trigger button, direct 112 calling, GPS location helper, and search for 24/7 hospitals and pharmacies.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="p-2.5 rounded bg-slate-950 text-teal-400 w-fit border border-slate-800">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">6. Digital Health Pass</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate emergency health pass QR codes for first responders with instant access toggle controls.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">System Workflow</h2>
            <p className="text-xs text-slate-400">From initial intake to clinical consultation and ongoing record keeping.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-teal-400 font-bold block">01</span>
              <h3 className="text-xs font-bold text-white">Create Profile</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Set up primary and family health details.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-teal-400 font-bold block">02</span>
              <h3 className="text-xs font-bold text-white">Symptom Intake</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Answer structured questions for triage advice.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-teal-400 font-bold block">03</span>
              <h3 className="text-xs font-bold text-white">Consult Doctor</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Book appointments and share report notes.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-teal-400 font-bold block">04</span>
              <h3 className="text-xs font-bold text-white">Track Health</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Log prescription doses and water intake.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-teal-400 font-bold block">05</span>
              <h3 className="text-xs font-bold text-white">Follow-up Care</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Maintain digital records and emergency passes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Showcase Section */}
      <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">System Modules</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Preview</h2>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-3">
          {showcaseTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeShowcaseTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveShowcaseTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 focus-visible:ring-1 focus-visible:ring-teal-500 outline-none ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-teal-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Box */}
        <div className="rounded-xl bg-slate-900/90 p-5 border border-slate-800 space-y-3">
          {activeShowcaseTab === 'dashboard' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-400" /> Dashboard Overview
                </h3>
                <Link href="/dashboard" className="text-xs text-teal-400 hover:underline">Open Workspace →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Primary Profile</span>
                  <span className="font-semibold text-white">My Health Profile</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Medication Schedule</span>
                  <span className="font-semibold text-teal-400">92% Adherence</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Consultation Status</span>
                  <span className="font-semibold text-slate-200">No Pending Follow-ups</span>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'symptoms' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-teal-400" /> Symptom Assessment
                </h3>
                <Link href="/dashboard/symptoms" className="text-xs text-teal-400 hover:underline">Launch Tool →</Link>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Structured clinical questionnaire evaluating symptom onset, region, and severity with integrated emergency escalation rules.
              </p>
            </div>
          )}

          {activeShowcaseTab === 'reports' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-400" /> Lab Report Analysis
                </h3>
                <Link href="/dashboard/reports" className="text-xs text-teal-400 hover:underline">Upload PDF →</Link>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Extracts lab values from PDF test reports, compares metrics against standard reference limits, and highlights out-of-range results.
              </p>
            </div>
          )}

          {activeShowcaseTab === 'prescriptions' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ScanLine className="h-4 w-4 text-teal-400" /> Prescription Reader
                </h3>
                <Link href="/dashboard/prescriptions" className="text-xs text-teal-400 hover:underline">Scan Prescription →</Link>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Scans printed or handwritten prescriptions to add medicine dosages and timing instructions directly into daily health reminders.
              </p>
            </div>
          )}

          {activeShowcaseTab === 'care' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-400" /> Nearby Facilities
                </h3>
                <Link href="/dashboard/care" className="text-xs text-teal-400 hover:underline">View Map →</Link>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Locate emergency centers, 24-hour pharmacies, and diagnostic laboratories near your current GPS location.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="testimonials" className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Feedback</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Clinical & Patient Perspectives</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <p className="text-xs text-slate-300 leading-relaxed">"{t.quote}"</p>
                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-teal-400 text-[10px] font-medium border border-slate-800">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & FAQ Section */}
      <section id="faq" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* FAQ Accordion */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Support</span>
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left text-xs font-semibold text-white flex items-center justify-between gap-3 focus-visible:ring-1 focus-visible:ring-teal-500 outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto rounded-xl bg-slate-900/80 p-6 border border-slate-800 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">Contact Support & Inquiries</h3>
            <p className="text-xs text-slate-400">Send your inquiry or technical feedback to our team.</p>
          </div>

          {contactSuccess ? (
            <div className="p-3.5 rounded-lg bg-slate-950 border border-teal-500/40 text-teal-300 text-xs text-center">
              Message received. Our technical team will respond shortly.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your question or technical inquiry..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 focus-visible:ring-1 focus-visible:ring-teal-400 outline-none"
              >
                <Send className="h-3.5 w-3.5" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="mt-auto py-10 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Logo size="sm" />
              <p className="text-[11px] text-slate-400 leading-normal">
                Clinical triage, lab document parsing, prescription digitizing, and emergency care discovery.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-2">Workflows</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><Link href="/dashboard/symptoms" className="hover:text-white">Symptom Assessment</Link></li>
                <li><Link href="/dashboard/reports" className="hover:text-white">Lab Report Analysis</Link></li>
                <li><Link href="/dashboard/prescriptions" className="hover:text-white">Prescription Reader</Link></li>
                <li><Link href="/dashboard/care" className="hover:text-white">Emergency Facilities</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-2">Governance</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#trust" className="hover:text-white">Data Privacy Standards</a></li>
                <li><a href="#trust" className="hover:text-white">Red-Flag Safety Rules</a></li>
                <li><span className="text-slate-400">Medical Disclaimer</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[10px] mb-2">Contact</h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-teal-400" /> support@healthaibridge.org</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-teal-400" /> Emergency Hotline: 112</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© 2026 HealthBridge AI. All rights reserved.</p>
            <div className="flex gap-3">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Use</span>
              <span>•</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

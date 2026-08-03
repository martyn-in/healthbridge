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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  ArrowRight,
  Lock,
  HeartPulse,
  Menu,
  X,
  ChevronDown,
  Building2,
  Star,
  LockKeyhole,
  Check,
  Mail,
  Phone,
  MessageSquare,
  Send,
  HelpCircle,
  Clock,
  UserCheck,
  FileSearch,
  Globe,
  Share2,
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
    { id: 'reports', label: 'Lab Report OCR', icon: FileText },
    { id: 'prescriptions', label: 'Prescription Scanner', icon: ScanLine },
    { id: 'care', label: '24/7 Care Map', icon: MapPin },
  ] as const;

  const faqs = [
    {
      q: 'How does the AI Guided Symptom Assessment work?',
      a: 'The symptom checker asks structured clinical questions regarding body location, severity, duration, and associated symptoms. It applies deterministic red-flag rules for urgent conditions (like chest pain or stroke signs) to ensure safe triage advice.',
    },
    {
      q: 'Is my medical data kept private and secure?',
      a: 'Yes. HealthBridge AI uses client-side processing where possible for OCR operations, strict access permissions for digital health passes, and encrypted data storage standards compliant with healthcare privacy guidelines.',
    },
    {
      q: 'How does the Medical Report OCR parser handle abnormal values?',
      a: 'When you upload a lab report (PDF or image), our OCR engine extracts blood parameters, compares them against established clinical reference ranges, highlights abnormal results in yellow/red, and provides suggested questions for your doctor.',
    },
    {
      q: 'Can I manage health records for multiple family members?',
      a: 'Yes. HealthBridge supports family profile switching, allowing primary account holders to manage prescription timelines, vaccination logs, and emergency passes for children, spouses, or elderly parents.',
    },
    {
      q: 'Does HealthBridge replace a licensed physician?',
      a: 'No. HealthBridge AI provides educational health intelligence and administrative management tools. It does not provide definitive medical diagnoses or replace consultations with certified healthcare professionals.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Marcus Vance',
      role: 'Chief Medical Officer, Regional Care Network',
      quote: 'HealthBridge AI simplifies patient prep before consultations. Patients arrive with structured symptom histories and clear questions, making clinical visits significantly more effective.',
      badge: 'Clinician Partner',
    },
    {
      name: 'Priya N.',
      role: 'Family Caregiver',
      quote: 'Managing prescription timings for my elderly parents used to be overwhelming. HealthBridge synced all dosage schedules and lab reports into one clear dashboard.',
      badge: 'Verified Patient',
    },
    {
      name: 'Dr. Anita Roy',
      role: 'Endocrinology Specialist',
      quote: 'The report parser gives patients immediate clarity on their blood parameter ranges without generating unnecessary panic. It strikes the perfect balance of clarity and medical safety.',
      badge: 'Verified Specialist',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Ambient Gradient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/15 to-indigo-600/20 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-teal-600/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md px-1 py-0.5">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md px-1 py-0.5">How It Works</a>
            <a href="#showcase" className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md px-1 py-0.5">Showcase</a>
            <a href="#trust" className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md px-1 py-0.5">Security</a>
            <a href="#testimonials" className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md px-1 py-0.5">Social Proof</a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md px-1 py-0.5">FAQ & Contact</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold shadow-glow hover:shadow-glow-lg transition-all active:scale-95 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-teal-400 outline-none"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-6 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-4 text-sm font-bold text-slate-300">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 py-1">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 py-1">How It Works</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 py-1">Showcase</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 py-1">Security & Privacy</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 py-1">Testimonials</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400 py-1">FAQ & Contact</a>
            </nav>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-slate-900 text-white"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl text-center text-xs font-extrabold bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950"
              >
                Explore Clinical Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-cyan-300 text-xs font-bold shadow-soft">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>Private by Design · HIPAA & GDPR Compliant Standards</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Clinical Triage & Health Intelligence <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">for Modern Healthcare.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Understand symptoms with bounded clinical triage, translate lab reports into plain language with OCR, digitize handwritten prescriptions, and access nearby 24/7 emergency care.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard/symptoms"
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 text-sm font-extrabold shadow-glow hover:shadow-glow-lg transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-teal-400 outline-none"
          >
            <Stethoscope className="h-5 w-5" /> Check Symptoms Free
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-4 rounded-2xl bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-sm font-bold shadow-lg transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-teal-400 outline-none"
          >
            <span>Explore Clinical Portal</span> <ArrowRight className="h-4 w-4 text-teal-400" />
          </Link>
        </div>

        {/* Hero Interactive Dashboard Mockup */}
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
                Live System Ready
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

      {/* Trust & Security Section */}
      <section id="trust" className="py-20 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Security & Clinical Governance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for Trust, Security & Privacy</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              We design healthcare applications around strict privacy, deterministic red-flag safety protocols, and transparent clinical disclaimers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">End-to-End Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Client-side document parsing ensures health data remains under patient control.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">HIPAA & GDPR Standards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Architected following strict international medical data handling guidelines.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Deterministic Red Flags</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Emergency indicators (chest pain, stroke signs) trigger mandatory 112/108 escalation.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Doctor-First Principles</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Provides preparation tools and questions to improve clinician consultations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Six Core Healthcare Workflows</h2>
          <p className="text-sm text-slate-400">
            Integrated tools designed to make healthcare information accessible, actionable, and connected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. AI Guided Symptom Checker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-step intake covering body system, severity, duration, and adaptive follow-up inquiries with strict red-flag safeguards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Medical Report Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract blood parameters from lab PDFs or photos, highlight out-of-range biomarkers, and generate questions for your doctor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <ScanLine className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Prescription Scanner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan doctor prescriptions to extract medicine dosages, frequencies, and food instructions into a digital timeline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <Pill className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">4. Medication Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track daily dosage schedules, maintain weekly adherence logs, and receive automated refill reminders for family members.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 w-fit">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">5. Emergency SOS & Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Persistent emergency trigger, live GPS coordinate sharing, one-tap 112/108 calling, and nearby 24/7 facility discovery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 card-glow">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">6. Digital Health Pass QR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates an emergency health pass QR code for first responders with instant "Disable QR Access" safety controls.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Simple Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How HealthBridge Works</h2>
            <p className="text-sm text-slate-400">From initial symptom intake to doctor consultation and follow-up care.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-cyan-300 font-extrabold text-xs">1</div>
              <h3 className="text-sm font-bold text-white">Create Profile</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Set up primary and family health profiles with blood group & allergies.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-cyan-300 font-extrabold text-xs">2</div>
              <h3 className="text-sm font-bold text-white">Symptom Intake</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Answer structured questions to receive clinical triage advice.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-cyan-300 font-extrabold text-xs">3</div>
              <h3 className="text-sm font-bold text-white">Consult Doctor</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Book appointments and share structured report questions with your clinician.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-cyan-300 font-extrabold text-xs">4</div>
              <h3 className="text-sm font-bold text-white">Track Health</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Log prescription doses, daily water intake, and weekly adherence stats.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-cyan-300 font-extrabold text-xs">5</div>
              <h3 className="text-sm font-bold text-white">Follow-up Care</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Maintain digital records, vaccination logs, and emergency contact passes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Showcase Section */}
      <section id="showcase" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Interactive Preview</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">System Showcase</h2>
          <p className="text-sm text-slate-400">Explore key modules of the HealthBridge AI platform.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-800 pb-4">
          {showcaseTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeShowcaseTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveShowcaseTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-glow'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Showcase View Container */}
        <div className="rounded-3xl bg-slate-900/90 p-6 border border-slate-800 shadow-2xl space-y-4">
          {activeShowcaseTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-400" /> Patient Overview Dashboard
                </h3>
                <Link href="/dashboard" className="text-xs font-bold text-cyan-400 hover:underline">Open Live Dashboard →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Active Profile</span>
                  <span className="text-sm font-bold text-white">Rahul Sharma (Self)</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Weekly Adherence</span>
                  <span className="text-sm font-bold text-teal-400">92% Doses Logged</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Upcoming Consultation</span>
                  <span className="text-sm font-bold text-cyan-300">Dr. Ananya Mehta (10:30 AM)</span>
                </div>
              </div>
            </div>
          )}

          {activeShowcaseTab === 'symptoms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-amber-400" /> AI Guided Symptom Assessment
                </h3>
                <Link href="/dashboard/symptoms" className="text-xs font-bold text-cyan-400 hover:underline">Launch Triage Tool →</Link>
              </div>
              <p className="text-xs text-slate-300">
                Interactive clinical triage engine evaluates primary concerns, body region, and symptom severity while enforcing red-flag emergency safety rules.
              </p>
            </div>
          )}

          {activeShowcaseTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-400" /> Medical Report Analyzer & OCR
                </h3>
                <Link href="/dashboard/reports" className="text-xs font-bold text-cyan-400 hover:underline">Upload Lab PDF →</Link>
              </div>
              <p className="text-xs text-slate-300">
                Extract CBC, Lipid, and Blood Sugar test parameters automatically. Highlights out-of-range values and generates questions for your physician.
              </p>
            </div>
          )}

          {activeShowcaseTab === 'prescriptions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-emerald-400" /> Prescription & Medicine Scanner
                </h3>
                <Link href="/dashboard/prescriptions" className="text-xs font-bold text-cyan-400 hover:underline">Scan Prescription →</Link>
              </div>
              <p className="text-xs text-slate-300">
                Scans handwritten or printed prescriptions to digitize dosages, timing, and food-related instructions directly into daily medication reminders.
              </p>
            </div>
          )}

          {activeShowcaseTab === 'care' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-400" /> 24/7 Care & Emergency Discovery
                </h3>
                <Link href="/dashboard/care" className="text-xs font-bold text-cyan-400 hover:underline">Find Nearby Facilities →</Link>
              </div>
              <p className="text-xs text-slate-300">
                Locate local emergency trauma centers, 24-hour pharmacies, diagnostic laboratories, and acute clinics with distance metrics and call actions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof & Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Social Proof & Feedback</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Trusted by Patients & Clinicians</h2>
            <p className="text-sm text-slate-400">Real clinical perspectives on HealthBridge AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">"{t.quote}"</p>
                </div>
                <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold border border-teal-500/20">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Network Partner Placeholders */}
          <div className="pt-8 border-t border-slate-800/60 text-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              Compatible with Major Clinical Data Systems (Demonstration Partners)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-slate-400">
              <span className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-400" /> Metro Health System</span>
              <span className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-400" /> Apex Diagnostic Labs</span>
              <span className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-400" /> City Acute Care</span>
              <span className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-400" /> MedPlus Pharmacies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & FAQ Section */}
      <section id="faq" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* FAQ Accordion */}
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-white">Got Questions? We Have Answers</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left text-sm font-bold text-white flex items-center justify-between gap-4 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-teal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/90 p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Get in Touch with HealthBridge</h3>
            <p className="text-xs text-slate-400">Have feedback or inquiry about deployment? Send us a message.</p>
          </div>

          {contactSuccess ? (
            <div className="p-4 rounded-xl bg-teal-950/80 border border-teal-500/40 text-cyan-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <Check className="h-5 w-5 text-teal-400" />
              <span>Thank you! Your message has been received. Our team will respond shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with HealthBridge AI?"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-teal-400 outline-none"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SaaS Footer */}
      <footer className="mt-auto py-12 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <Logo size="sm" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Patient-first clinical triage, lab report parsing, prescription digitization, and 24/7 care discovery.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Product Workflows</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/dashboard/symptoms" className="hover:text-cyan-400">Symptom Checker</Link></li>
                <li><Link href="/dashboard/reports" className="hover:text-cyan-400">Lab Report OCR</Link></li>
                <li><Link href="/dashboard/prescriptions" className="hover:text-cyan-400">Prescription Reader</Link></li>
                <li><Link href="/dashboard/care" className="hover:text-cyan-400">24/7 Care Discovery</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Governance & Privacy</h4>
              <ul className="space-y-2 text-[11px]">
                <li><a href="#safety" className="hover:text-cyan-400">Clinical Safety Standards</a></li>
                <li><a href="#trust" className="hover:text-cyan-400">Privacy & Data Governance</a></li>
                <li><span className="text-slate-400">HIPAA & GDPR Compliance</span></li>
                <li><span className="text-slate-400">Terms of Service</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Contact Support</h4>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-teal-400" /> support@healthaibridge.org</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-teal-400" /> +91 (11) 2658-8500 (Emergency 112)</div>
                <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-teal-400" /> New Delhi, India</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 HealthBridge AI. All rights reserved. Built for Healthcare Innovation.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

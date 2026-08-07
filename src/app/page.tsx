'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Activity,
  Heart,
  ChevronRight,
  MessageSquare,
  Phone,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  User,
  MessageCircle,
  Thermometer,
  Wind,
  Droplets,
  Brain,
  Layers,
  Clock,
  Calendar,
  Settings,
  Plus,
  FileText,
  Pill,
  FolderHeart,
  Syringe,
  ShieldAlert,
  Globe,
  MoreHorizontal,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';

/* ─── SPARKLINE SVG ─────────────────────────────────────────────────── */
function Sparkline({
  data,
  color = '#0066FF',
  height = 40,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const w = 120, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
    return `${x},${y}`;
  });
  const d = `M${pts.join(' L')}`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── ECG WAVEFORM ANIMATION ───────────────────────────────────────── */
function EcgWave({ color = '#FF3366' }: { color?: string }) {
  return (
    <div className="w-full h-12 relative overflow-hidden rounded-xl bg-white/40 border border-white/60 flex items-center">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 60">
        <path
          d="M0 30 L120 30 L125 15 L135 45 L145 5 L155 55 L165 25 L175 35 L180 30 L500 30"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sparkline-path"
        />
      </svg>
    </div>
  );
}

/* ─── HUD PIN BADGE ─────────────────────────────────────────────────── */
function HudBadge({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="frosted-card rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-md border border-white/80 backdrop-blur-md">
      <div className="p-1.5 rounded-xl shrink-0" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#9BAABF]">{label}</div>
        <div className="text-xs font-black text-[#0D1B2A]">
          {value} <span className="text-[9px] font-bold text-[#9BAABF]">{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── ANATOMICAL HEART 3D ─────────────────────────────────────────── */
function CssHeart3D({ activeColor = '#FF3366' }: { activeColor?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="absolute w-64 h-64 rounded-full opacity-30 spin-slow"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${activeColor}40, transparent, rgba(0,194,255,0.25), transparent)`,
            filter: 'blur(2px)',
          }}
        />
      </div>

      <div
        className={`float-heart relative z-10 transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
        style={{
          filter: `drop-shadow(0 16px 40px ${activeColor}35) drop-shadow(0 4px 12px rgba(0,102,255,0.15))`,
        }}
      >
        <div className="relative w-52 h-52">
          <svg viewBox="0 0 200 188" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heartGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="30%" stopColor="#F0F4FC" stopOpacity="0.90" />
                <stop offset="65%" stopColor="#E0EAFF" stopOpacity="0.82" />
                <stop offset="100%" stopColor="#C8DAFF" stopOpacity="0.75" />
              </linearGradient>
              <radialGradient id="heartSSS" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor={activeColor} stopOpacity="0.55" />
                <stop offset="100%" stopColor={activeColor} stopOpacity="0" />
              </radialGradient>
            </defs>

            <path
              d="M100 170 C100 170, 10 120, 10 65 C10 38, 30 18, 55 18 C70 18, 83 27, 100 42 C117 27, 130 18, 145 18 C170 18, 190 38, 190 65 C190 120, 100 170, 100 170Z"
              fill="url(#heartSSS)"
              className="glow-crimson-anim"
            />
            <path
              d="M100 170 C100 170, 10 120, 10 65 C10 38, 30 18, 55 18 C70 18, 83 27, 100 42 C117 27, 130 18, 145 18 C170 18, 190 38, 190 65 C190 120, 100 170, 100 170Z"
              fill="url(#heartGradMain)"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      <div className="contact-shadow" />
    </div>
  );
}

/* ─── MAIN LANDING PAGE ────────────────────────────────────────────── */
export default function HealthBridgeDashboard() {
  const {
    activeProfile,
    profiles,
    medications,
    appointments,
    healthRecords,
    vaccinations,
    wellness,
    triggerSos,
  } = useApp();

  const [activeNode, setActiveNode] = useState<string>('cardiac');
  const [bpm, setBpm] = useState<number>(75);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const bpmInterval = setInterval(() => {
      setBpm((prev) => {
        const next = prev + Math.floor(Math.random() * 5) - 2;
        return Math.max(68, Math.min(84, next));
      });
    }, 2000);
    return () => clearInterval(bpmInterval);
  }, []);

  const sparkHR = [72, 74, 75, 73, 76, 78, 75, 74, 76, 75, 73, 75];

  const nodes = [
    {
      id: 'cardiac',
      label: 'Cardiac',
      color: '#FF3366',
      bg: 'rgba(255,51,102,0.12)',
      icon: <Heart className="h-3.5 w-3.5" />,
      metrics: 'Normal Sinus Rhythm · Active Monitor',
      status: 'Normal',
    },
    {
      id: 'pulmonary',
      label: 'Pulmonary',
      color: '#0066FF',
      bg: 'rgba(0,102,255,0.12)',
      icon: <Wind className="h-3.5 w-3.5" />,
      metrics: 'Respiratory Rate Normal · Clear Airway',
      status: 'Normal',
    },
    {
      id: 'neural',
      label: 'Neural',
      color: '#7C5CFC',
      bg: 'rgba(124,92,252,0.12)',
      icon: <Brain className="h-3.5 w-3.5" />,
      metrics: 'Cognitive Focus & Sleep Sync',
      status: 'Optimal',
    },
    {
      id: 'metabolic',
      label: 'Metabolic',
      color: '#FF9500',
      bg: 'rgba(255,149,0,0.12)',
      icon: <Layers className="h-3.5 w-3.5" />,
      metrics: 'Hydration & Daily Energy Balance',
      status: 'Active',
    },
  ];

  const selectedNode = nodes.find((n) => n.id === activeNode) || nodes[0];

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans" style={{ background: '#F3F5F8' }}>
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-60" />

      {/* ── TOP HEADER ── */}
      <header
        className="sticky top-0 z-30 px-5 sm:px-8 py-3.5"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(200,215,235,0.50)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <Logo size="md" showText={true} />

          <div className="flex items-center gap-3">
            <button
              onClick={triggerSos}
              className="sos-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-extrabold"
              style={{ background: '#FF3366' }}
            >
              <ShieldAlert className="h-4 w-4" /> SOS
            </button>

            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-blue-600 bg-white border border-slate-200 shadow-sm transition-all flex items-center gap-1.5"
            >
              <User className="h-3.5 w-3.5 text-blue-600" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/dashboard/settings"
              title="Edit Profile"
              className="w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-white text-xs shadow-md transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0066FF 0%, #7C5CFC 100%)' }}
            >
              {activeProfile?.name ? activeProfile.name.charAt(0) : 'M'}
            </Link>

            <Link href="/dashboard" className="pill-btn pill-btn-primary hidden sm:inline-flex text-xs">
              Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="max-w-screen-2xl mx-auto px-5 sm:px-8 py-7 relative z-10">
        {/* Greeting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 anim-fade-up">
          <div>
            <div className="text-xs font-bold text-[#9BAABF] mb-1">
              Patient Workspace · Welcome Back
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0D1B2A] tracking-tight">
              {activeProfile.name}
              <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold align-middle bg-[#00C875]/10 text-[#00C875] border border-[#00C875]/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> Record Verified
              </span>
            </h1>
            <p className="text-xs mt-1 font-medium text-[#9BAABF]">
              Personalized Healthcare Platform & Clinical Records
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/dashboard/symptoms" className="pill-btn pill-btn-ghost text-xs">
              <Stethoscope className="h-3.5 w-3.5 text-[#0066FF]" /> Symptom Checker
            </Link>
            <Link href="/dashboard/appointments" className="pill-btn pill-btn-primary text-xs">
              <Calendar className="h-3.5 w-3.5" /> Book Consultation
            </Link>
          </div>
        </div>

        {/* 3-Column Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_300px] gap-6">
          {/* COLUMN 1: Real Profile & Workspace Counts */}
          <div className="space-y-4">
            {/* Active Profile Card */}
            <div className="frosted-card rounded-3xl p-5 anim-slide-left delay-100 card-lift">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0066FF 0%, #00C2FF 100%)' }}
                >
                  {activeProfile.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#0D1B2A]">{activeProfile.name}</div>
                  <div className="text-[10px] font-bold text-[#0066FF] bg-[#0066FF]/10 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {activeProfile.relationship}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 border-t border-slate-200/60 pt-3 text-xs">
                <div className="flex justify-between text-[#9BAABF] font-bold">
                  <span>Age</span>
                  <span className="text-[#0D1B2A] font-extrabold">{activeProfile.age} yrs</span>
                </div>
                <div className="flex justify-between text-[#9BAABF] font-bold">
                  <span>Blood Group</span>
                  <span className="text-[#0D1B2A] font-extrabold">{activeProfile.bloodGroup}</span>
                </div>
                <div className="flex justify-between text-[#9BAABF] font-bold">
                  <span>Allergies</span>
                  <span className="text-[#0D1B2A] font-extrabold">
                    {activeProfile.allergies.length > 0 ? activeProfile.allergies.join(', ') : 'None Reported'}
                  </span>
                </div>
              </div>
            </div>

            {/* REAL USER WORKSPACE COUNTS */}
            <div className="neu-card rounded-3xl p-5 space-y-3 anim-slide-left delay-200">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#9BAABF]">
                Your Health Records
              </div>

              <div className="space-y-2">
                <Link
                  href="/dashboard/medications"
                  className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center justify-between transition-all card-lift"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-50 text-[#FF9500]">
                      <Pill className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-extrabold text-[#0D1B2A]">Active Medications</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FF9500]/10 text-[#FF9500] text-xs font-black">
                    {medications.length}
                  </span>
                </Link>

                <Link
                  href="/dashboard/appointments"
                  className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center justify-between transition-all card-lift"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-extrabold text-[#0D1B2A]">Consultations</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-black">
                    {appointments.length}
                  </span>
                </Link>

                <Link
                  href="/dashboard/records"
                  className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center justify-between transition-all card-lift"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-[#7C5CFC]">
                      <FolderHeart className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-extrabold text-[#0D1B2A]">Digital Vault</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#7C5CFC]/10 text-[#7C5CFC] text-xs font-black">
                    {healthRecords.length}
                  </span>
                </Link>

                <Link
                  href="/dashboard/vaccinations"
                  className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center justify-between transition-all card-lift"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-50 text-[#00D4AA]">
                      <Syringe className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-extrabold text-[#0D1B2A]">Immunizations</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#00D4AA]/10 text-[#00D4AA] text-xs font-black">
                    {vaccinations.length}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* COLUMN 2: 3D Anatomical Organ Model & Node Selector */}
          <div className="space-y-5">
            <div className="heart-viewport anim-fade-up" style={{ minHeight: 480 }}>
              <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none rounded-3xl" />

              {/* 4 HUD Pins Around Heart */}
              <div className="absolute z-20 float-badge-1" style={{ top: '18%', left: '5%' }}>
                <HudBadge
                  icon={<Heart className="h-4 w-4 heartbeat" />}
                  label="Heart Rate"
                  value={`${bpm}`}
                  unit="bpm"
                  color="#FF3366"
                />
              </div>

              <div className="absolute z-20 float-badge-2" style={{ top: '18%', right: '5%' }}>
                <HudBadge
                  icon={<Droplets className="h-4 w-4" />}
                  label="SpO₂"
                  value="98"
                  unit="%"
                  color="#0066FF"
                />
              </div>

              <div className="absolute z-20 float-badge-3" style={{ bottom: '22%', left: '4%' }}>
                <HudBadge
                  icon={<Activity className="h-4 w-4" />}
                  label="Blood Pressure"
                  value="116/70"
                  unit="mmHg"
                  color="#7C5CFC"
                />
              </div>

              <div className="absolute z-20 float-badge-4" style={{ bottom: '22%', right: '4%' }}>
                <HudBadge
                  icon={<Thermometer className="h-4 w-4" />}
                  label="Temperature"
                  value="37.0"
                  unit="°C"
                  color="#FF9500"
                />
              </div>

              {/* 3D Heart Model */}
              <div className="absolute inset-0 flex items-center justify-center z-15">
                <CssHeart3D activeColor={selectedNode.color} />
              </div>

              {/* System Node Selector Tabs */}
              <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-4">
                <div className="frosted-card rounded-2xl p-2 flex gap-1.5">
                  {nodes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setActiveNode(n.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[10px] font-bold transition-all"
                      style={{
                        background: activeNode === n.id ? n.bg : 'transparent',
                        color: activeNode === n.id ? n.color : '#8896A7',
                        border: activeNode === n.id ? `1px solid ${n.color}30` : '1px solid transparent',
                      }}
                    >
                      {n.icon} {n.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Node Details Banner */}
            <div className="frosted-card rounded-2xl p-4 anim-fade-up delay-300">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: selectedNode.bg, color: selectedNode.color }}
                >
                  {selectedNode.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-extrabold" style={{ color: '#0D1B2A' }}>
                    {selectedNode.label} System Status
                  </div>
                  <div className="text-[10px] font-medium" style={{ color: '#8896A7' }}>
                    {selectedNode.metrics}
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    background: 'rgba(0,200,117,0.12)',
                    color: '#00C875',
                    border: '1px solid rgba(0,200,117,0.22)',
                  }}
                >
                  <CheckCircle2 className="h-3 w-3" /> {selectedNode.status}
                </div>
              </div>
              <EcgWave color={selectedNode.color} />
            </div>
          </div>

          {/* COLUMN 3: Real User Wellness & Upcoming Appointments */}
          <div className="space-y-4">
            {/* Real Wellness Tracker */}
            <div className="frosted-card rounded-3xl p-5 anim-slide-right delay-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-[#0D1B2A] uppercase tracking-wider">
                  Today's Wellness
                </h3>
                <Link href="/dashboard/wellness" className="text-[10px] font-bold text-[#0066FF] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3 text-xs font-bold">
                <div className="p-3 rounded-2xl bg-white/70 border border-white flex items-center justify-between">
                  <span className="text-[#9BAABF]">Hydration</span>
                  <span className="text-[#0066FF] font-extrabold">{wellness.waterIntakeMl} / {wellness.waterGoalMl} ml</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/70 border border-white flex items-center justify-between">
                  <span className="text-[#9BAABF]">Sleep</span>
                  <span className="text-[#7C5CFC] font-extrabold">{wellness.sleepHours} hrs</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/70 border border-white flex items-center justify-between">
                  <span className="text-[#9BAABF]">Daily Steps</span>
                  <span className="text-[#00C875] font-extrabold">{wellness.steps} steps</span>
                </div>
              </div>
            </div>

            {/* REAL BOOKED CONSULTATIONS */}
            <div className="frosted-card rounded-3xl p-5 anim-slide-right delay-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-[#0D1B2A] uppercase tracking-wider">
                  Upcoming Consultations ({appointments.length})
                </h3>
              </div>

              {appointments.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white/50 text-center space-y-2 border border-white">
                  <p className="text-xs text-[#9BAABF] font-medium">No upcoming consultations booked.</p>
                  <Link
                    href="/dashboard/appointments"
                    className="pill-btn pill-btn-primary text-xs inline-flex items-center gap-1 mt-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Book Consultation
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {appointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} className="p-3 rounded-2xl bg-white/80 border border-white space-y-1">
                      <div className="text-xs font-extrabold text-[#0D1B2A]">{apt.doctorName}</div>
                      <div className="text-[10px] font-bold text-[#0066FF]">{apt.specialty} • {apt.date}</div>
                      <div className="text-[10px] text-[#9BAABF]">{apt.hospitalName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Tool Links */}
            <div className="frosted-card rounded-3xl p-4 space-y-2">
              <Link
                href="/dashboard/reports"
                className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center justify-between text-xs font-extrabold text-[#0D1B2A] transition-all card-lift"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#7C5CFC]" />
                  <span>Lab Report OCR Parser</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9BAABF]" />
              </Link>
              <Link
                href="/dashboard/prescriptions"
                className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white flex items-center justify-between text-xs font-extrabold text-[#0D1B2A] transition-all card-lift"
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-[#0066FF]" />
                  <span>Prescription Scanner</span>
                </div>
                <ChevronRight className="h-4 w-4 text-[#9BAABF]" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

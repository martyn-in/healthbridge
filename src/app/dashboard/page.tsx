'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Droplet,
  Brain,
  ArrowUpRight,
  Download,
  Calendar,
  Target,
  FileText,
  Plus,
  Stethoscope,
  Pill,
  Bot,
  Zap,
  Heart,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

// ── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Empty State Card ─────────────────────────────────────────────────────────
function EmptyCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: any;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-[#4D50A2]/20 dark:border-white/10 bg-[#4D50A2]/5 dark:bg-white/5 space-y-3">
      <div className="w-10 h-10 rounded-xl bg-[#4D50A2]/10 dark:bg-white/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-[#4D50A2] dark:text-indigo-400" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
      </div>
      <Link
        href={ctaHref}
        className="btn-rect btn-rect-primary text-xs py-2 px-4"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>{ctaLabel}</span>
      </Link>
    </div>
  );
}

// ── Metric Card (only shown when real data exists) ───────────────────────────
function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  color = 'indigo',
}: {
  icon: any;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  color?: 'indigo' | 'cyan' | 'emerald';
}) {
  const colorMap = {
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };
  return (
    <div className="glass-subcard p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
        <div className={`p-1.5 rounded-lg border ${colorMap[color]}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
        {value}
        {unit && <span className="text-sm font-normal text-[var(--text-muted)] ml-1">{unit}</span>}
      </div>
      {sub && <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold text-[var(--text-primary)]">
        <span>{label}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-[#4D50A2]/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { activeProfile, reports, appointments, wellness, medications, adherencePercentage } = useApp();

  const upcomingAppointment = appointments.find((a) => a.status === 'Upcoming');
  const hasHydration = wellness.waterIntakeMl > 0;
  const hasMindfulness = wellness.mindfulMinutes > 0;
  const hasSteps = wellness.steps > 0;
  const hasMedications = medications.length > 0;

  // Progress section: only render when real data is available
  const progressItems = [
    hasMedications && {
      label: 'Medication Adherence',
      value: adherencePercentage,
      max: 100,
      color: 'linear-gradient(90deg, #4D50A2, #2F3273)',
    },
    hasHydration && {
      label: 'Hydration Target',
      value: wellness.waterIntakeMl,
      max: wellness.waterGoalMl || 2500,
      color: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
    },
    hasSteps && {
      label: 'Daily Steps Goal',
      value: wellness.steps,
      max: wellness.stepGoal || 8000,
      color: 'linear-gradient(90deg, #ec4899, #f43f5e)',
    },
  ].filter(Boolean) as { label: string; value: number; max: number; color: string }[];

  return (
    <div className="space-y-6 pb-12">

      {/* ── GREETING HEADER ── */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          {getGreeting()}, <span className="text-[#4D50A2] dark:text-indigo-400">{activeProfile?.name || 'there'}</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Here's your health overview for today.
        </p>
      </div>

      {/* ── TOP GRID: Vitals + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── LEFT: Health Metrics ── */}
        <div className="lg:col-span-8 glass-panel p-5 sm:p-6 space-y-5 rounded-2xl">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#4D50A2]" />
            Today's Health
          </h2>

          {/* Metric Cards — only show when data exists */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hydration */}
            {hasHydration ? (
              <MetricCard
                icon={Droplet}
                label="Hydration"
                value={wellness.waterIntakeMl}
                unit="ml"
                sub={`Target: ${wellness.waterGoalMl || 2500} ml`}
                color="cyan"
              />
            ) : (
              <div className="glass-subcard p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Hydration</span>
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Droplet className="h-3.5 w-3.5 text-cyan-500" />
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">No intake recorded today</p>
                <Link href="/dashboard/wellness" className="text-[11px] font-semibold text-[#4D50A2] hover:underline">
                  Log Water →
                </Link>
              </div>
            )}

            {/* Mindfulness */}
            {hasMindfulness ? (
              <MetricCard
                icon={Brain}
                label="Mindfulness"
                value={wellness.mindfulMinutes}
                unit="mins"
                sub="Logged today"
                color="indigo"
              />
            ) : (
              <div className="glass-subcard p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Mindfulness</span>
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Brain className="h-3.5 w-3.5 text-indigo-500" />
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">No session today</p>
                <Link href="/dashboard/wellness" className="text-[11px] font-semibold text-[#4D50A2] hover:underline">
                  Start Session →
                </Link>
              </div>
            )}

            {/* Medication Adherence */}
            {hasMedications ? (
              <MetricCard
                icon={Target}
                label="Adherence"
                value={adherencePercentage}
                unit="%"
                sub={`${medications.length} medication${medications.length > 1 ? 's' : ''} tracked`}
                color="emerald"
              />
            ) : (
              <div className="glass-subcard p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Adherence</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Target className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">No medications tracked</p>
                <Link href="/dashboard/medications" className="text-[11px] font-semibold text-[#4D50A2] hover:underline">
                  Add Medication →
                </Link>
              </div>
            )}
          </div>

          {/* Progress Bars — only when real data exists */}
          {progressItems.length > 0 ? (
            <div className="space-y-3 pt-2 border-t border-[#4D50A2]/10 dark:border-white/10">
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" /> Daily Goals
              </h3>
              {progressItems.map((item) => (
                <ProgressRow key={item.label} {...item} />
              ))}
            </div>
          ) : (
            <div className="pt-2 border-t border-[#4D50A2]/10 dark:border-white/10">
              <p className="text-xs text-[var(--text-muted)] text-center py-2">
                Log health data to track daily goals
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT: Quick Actions ── */}
        <div className="lg:col-span-4 glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#4D50A2]" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Check Symptoms', icon: Stethoscope, href: '/dashboard/symptoms', desc: 'Assess and log how you feel' },
              { label: 'Upload Report', icon: FileText, href: '/dashboard/reports', desc: 'Add lab results or scans' },
              { label: 'Add Medication', icon: Pill, href: '/dashboard/medications', desc: 'Track prescriptions' },
              { label: 'AI Assistant', icon: Bot, href: '/dashboard/assistant', desc: 'Ask a health question' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl glass-subcard hover:border-[#4D50A2]/30 dark:hover:border-indigo-400/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#4D50A2]/10 border border-[#4D50A2]/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[#4D50A2] dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)]">{action.label}</div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">{action.desc}</div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[#4D50A2] transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── BOTTOM GRID: Reports + Appointment ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ── REPORTS ── */}
        <div className="lg:col-span-7 glass-panel p-5 sm:p-6 space-y-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#4D50A2]" />
              Medical Reports
            </h2>
            <Link href="/dashboard/reports" className="btn-rect btn-rect-primary text-xs py-1.5 px-3">
              <Plus className="h-3.5 w-3.5" />
              <span>Upload</span>
            </Link>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-2">
              {reports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3.5 rounded-xl glass-subcard hover:border-[#4D50A2]/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#4D50A2]/10 border border-[#4D50A2]/20 text-[#4D50A2] flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{report.fileName}</h4>
                      <p className="text-[11px] text-[var(--text-muted)]">{report.uploadedAt || report.testDate}</p>
                    </div>
                  </div>
                  {report.fileUrl && report.fileUrl !== '#' ? (
                    <a
                      href={report.fileUrl}
                      download
                      title="Download report"
                      className="p-2 rounded-lg btn-rect-glass text-[#4D50A2] hover:text-white transition-all shrink-0 ml-2"
                      aria-label={`Download ${report.fileName}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span
                      title="No file attached"
                      className="p-2 rounded-lg opacity-30 cursor-not-allowed text-[var(--text-muted)] shrink-0 ml-2"
                      aria-label="No file available to download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              ))}
              {reports.length > 3 && (
                <Link
                  href="/dashboard/reports"
                  className="text-xs font-semibold text-[#4D50A2] hover:underline block text-center pt-1"
                >
                  View all {reports.length} reports →
                </Link>
              )}
            </div>
          ) : (
            <EmptyCard
              icon={FileText}
              title="No reports uploaded yet"
              description="Upload your lab results, scans, or prescriptions to keep everything in one place."
              ctaLabel="Upload Report"
              ctaHref="/dashboard/reports"
            />
          )}
        </div>

        {/* ── APPOINTMENT ── */}
        <div className="lg:col-span-5 glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4D50A2]" />
              Upcoming Appointment
            </h2>
            <Link
              href="/dashboard/appointments"
              className="p-1.5 rounded-lg btn-rect-glass text-[#4D50A2]"
              aria-label="View all appointments"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {upcomingAppointment ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl glass-subcard border border-[#4D50A2]/20 space-y-1">
                <div className="text-xs font-semibold text-[var(--text-muted)]">Scheduled</div>
                <div className="text-xl font-bold tabular-nums text-[var(--text-primary)]">
                  {upcomingAppointment.time}
                </div>
                <div className="text-sm font-semibold text-[#4D50A2]">{upcomingAppointment.date}</div>
              </div>
              <div className="p-3 rounded-xl glass-subcard flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4D50A2]/10 text-[#4D50A2] flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {upcomingAppointment.doctorName}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {upcomingAppointment.specialty}
                  </div>
                </div>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-xs font-semibold text-[#4D50A2] hover:underline block text-center"
              >
                View all appointments →
              </Link>
            </div>
          ) : (
            <EmptyCard
              icon={Calendar}
              title="No upcoming appointments"
              description="Book a consultation with a specialist or your regular doctor."
              ctaLabel="Book Appointment"
              ctaHref="/dashboard/appointments"
            />
          )}

          {/* Health tip — static informational, not fake data */}
          <div className="p-3 rounded-xl bg-[#F9DF77]/20 dark:bg-[#F9DF77]/10 border border-[#F9DF77]/40 dark:border-[#F9DF77]/20 flex items-start gap-2.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
              HealthBridge AI can help analyse uploaded reports, explain medications, and answer health questions.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

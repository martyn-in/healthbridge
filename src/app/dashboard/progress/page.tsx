'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  TrendingUp,
  Droplet,
  Brain,
  Target,
  Footprints,
  Calendar,
  Pill,
  BarChart3,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

function ProgressBar({
  label,
  value,
  max,
  unit,
  color,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
        <span className="text-sm font-bold tabular-nums text-[var(--text-primary)]">
          {value.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">{unit}</span>
        </span>
      </div>
      <div className="w-full h-3 bg-[#4D50A2]/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="text-xs text-[var(--text-muted)]">{pct}% of goal</p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="glass-subcard p-4 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums text-[var(--text-primary)]">
        {value}
        {unit && <span className="text-sm font-normal text-[var(--text-muted)] ml-1">{unit}</span>}
      </div>
      {sub && <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
}

export default function ProgressPage() {
  const { wellness, medications, adherencePercentage, appointments } = useApp();

  const hasHydration = wellness.waterIntakeMl > 0;
  const hasSteps = wellness.steps > 0;
  const hasSleep = wellness.sleepHours > 0;
  const hasMindfulness = wellness.mindfulMinutes > 0;
  const hasMedications = medications.length > 0;

  const hasAnyData = hasHydration || hasSteps || hasSleep || hasMindfulness || hasMedications;

  const upcomingCount = appointments.filter((a) => a.status === 'Upcoming').length;
  const activeMeds = medications.filter((m) => m.active).length;

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Progress & Insights
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Your real health data, clearly presented.
        </p>
      </div>

      {/* Summary Stats — from real data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Pill}
          label="Active Meds"
          value={activeMeds}
          sub={hasMedications ? `${adherencePercentage}% adherence` : 'None tracked'}
          color="#4D50A2"
        />
        <StatCard
          icon={Calendar}
          label="Appointments"
          value={upcomingCount}
          sub="Upcoming"
          color="#06b6d4"
        />
        <StatCard
          icon={Droplet}
          label="Hydration"
          value={hasHydration ? `${wellness.waterIntakeMl}` : '—'}
          unit={hasHydration ? 'ml' : undefined}
          sub={hasHydration ? `Target: ${wellness.waterGoalMl || 2500} ml` : 'Not recorded today'}
          color="#ec4899"
        />
        <StatCard
          icon={Brain}
          label="Mindfulness"
          value={hasMindfulness ? wellness.mindfulMinutes : '—'}
          unit={hasMindfulness ? 'min' : undefined}
          sub={hasMindfulness ? 'Logged today' : 'No session today'}
          color="#f59e0b"
        />
      </div>

      {/* Progress Bars — only when real data exists */}
      {hasAnyData ? (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#4D50A2]" />
            Daily Goals
          </h2>

          {hasHydration && (
            <ProgressBar
              label="Hydration"
              value={wellness.waterIntakeMl}
              max={wellness.waterGoalMl || 2500}
              unit="ml"
              color="linear-gradient(90deg, #06b6d4, #3b82f6)"
            />
          )}
          {hasSteps && (
            <ProgressBar
              label="Steps"
              value={wellness.steps}
              max={wellness.stepGoal || 8000}
              unit="steps"
              color="linear-gradient(90deg, #ec4899, #f43f5e)"
            />
          )}
          {hasSleep && (
            <ProgressBar
              label="Sleep"
              value={wellness.sleepHours}
              max={8}
              unit="hrs"
              color="linear-gradient(90deg, #8b5cf6, #a78bfa)"
            />
          )}
          {hasMindfulness && (
            <ProgressBar
              label="Mindfulness"
              value={wellness.mindfulMinutes}
              max={30}
              unit="min"
              color="linear-gradient(90deg, #f59e0b, #fbbf24)"
            />
          )}
          {hasMedications && (
            <ProgressBar
              label="Medication Adherence"
              value={adherencePercentage}
              max={100}
              unit="%"
              color="linear-gradient(90deg, #4D50A2, #2F3273)"
            />
          )}
        </div>
      ) : null}

      {/* Health Trends — empty state when no data */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#4D50A2]" />
          Health Trends
        </h2>

        <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4D50A2]/10 dark:bg-white/10 flex items-center justify-center">
            <Activity className="h-6 w-6 text-[#4D50A2] dark:text-indigo-400" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Not enough data yet</p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Your trends will appear here after you log health readings, medications, and wellness data over time.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/dashboard/wellness" className="btn-rect btn-rect-glass text-xs py-1.5 px-3">
              Log Wellness
            </Link>
            <Link href="/dashboard/medications" className="btn-rect btn-rect-glass text-xs py-1.5 px-3">
              Add Medication
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
